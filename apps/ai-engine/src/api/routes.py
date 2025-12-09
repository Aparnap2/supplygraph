"""
REST API endpoints for SupplyGraph frontend integration
"""
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import json
from fastapi import APIRouter, HTTPException, Depends, Query
from fastapi.responses import JSONResponse
from pydantic import BaseModel

# Schemas for API responses
class StatsResponse(BaseModel):
    total_requests: int = 0
    pending_requests: int = 0
    approved_requests: int = 0
    total_spend: float = 0.0
    avg_processing_time: float = 0.0
    monthly_savings: float = 0.0

class ProcurementRequest(BaseModel):
    id: str
    title: str
    description: str
    quantity: int
    unit_price: float
    total_price: float
    category: str
    status: str  # pending, approved, rejected, processing
    created_at: datetime
    updated_at: Optional[datetime] = None
    vendor: Optional[str] = None
    approval_comments: Optional[str] = None

class AIInsight(BaseModel):
    id: str
    title: str
    description: str
    impact: str  # high, medium, low
    category: str  # cost_saving, process_improvement, vendor_optimization
    potential_savings: Optional[float] = None
    created_at: datetime

router = APIRouter(prefix="/api", tags=["rest"])

# Mock data - replace with database integration
MOCK_STATS = StatsResponse(
    total_requests=45,
    pending_requests=8,
    approved_requests=32,
    total_spend=125430.50,
    avg_processing_time=2.3,  # days
    monthly_savings=8750.00
)

MOCK_REQUESTS = [
    ProcurementRequest(
        id="1",
        title="Office Laptops",
        description="Dell XPS 13 laptops for development team",
        quantity=5,
        unit_price=1299.99,
        total_price=6499.95,
        category="IT Equipment",
        status="pending",
        created_at=datetime.now() - timedelta(days=1),
        vendor="Dell Technologies"
    ),
    ProcurementRequest(
        id="2",
        title="Standing Desks",
        description="Ergonomic standing desks for office renovation",
        quantity=10,
        unit_price=599.00,
        total_price=5990.00,
        category="Office Furniture",
        status="approved",
        created_at=datetime.now() - timedelta(days=3),
        updated_at=datetime.now() - timedelta(days=1),
        vendor="Uplift Desks",
        approval_comments="Approved within budget"
    ),
    ProcurementRequest(
        id="3",
        title="Software Licenses",
        description="Microsoft 365 Business Premium licenses",
        quantity=25,
        unit_price=22.00,
        total_price=550.00,
        category="Software",
        status="processing",
        created_at=datetime.now() - timedelta(hours=6),
        vendor="Microsoft"
    )
]

MOCK_INSIGHTS = [
    AIInsight(
        id="1",
        title="Bulk Purchase Opportunity",
        description="Consolidate laptop purchases across departments for volume discount",
        impact="high",
        category="cost_saving",
        potential_savings=2500.00,
        created_at=datetime.now() - timedelta(hours=12)
    ),
    AIInsight(
        id="2",
        title="Alternative Vendor Identified",
        description="Found vendor offering same standing desks at 15% lower cost",
        impact="medium",
        category="vendor_optimization",
        potential_savings=898.50,
        created_at=datetime.now() - timedelta(days=2)
    ),
    AIInsight(
        id="3",
        title="Process Improvement",
        description="Implement automated approval workflow for requests under $1000",
        impact="low",
        category="process_improvement",
        created_at=datetime.now() - timedelta(days=5)
    )
]

@router.get("/stats")
async def get_stats():
    """Get dashboard statistics"""
    # TODO: Replace with actual database queries
    return {
        "success": True,
        "data": {
            "totalRequests": MOCK_STATS.total_requests,
            "totalSavings": MOCK_STATS.monthly_savings,
            "inProgress": MOCK_STATS.pending_requests,
            "activeVendors": 4,  # Mock value
            "requestsThisWeek": 12,  # Mock value
            "averageSavings": 12.5  # Mock value
        },
        "timestamp": datetime.now().isoformat()
    }

@router.get("/requests")
async def get_requests(
    status: Optional[str] = Query(None, description="Filter by status"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    """Get procurement requests with optional filtering"""
    requests = MOCK_REQUESTS

    # Filter by status if provided
    if status:
        requests = [r for r in requests if r.status == status]

    # Apply pagination
    start = offset
    end = start + limit

    # Transform to match frontend interface
    transformed_requests = []
    for r in requests[start:end]:
        transformed_requests.append({
            "id": r.id,
            "title": r.title,
            "description": r.description,
            "category": r.category,
            "status": r.status.upper() if r.status else "PENDING",
            "priority": "MEDIUM",  # Mock value
            "budget": r.total_price,
            "createdBy": "Current User",  # Mock value
            "createdAt": r.created_at.isoformat(),
            "updatedAt": r.updated_at.isoformat() if r.updated_at else None,
            "approvedBy": None,
            "approvedAt": None,
            "bestQuote": None,  # Mock value
            "quotes": [{
                "vendor": r.vendor or "Unknown",
                "amount": r.total_price,
                "delivery": "2 weeks",
                "rating": 4.5
            }] if r.vendor else [],
            "aiRecommendation": None
        })

    return {
        "success": True,
        "data": transformed_requests,
        "timestamp": datetime.now().isoformat()
    }

@router.post("/requests", response_model=ProcurementRequest)
async def create_request(request_data: Dict[str, Any]):
    """Create a new procurement request"""
    # TODO: Implement actual request creation with database
    new_request = ProcurementRequest(
        id=str(len(MOCK_REQUESTS) + 1),
        title=request_data.get("title", "Untitled Request"),
        description=request_data.get("description", ""),
        quantity=request_data.get("quantity", 1),
        unit_price=request_data.get("unit_price", 0.0),
        total_price=request_data.get("quantity", 1) * request_data.get("unit_price", 0.0),
        category=request_data.get("category", "Other"),
        status="pending",
        created_at=datetime.now()
    )
    MOCK_REQUESTS.append(new_request)
    return new_request

@router.get("/ai-insights")
async def get_ai_insights(
    category: Optional[str] = Query(None, description="Filter by category"),
    impact: Optional[str] = Query(None, description="Filter by impact level")
):
    """Get AI-generated insights"""
    insights = MOCK_INSIGHTS

    # Filter by category if provided
    if category:
        insights = [i for i in insights if i.category == category]

    # Filter by impact if provided
    if impact:
        insights = [i for i in insights if i.impact == impact]

    # Transform to match frontend interface
    transformed_insights = []
    for i in insights:
        # Map category to type
        type_mapping = {
            "cost_saving": "opportunity",
            "vendor_optimization": "recommendation",
            "process_improvement": "alert"
        }

        transformed_insights.append({
            "id": i.id,
            "type": type_mapping.get(i.category, "recommendation"),
            "title": i.title,
            "description": i.description,
            "impact": i.impact,
            "potential_savings": i.potential_savings
        })

    return {
        "success": True,
        "data": transformed_insights,
        "timestamp": datetime.now().isoformat()
    }

@router.post("/upload-csv")
async def upload_csv(file_content: Dict[str, Any]):
    """Process CSV upload for bulk procurement requests"""
    try:
        # TODO: Implement actual CSV parsing
        # For now, return mock success response
        return {
            "success": True,
            "message": f"Processed {file_content.get('item_count', 0)} items from CSV",
            "requests_created": file_content.get('item_count', 0),
            "errors": []
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/vendors")
async def get_vendors():
    """Get list of approved vendors"""
    # TODO: Replace with database query
    return {
        "vendors": [
            {"id": "1", "name": "Dell Technologies", "category": "IT Equipment", "rating": 4.5},
            {"id": "2", "name": "Uplift Desks", "category": "Office Furniture", "rating": 4.8},
            {"id": "3", "name": "Microsoft", "category": "Software", "rating": 4.2},
            {"id": "4", "name": "Staples", "category": "Office Supplies", "rating": 4.0}
        ]
    }

@router.get("/health")
async def health_check():
    """API health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}