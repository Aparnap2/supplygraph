"""
Multi-tenant authentication middleware for API endpoints
"""
from typing import Callable, Optional
from fastapi import Request, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
import jwt
from datetime import datetime, timedelta
import os

# JWT Configuration
JWT_SECRET = os.getenv("SECRET_KEY", "supplygraph-secret-key")
JWT_ALGORITHM = "HS256"


class MultiTenantAuthMiddleware(BaseHTTPMiddleware):
    """
    Middleware to enforce multi-tenant authentication and authorization
    """

    async def dispatch(
        self,
        request: Request,
        call_next: Callable
    ) -> Response:
        # Skip auth for WebSocket connections and certain endpoints
        if request.url.path.startswith("/ws/") or self._is_public_endpoint(request.url.path):
            return await call_next(request)

        try:
            # Extract token from Authorization header
            auth_header = request.headers.get("Authorization")
            if not auth_header or not auth_header.startswith("Bearer "):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Missing or invalid authorization header"
                )

            token = auth_header.split(" ")[1]

            # Decode and verify JWT
            payload = jwt.decode(
                token,
                JWT_SECRET,
                algorithms=[JWT_ALGORITHM]
            )

            # Add user context to request state
            request.state.user_id = payload.get("user_id")
            request.state.org_id = payload.get("org_id")
            request.state.role = payload.get("role", "member")

            # Validate required fields
            if not request.state.user_id or not request.state.org_id:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid token: missing user_id or org_id"
                )

            # Add organization context for database operations
            request.state.tenant_context = {
                "user_id": request.state.user_id,
                "org_id": request.state.org_id,
                "role": request.state.role
            }

            response = await call_next(request)

            # Add tenant info to response headers for debugging
            response.headers["X-Tenant-ID"] = request.state.org_id
            response.headers["X-User-ID"] = request.state.user_id

            return response

        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired"
            )
        except jwt.JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Authentication error: {str(e)}"
            )

    def _is_public_endpoint(self, path: str) -> bool:
        """Check if the endpoint is public (doesn't require auth)"""
        public_paths = [
            "/",
            "/health",
            "/docs",
            "/openapi.json",
            "/redoc",
            "/favicon.ico",
            "/auth/login",
            "/auth/register",
            "/ws/"  # WebSocket connections have their own auth
        ]
        return any(path.startswith(p) for p in public_paths)


def create_auth_token(user_id: str, org_id: str, role: str = "member") -> str:
    """
    Create a JWT token for authenticated user
    """
    payload = {
        "user_id": user_id,
        "org_id": org_id,
        "role": role,
        "exp": datetime.utcnow() + timedelta(hours=24),
        "iat": datetime.utcnow()
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def verify_tenant_access(request: Request, resource_org_id: str) -> bool:
    """
    Verify if user has access to the requested organization's resources
    """
    if not hasattr(request.state, "org_id"):
        return False

    # Users can only access their own organization's data
    return request.state.org_id == resource_org_id


def check_role_permission(user_role: str, required_role: str) -> bool:
    """
    Check if user role has the required permission
    Role hierarchy: owner > admin > manager > member > viewer
    """
    role_hierarchy = {
        "owner": 5,
        "admin": 4,
        "manager": 3,
        "member": 2,
        "viewer": 1
    }

    user_level = role_hierarchy.get(user_role, 0)
    required_level = role_hierarchy.get(required_role, 0)

    return user_level >= required_level