"""LLM service for intelligent text processing and quote extraction."""

from typing import Dict, Any, List, Optional
import json

import structlog
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import ChatPromptTemplate

from ..config import get_settings

logger = structlog.get_logger(__name__)


class LLMService:
    """Service for LLM-powered text processing and extraction."""
    
    def __init__(self):
        self.settings = get_settings()
        self.llm = ChatOpenAI(
            model=self.settings.llm_model,
            base_url=self.settings.openai_base_url,
            api_key=self.settings.openai_api_key or "ollama",  # Ollama doesn't need real API key
            temperature=0.1,  # Low temperature for consistent extraction
        )
        self.json_parser = JsonOutputParser()
    
    async def extract_quote_from_text(self, text: str) -> Dict[str, Any]:
        """Extract quote information from plain text."""
        try:
            logger.info("Extracting quote from text", text_length=len(text))
            
            system_prompt = """You are an expert at extracting procurement quote information from text.
            Extract the following information from the provided text and return it as valid JSON:
            
            {
                "vendor_info": {
                    "name": "Company name",
                    "email": "contact email",
                    "phone": "phone number",
                    "website": "website URL"
                },
                "items": [
                    {
                        "name": "Item name",
                        "description": "Item description",
                        "quantity": 1,
                        "unit_price": 0.0,
                        "total_price": 0.0,
                        "unit": "each/kg/etc",
                        "specifications": {}
                    }
                ],
                "pricing": {
                    "subtotal": 0.0,
                    "tax": 0.0,
                    "shipping": 0.0,
                    "total_amount": 0.0,
                    "currency": "USD"
                },
                "terms": {
                    "payment_terms": "Payment terms",
                    "delivery_time": "Delivery timeframe",
                    "valid_until": "Quote validity date",
                    "warranty": "Warranty information"
                },
                "delivery": {
                    "days": 0,
                    "method": "Delivery method",
                    "cost": 0.0
                }
            }
            
            If information is not available, use empty strings for text fields and 0 for numeric fields.
            Be precise with numbers and ensure all prices are extracted as floats.
            """
            
            prompt = ChatPromptTemplate.from_messages([
                ("system", system_prompt),
                ("human", "Extract quote information from this text:\n\n{text}")
            ])
            
            chain = prompt | self.llm | self.json_parser
            
            result = await chain.ainvoke({"text": text})
            
            logger.info("Quote extraction completed", extracted_items=len(result.get("items", [])))
            return result
            
        except Exception as e:
            logger.error("Failed to extract quote from text", error=str(e))
            return self._get_empty_quote_structure()
    
    async def extract_quote_from_document(self, document_data: Dict[str, Any]) -> Dict[str, Any]:
        """Extract quote information from processed document data."""
        try:
            text = document_data.get("text", "")
            markdown = document_data.get("markdown", "")
            tables = document_data.get("tables", [])
            
            # Use markdown if available (better structure), otherwise use plain text
            content = markdown if markdown else text
            
            # Add table information to the content
            if tables:
                content += "\n\nTables found in document:\n"
                for i, table in enumerate(tables):
                    content += f"\nTable {i+1}:\n{table.get('raw_data', '')}\n"
            
            return await self.extract_quote_from_text(content)
            
        except Exception as e:
            logger.error("Failed to extract quote from document", error=str(e))
            return self._get_empty_quote_structure()
    
    async def classify_email_content(self, subject: str, body: str) -> Dict[str, Any]:
        """Classify email content to determine if it contains a quote."""
        try:
            system_prompt = """You are an expert at classifying business emails.
            Analyze the email subject and body to determine if it contains a procurement quote or quotation.
            
            Return your analysis as JSON:
            {
                "is_quote": true/false,
                "confidence": 0.0-1.0,
                "reasoning": "Brief explanation of your decision",
                "quote_type": "formal_quote|informal_estimate|price_list|other",
                "indicators": {
                    "has_pricing": true/false,
                    "has_items": true/false,
                    "has_terms": true/false,
                    "has_vendor_info": true/false
                }
            }
            """
            
            prompt = ChatPromptTemplate.from_messages([
                ("system", system_prompt),
                ("human", "Subject: {subject}\n\nBody: {body}")
            ])
            
            chain = prompt | self.llm | self.json_parser
            
            result = await chain.ainvoke({"subject": subject, "body": body})
            
            logger.info(
                "Email classification completed",
                is_quote=result.get("is_quote", False),
                confidence=result.get("confidence", 0.0)
            )
            
            return result
            
        except Exception as e:
            logger.error("Failed to classify email", error=str(e))
            return {
                "is_quote": False,
                "confidence": 0.0,
                "reasoning": f"Classification failed: {str(e)}",
                "quote_type": "other",
                "indicators": {
                    "has_pricing": False,
                    "has_items": False,
                    "has_terms": False,
                    "has_vendor_info": False,
                }
            }
    
    async def normalize_quote_data(
        self,
        extracted_quote: Dict[str, Any],
        request_items: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Normalize and validate extracted quote data against request items."""
        try:
            system_prompt = """You are an expert at normalizing procurement quote data.
            Given an extracted quote and the original request items, normalize and validate the quote data.
            
            Tasks:
            1. Match quote items to request items where possible
            2. Standardize units and measurements
            3. Validate pricing calculations
            4. Fill in missing information where reasonable
            5. Flag any inconsistencies or concerns
            
            Return normalized data as JSON with the same structure as the input quote,
            plus a "validation" section:
            {
                ...original_structure...,
                "validation": {
                    "is_valid": true/false,
                    "confidence_score": 0.0-1.0,
                    "warnings": ["list of warnings"],
                    "errors": ["list of errors"],
                    "matched_items": 0,
                    "total_items": 0
                }
            }
            """
            
            prompt = ChatPromptTemplate.from_messages([
                ("system", system_prompt),
                ("human", "Original Request Items:\n{request_items}\n\nExtracted Quote:\n{extracted_quote}")
            ])
            
            chain = prompt | self.llm | self.json_parser
            
            result = await chain.ainvoke({
                "request_items": json.dumps(request_items, indent=2),
                "extracted_quote": json.dumps(extracted_quote, indent=2)
            })
            
            logger.info(
                "Quote normalization completed",
                is_valid=result.get("validation", {}).get("is_valid", False),
                confidence=result.get("validation", {}).get("confidence_score", 0.0)
            )
            
            return result
            
        except Exception as e:
            logger.error("Failed to normalize quote data", error=str(e))
            # Return original data with error validation
            extracted_quote["validation"] = {
                "is_valid": False,
                "confidence_score": 0.0,
                "warnings": [],
                "errors": [f"Normalization failed: {str(e)}"],
                "matched_items": 0,
                "total_items": len(extracted_quote.get("items", []))
            }
            return extracted_quote
    
    async def generate_rfq_content(
        self,
        request_data: Dict[str, Any],
        vendor_info: Dict[str, Any]
    ) -> str:
        """Generate personalized RFQ content for a vendor."""
        try:
            system_prompt = """You are an expert at writing professional procurement RFQ (Request for Quote) emails.
            Generate a clear, professional RFQ email that includes all necessary information for the vendor to provide an accurate quote.
            
            The email should:
            1. Be professional and courteous
            2. Clearly specify all items and requirements
            3. Include delivery expectations
            4. Request specific information in the response
            5. Be personalized for the vendor
            
            Return only the email body text, no subject line.
            """
            
            prompt = ChatPromptTemplate.from_messages([
                ("system", system_prompt),
                ("human", "Request Details:\n{request_data}\n\nVendor Information:\n{vendor_info}")
            ])
            
            chain = prompt | self.llm
            
            result = await chain.ainvoke({
                "request_data": json.dumps(request_data, indent=2),
                "vendor_info": json.dumps(vendor_info, indent=2)
            })
            
            return result.content
            
        except Exception as e:
            logger.error("Failed to generate RFQ content", error=str(e))
            # Return a basic template as fallback
            return self._get_basic_rfq_template(request_data, vendor_info)
    
    def _get_empty_quote_structure(self) -> Dict[str, Any]:
        """Return empty quote structure for error cases."""
        return {
            "vendor_info": {
                "name": "",
                "email": "",
                "phone": "",
                "website": ""
            },
            "items": [],
            "pricing": {
                "subtotal": 0.0,
                "tax": 0.0,
                "shipping": 0.0,
                "total_amount": 0.0,
                "currency": "USD"
            },
            "terms": {
                "payment_terms": "",
                "delivery_time": "",
                "valid_until": "",
                "warranty": ""
            },
            "delivery": {
                "days": 0,
                "method": "",
                "cost": 0.0
            }
        }
    
    def _get_basic_rfq_template(
        self,
        request_data: Dict[str, Any],
        vendor_info: Dict[str, Any]
    ) -> str:
        """Generate basic RFQ template as fallback."""
        vendor_name = vendor_info.get("name", "Vendor")
        title = request_data.get("title", "Procurement Request")
        
        items_text = ""
        for item in request_data.get("items", []):
            items_text += f"- {item.get('name', 'Item')} (Quantity: {item.get('quantity', 1)})\n"
        
        return f"""Dear {vendor_name},

We are requesting a quote for the following items:

{items_text}

Request Details:
- Title: {title}
- Description: {request_data.get('description', 'N/A')}

Please provide your quote including:
- Unit prices and total cost
- Delivery timeframe
- Payment terms
- Any additional conditions

Please reply to this email with your quote.

Best regards,
Procurement Team
"""