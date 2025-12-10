"""Vendor service for managing vendor operations."""

from typing import Dict, Any, List, Optional

import structlog

from ..database import with_tenant

logger = structlog.get_logger(__name__)


class VendorService:
    """Service for vendor management operations."""
    
    async def get_vendors_for_org(self, org_id: str, active_only: bool = True) -> List[Dict[str, Any]]:
        """Get all vendors for an organization."""
        async with with_tenant(org_id) as db:
            where_clause = {"orgId": org_id}
            if active_only:
                where_clause["isActive"] = True
            
            vendors = await db.vendor.find_many(where=where_clause)
            
            return [
                {
                    "id": vendor.id,
                    "name": vendor.name,
                    "email": vendor.email,
                    "phone": vendor.phone,
                    "website": vendor.website,
                    "address": vendor.address,
                    "metadata": vendor.metadata,
                    "is_active": vendor.isActive,
                    "created_at": vendor.createdAt,
                    "updated_at": vendor.updatedAt,
                }
                for vendor in vendors
            ]
    
    async def create_vendor(self, org_id: str, vendor_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new vendor."""
        async with with_tenant(org_id) as db:
            vendor = await db.vendor.create(
                data={
                    "orgId": org_id,
                    "name": vendor_data["name"],
                    "email": vendor_data["email"],
                    "phone": vendor_data.get("phone"),
                    "website": vendor_data.get("website"),
                    "address": vendor_data.get("address"),
                    "metadata": vendor_data.get("metadata", {}),
                    "isActive": vendor_data.get("is_active", True),
                }
            )
            
            logger.info("Vendor created", vendor_id=vendor.id, name=vendor.name)
            
            return {
                "id": vendor.id,
                "name": vendor.name,
                "email": vendor.email,
                "phone": vendor.phone,
                "website": vendor.website,
                "address": vendor.address,
                "metadata": vendor.metadata,
                "is_active": vendor.isActive,
                "created_at": vendor.createdAt,
                "updated_at": vendor.updatedAt,
            }
    
    async def update_vendor(
        self,
        org_id: str,
        vendor_id: str,
        vendor_data: Dict[str, Any]
    ) -> Optional[Dict[str, Any]]:
        """Update an existing vendor."""
        async with with_tenant(org_id) as db:
            vendor = await db.vendor.update(
                where={"id": vendor_id, "orgId": org_id},
                data={
                    key: value for key, value in vendor_data.items()
                    if key in ["name", "email", "phone", "website", "address", "metadata", "isActive"]
                }
            )
            
            if vendor:
                logger.info("Vendor updated", vendor_id=vendor.id, name=vendor.name)
                
                return {
                    "id": vendor.id,
                    "name": vendor.name,
                    "email": vendor.email,
                    "phone": vendor.phone,
                    "website": vendor.website,
                    "address": vendor.address,
                    "metadata": vendor.metadata,
                    "is_active": vendor.isActive,
                    "created_at": vendor.createdAt,
                    "updated_at": vendor.updatedAt,
                }
            
            return None
    
    async def delete_vendor(self, org_id: str, vendor_id: str) -> bool:
        """Delete a vendor (soft delete by setting inactive)."""
        async with with_tenant(org_id) as db:
            vendor = await db.vendor.update(
                where={"id": vendor_id, "orgId": org_id},
                data={"isActive": False}
            )
            
            if vendor:
                logger.info("Vendor deactivated", vendor_id=vendor.id, name=vendor.name)
                return True
            
            return False
    
    async def find_vendor_by_email(self, org_id: str, email: str) -> Optional[Dict[str, Any]]:
        """Find a vendor by email address."""
        async with with_tenant(org_id) as db:
            vendor = await db.vendor.find_first(
                where={"orgId": org_id, "email": email}
            )
            
            if vendor:
                return {
                    "id": vendor.id,
                    "name": vendor.name,
                    "email": vendor.email,
                    "phone": vendor.phone,
                    "website": vendor.website,
                    "address": vendor.address,
                    "metadata": vendor.metadata,
                    "is_active": vendor.isActive,
                    "created_at": vendor.createdAt,
                    "updated_at": vendor.updatedAt,
                }
            
            return None