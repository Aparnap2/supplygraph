"""
Authentication service for AI Engine integration with Better Auth
"""
import os
import httpx
from typing import Optional, Dict, Any
import asyncio
from functools import lru_cache


class AuthService:
    """Service for handling authentication and authorization with Better Auth"""

    def __init__(self):
        self.auth_url = os.getenv("BETTER_AUTH_URL", "http://localhost:3000/api/auth")
        self.api_key = os.getenv("SUPPLYGRAPH_API_KEY", "dev-key")
        self._http_client: Optional[httpx.AsyncClient] = None

    async def _get_client(self) -> httpx.AsyncClient:
        """Get or create HTTP client"""
        if not self._http_client:
            self._http_client = httpx.AsyncClient(
                base_url=self.auth_url,
                headers={"Authorization": f"Bearer {self.api_key}"}
            )
        return self._http_client

    async def verify_user_org_access(self, user_id: str, org_id: str) -> bool:
        """Verify user has access to the specified organization"""
        try:
            client = await self._get_client()

            # Call Better Auth organization endpoint
            response = await client.get(
                f"/organizations/{org_id}/members/{user_id}"
            )

            if response.status_code == 200:
                member_data = response.json()
                return member_data.get("active", False)

            return False

        except Exception as e:
            print(f"L Auth verification failed: {e}")
            # In development, we might want to be more permissive
            if os.getenv("NODE_ENV") == "development":
                return True
            return False

    async def get_user_context(self, user_id: str, org_id: str) -> Optional[Dict[str, Any]]:
        """Get user context including permissions and roles"""
        try:
            client = await self._get_client()

            # Get user details
            user_response = await client.get(f"/users/{user_id}")
            if user_response.status_code != 200:
                return None

            # Get organization membership
            member_response = await client.get(
                f"/organizations/{org_id}/members/{user_id}"
            )
            if member_response.status_code != 200:
                return None

            user_data = user_response.json()
            member_data = member_response.json()

            return {
                "user_id": user_id,
                "org_id": org_id,
                "email": user_data.get("email"),
                "name": user_data.get("name"),
                "role": member_data.get("role"),
                "permissions": member_data.get("permissions", []),
                "is_active": member_data.get("active", False)
            }

        except Exception as e:
            print(f"L Failed to get user context: {e}")
            return None

    async def validate_api_key(self, api_key: str) -> bool:
        """Validate API key for external service authentication"""
        return api_key == self.api_key

    async def close(self):
        """Close HTTP client"""
        if self._http_client:
            await self._http_client.aclose()

    @lru_cache(maxsize=128)
    def get_cached_permissions(self, user_id: str, org_id: str) -> frozenset:
        """Cache user permissions for better performance"""
        # This is a simplified cache - in production you'd want to use Redis
        return frozenset(["read", "write", "approve"])  # Default permissions for dev