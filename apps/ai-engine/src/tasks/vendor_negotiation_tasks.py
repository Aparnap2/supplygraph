"""
Celery tasks for vendor email negotiations in procurement workflow
"""
import asyncio
import json
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta

from ..celery_config import workflow_task, background_task
from ..services.vendor_email_service import VendorEmailService, VendorQuoteRequest
from ..utils.valkey_manager import get_state_redis

logger = logging.getLogger(__name__)

@workflow_task
async def initiate_vendor_negotiation(self, procurement_data: Dict[str, Any]) -> Dict[str, Any]:
    # Also allow direct calling without self for testing
    if not isinstance(self, object) or hasattr(self, '__name__'):
        # Called directly, not as Celery task
        return await _initiate_vendor_negotiation_impl(procurement_data)
    
    return await _initiate_vendor_negotiation_impl(procurement_data)

async def _initiate_vendor_negotiation_impl(procurement_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Initiate vendor negotiation process by sending quote requests
    This is the core agentic negotiation functionality per PRD requirements
    """
    try:
        # Extract procurement details
        org_id = procurement_data.get('org_id')
        procurement_id = procurement_data.get('procurement_id')
        items = procurement_data.get('items', [])
        user_id = procurement_data.get('user_id')
        
        if not all([org_id, procurement_id, items]):
            raise ValueError("Missing required procurement data")
        
        # Get vendor list from organization settings
        vendors = _get_organization_vendors(org_id)
        
        if not vendors:
            logger.warning(f"No vendors found for organization {org_id}")
            return {
                'success': False,
                'error': 'No vendors configured for organization',
                'procurement_id': procurement_id
            }
        
        # Create quote requests
        quote_requests = []
        deadline = datetime.utcnow() + timedelta(hours=48)  # 48-hour response deadline
        
        for vendor in vendors:
            request = VendorQuoteRequest(
                vendor_id=vendor['id'],
                vendor_name=vendor['name'],
                vendor_email=vendor['email'],
                items=items,
                organization_id=org_id,
                procurement_id=procurement_id,
                deadline=deadline,
                special_instructions=procurement_data.get('special_instructions')
            )
            quote_requests.append(request)
        
        # Initialize email service
        smtp_config = _get_smtp_config(org_id)
        email_service = VendorEmailService(smtp_config)
        
        # Send quote requests to all vendors
        email_results = await email_service.send_quote_requests(quote_requests)
        
        # Store negotiation state in Redis for tracking
        state_redis = await get_state_redis()
        negotiation_key = f"negotiation:{procurement_id}"
        
        negotiation_state = {
            'procurement_id': procurement_id,
            'org_id': org_id,
            'user_id': user_id,
            'status': 'awaiting_quotes',
            'vendors_contacted': len(vendors),
            'vendors_responded': 0,
            'quotes_received': [],
            'deadline': deadline.isoformat(),
            'initiated_at': datetime.utcnow().isoformat(),
            'email_results': email_results
        }
        
        await state_redis.hset(negotiation_key, mapping=negotiation_state)
        await state_redis.expire(negotiation_key, 86400)  # 24 hours TTL
        
        logger.info(f"Initiated vendor negotiation for procurement {procurement_id}: "
                   f"contacted {len(vendors)} vendors")
        
        return {
            'success': True,
            'procurement_id': procurement_id,
            'vendors_contacted': len(vendors),
            'deadline': deadline.isoformat(),
            'email_results': email_results,
            'negotiation_key': negotiation_key
        }
        
    except Exception as e:
        logger.error(f"Failed to initiate vendor negotiation: {e}")
        raise Exception(f"Failed to initiate vendor negotiation: {e}")

@workflow_task
async def process_vendor_quote(self, quote_data: Dict[str, Any]) -> Dict[str, Any]:
    # Also allow direct calling without self for testing
    if not isinstance(self, object) or hasattr(self, '__name__'):
        # Called directly, not as Celery task
        return await _process_vendor_quote_impl(quote_data)
    
    return await _process_vendor_quote_impl(quote_data)

async def _process_vendor_quote_impl(quote_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Process incoming vendor quote response
    """
    try:
        procurement_id = quote_data.get('procurement_id')
        vendor_id = quote_data.get('vendor_id')
        
        if not procurement_id or not vendor_id:
            raise ValueError("Missing procurement_id or vendor_id")
        
        # Get email service
        org_id = quote_data.get('org_id')
        smtp_config = _get_smtp_config(org_id)
        email_service = VendorEmailService(smtp_config)
        
        # Process the quote response
        process_result = await email_service.process_vendor_response(vendor_id, quote_data)
        
        if process_result['success']:
            # Update negotiation state
            state_redis = await get_state_redis()
            negotiation_key = f"negotiation:{procurement_id}"
            
            # Get current negotiation state
            current_state = await state_redis.hgetall(negotiation_key)
            if current_state:
                quotes_received = json.loads(current_state.get('quotes_received', '[]'))
                vendors_responded = int(current_state.get('vendors_responded', '0'))
                
                # Add new quote
                new_quote = {
                    'vendor_id': vendor_id,
                    'quote_id': process_result['quote_id'],
                    'total_amount': process_result['total_amount'],
                    'delivery_time': quote_data.get('delivery_time'),
                    'items': quote_data.get('items', []),
                    'received_at': process_result['processed_at'],
                    'valid_until': (datetime.utcnow() + timedelta(days=7)).isoformat()
                }
                quotes_received.append(new_quote)
                vendors_responded += 1
                
                # Update state
                updated_state = {
                    **current_state,
                    'vendors_responded': str(vendors_responded),
                    'quotes_received': json.dumps(quotes_received),
                    'last_quote_received': process_result['processed_at']
                }
                
                await state_redis.hset(negotiation_key, mapping=updated_state)
                
                logger.info(f"Processed quote from vendor {vendor_id} for procurement {procurement_id}")
        
        return {
            'success': process_result['success'],
            'procurement_id': procurement_id,
            'vendor_id': vendor_id,
            'quote_id': process_result.get('quote_id'),
            'processed_at': process_result.get('processed_at')
        }
        
    except Exception as e:
        logger.error(f"Failed to process vendor quote: {e}")
        raise Exception(f"Failed to process vendor quote: {e}")

@workflow_task
async def check_negotiation_status(self, procurement_id: str) -> Dict[str, Any]:
    # Also allow direct calling without self for testing
    if not isinstance(self, object) or hasattr(self, '__name__'):
        # Called directly, not as Celery task
        return await _check_negotiation_status_impl(procurement_id)
    
    return await _check_negotiation_status_impl(procurement_id)

async def _check_negotiation_status_impl(procurement_id: str) -> Dict[str, Any]:
    """
    Check status of vendor negotiation process
    """
    try:
        state_redis = await get_state_redis()
        negotiation_key = f"negotiation:{procurement_id}"
        
        negotiation_state = await state_redis.hgetall(negotiation_key)
        
        if not negotiation_state:
            return {
                'success': False,
                'error': f'No negotiation found for procurement {procurement_id}'
            }
        
        # Parse quotes
        quotes_received = json.loads(negotiation_state.get('quotes_received', '[]'))
        vendors_responded = int(negotiation_state.get('vendors_responded', '0'))
        vendors_contacted = int(negotiation_state.get('vendors_contacted', '0'))
        
        # Check if deadline has passed
        deadline_str = negotiation_state.get('deadline')
        deadline_passed = False
        if deadline_str:
            deadline = datetime.fromisoformat(deadline_str)
            if datetime.utcnow() > deadline:
                deadline_passed = True
        
        # Determine status
        status = 'awaiting_quotes'
        if vendors_responded > 0:
            status = 'receiving_quotes'
        if vendors_responded >= vendors_contacted:
            status = 'quotes_complete'
        if deadline_passed:
            status = 'deadline_passed'
        
        return {
            'success': True,
            'procurement_id': procurement_id,
            'status': status,
            'vendors_contacted': vendors_contacted,
            'vendors_responded': vendors_responded,
            'quotes_received': len(quotes_received),
            'quotes': quotes_received,
            'deadline': negotiation_state.get('deadline'),
            'deadline_passed': deadline_passed,
            'initiated_at': negotiation_state.get('initiated_at')
        }
        
    except Exception as e:
        logger.error(f"Failed to check negotiation status: {e}")
        raise Exception(f"Failed to check negotiation status: {e}")

@background_task
async def send_negotiation_reminders(self) -> Dict[str, Any]:
    # Also allow direct calling without self for testing
    if not isinstance(self, object) or hasattr(self, '__name__'):
        # Called directly, not as Celery task
        return await _send_negotiation_reminders_impl()
    
    return await _send_negotiation_reminders_impl()

async def _send_negotiation_reminders_impl() -> Dict[str, Any]:
    """
    Send follow-up reminders to vendors who haven't responded
    """
    try:
        state_redis = await get_state_redis()
        
        # Find all active negotiations
        negotiation_keys = await state_redis.keys("negotiation:*")
        reminders_sent = 0
        
        for negotiation_key in negotiation_keys:
            try:
                negotiation_state = await state_redis.hgetall(negotiation_key)
                
                if not negotiation_state:
                    continue
                
                # Check if reminders are needed
                last_reminder_str = negotiation_state.get('last_reminder_sent')
                if last_reminder_str:
                    last_reminder = datetime.fromisoformat(last_reminder_str)
                    # Only send reminders every 12 hours
                    if datetime.utcnow() - last_reminder < timedelta(hours=12):
                        continue
                
                # Get email service
                org_id = negotiation_state.get('org_id')
                smtp_config = _get_smtp_config(org_id)
                email_service = VendorEmailService(smtp_config)
                
                # Send follow-up reminders
                reminder_results = await email_service.send_follow_up_reminders()
                reminders_sent += reminder_results.get('reminders_sent', 0)
                
                # Update last reminder timestamp
                await state_redis.hset(
                    negotiation_key,
                    'last_reminder_sent',
                    datetime.utcnow().isoformat()
                )
                
            except Exception as e:
                logger.warning(f"Error processing negotiation {negotiation_key}: {e}")
                continue
        
        logger.info(f"Sent {reminders_sent} negotiation follow-up reminders")
        
        return {
            'success': True,
            'reminders_sent': reminders_sent,
            'negotiations_processed': len(negotiation_keys)
        }
        
    except Exception as e:
        logger.error(f"Failed to send negotiation reminders: {e}")
        raise Exception(f"Failed to send negotiation reminders: {e}")

@workflow_task
async def finalize_negotiation(self, procurement_id: str) -> Dict[str, Any]:
    # Also allow direct calling without self for testing
    if not isinstance(self, object) or hasattr(self, '__name__'):
        # Called directly, not as Celery task
        return await _finalize_negotiation_impl(procurement_id)
    
    return await _finalize_negotiation_impl(procurement_id)

async def _finalize_negotiation_impl(procurement_id: str) -> Dict[str, Any]:
    """
    Finalize negotiation process and prepare quotes for workflow
    """
    try:
        state_redis = await get_state_redis()
        negotiation_key = f"negotiation:{procurement_id}"
        
        negotiation_state = await state_redis.hgetall(negotiation_key)
        
        if not negotiation_state:
            return {
                'success': False,
                'error': f'No negotiation found for procurement {procurement_id}'
            }
        
        # Parse quotes
        quotes_received = json.loads(negotiation_state.get('quotes_received', '[]'))
        
        if not quotes_received:
            return {
                'success': False,
                'error': 'No quotes received from vendors',
                'procurement_id': procurement_id
            }
        
        # Normalize quotes for workflow
        normalized_quotes = []
        for quote in quotes_received:
            normalized_quotes.append({
                'id': quote['quote_id'],
                'vendor': quote['vendor_id'],
                'vendor_name': f"Vendor {quote['vendor_id']}",  # Would be resolved from DB
                'items': quote['items'],
                'total_amount': quote['total_amount'],
                'delivery_time': quote['delivery_time'],
                'valid_until': quote['valid_until'],
                'received_at': quote['received_at']
            })
        
        # Sort by total amount (lowest first)
        normalized_quotes.sort(key=lambda q: q['total_amount'])
        
        # Update negotiation status
        await state_redis.hset(negotiation_key, 'status', 'finalized')
        await state_redis.hset(negotiation_key, 'finalized_at', datetime.utcnow().isoformat())
        
        logger.info(f"Finalized negotiation for procurement {procurement_id}: "
                   f"{len(normalized_quotes)} quotes processed")
        
        return {
            'success': True,
            'procurement_id': procurement_id,
            'quotes': normalized_quotes,
            'quotes_count': len(normalized_quotes),
            'best_quote': normalized_quotes[0] if normalized_quotes else None,
            'finalized_at': datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Failed to finalize negotiation: {e}")
        raise Exception(f"Failed to finalize negotiation: {e}")

# Helper functions
def _get_organization_vendors(org_id: str) -> List[Dict[str, Any]]:
    """
    Get vendor list for organization
    In production, this would query the database
    """
    # Mock vendor data for testing
    return [
        {
            'id': 'vendor_001',
            'name': 'TechCorp Solutions',
            'email': 'procurement@techcorp.com',
            'phone': '+1-555-0123',
            'specialties': ['Electronics', 'Computers', 'Office Equipment']
        },
        {
            'id': 'vendor_002',
            'name': 'Office Supplies Inc',
            'email': 'quotes@officesupplies.com',
            'phone': '+1-555-0124',
            'specialties': ['Office Supplies', 'Furniture', 'Equipment']
        },
        {
            'id': 'vendor_003',
            'name': 'GlobalTech Distributors',
            'email': 'b2b@globaltech.com',
            'phone': '+1-555-0125',
            'specialties': ['Technology', 'IT Equipment', 'Hardware']
        }
    ]

def _get_smtp_config(org_id: str) -> Dict[str, Any]:
    """
    Get SMTP configuration for organization
    In production, this would come from organization settings
    """
    # Mock SMTP config for testing
    return {
        'smtp_server': 'smtp.gmail.com',
        'smtp_port': 587,
        'smtp_username': f'procurement-{org_id}@company.com',
        'smtp_password': 'app_password_here',
        'use_tls': True,
        'from_email': f'procurement-{org_id}@company.com',
        'from_name': f'{org_id} Procurement System'
    }