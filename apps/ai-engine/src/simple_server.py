"""
Simple standalone FastAPI server for testing the SupplyGraph platform
"""
import os
import sys
import json
import asyncio
from typing import Dict, Any, List, Optional
from datetime import datetime

from fastapi import FastAPI, HTTPException, File, UploadFile, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import pandas as pd
import io

# Initialize FastAPI app
app = FastAPI(
    title="SupplyGraph Test API",
    description="Test API for procurement automation platform",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Sample data
sample_requests = [
    {
        "id": "REQ-001",
        "item_name": "Office Chairs",
        "category": "Furniture",
        "quantity": 10,
        "unit_price": 150.00,
        "total_value": 1500.00,
        "priority": "HIGH",
        "status": "pending_approval",
        "requester": "John Doe",
        "department": "Facilities",
        "created_at": "2024-01-15T10:30:00Z",
        "vendor": "Office Furniture Inc.",
        "description": "Ergonomic office chairs for new workspace"
    },
    {
        "id": "REQ-002",
        "item_name": "Laptops",
        "category": "IT Equipment",
        "quantity": 5,
        "unit_price": 1200.00,
        "total_value": 6000.00,
        "priority": "MEDIUM",
        "status": "in_progress",
        "requester": "Jane Smith",
        "department": "IT",
        "created_at": "2024-01-14T14:20:00Z",
        "vendor": "Tech Supplies Ltd",
        "description": "Dell Latitude laptops for development team"
    },
    {
        "id": "REQ-003",
        "item_name": "Safety Helmets",
        "category": "Safety Equipment",
        "quantity": 20,
        "unit_price": 45.00,
        "total_value": 900.00,
        "priority": "CRITICAL",
        "status": "approved",
        "requester": "Mike Johnson",
        "department": "Operations",
        "created_at": "2024-01-13T09:15:00Z",
        "vendor": "SafetyFirst Corp",
        "description": "Construction site safety helmets"
    }
]

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except:
                pass

manager = ConnectionManager()

# Models
class ChatMessage(BaseModel):
    message: str
    org_id: str = "test-org"
    user_id: str = "test-user"

class EmailRequest(BaseModel):
    to: str
    subject: str
    body: str
    vendor_id: Optional[str] = None

# Stats endpoint
@app.get("/api/stats")
async def get_stats():
    """Get dashboard statistics"""
    total_requests = len(sample_requests)
    savings_amount = 12500.00  # Sample savings data
    in_progress = len([r for r in sample_requests if r["status"] == "in_progress"])
    active_vendors = len(set(r["vendor"] for r in sample_requests))

    return {
        "total_requests": total_requests,
        "savings_amount": savings_amount,
        "savings_percentage": 15.5,
        "in_progress": in_progress,
        "active_vendors": active_vendors,
        "pending_approval": len([r for r in sample_requests if r["status"] == "pending_approval"]),
        "this_month_requests": 8,
        "last_month_requests": 12
    }

# AI Insights endpoint
@app.get("/api/ai-insights")
async def get_ai_insights():
    """Get AI-powered insights"""
    return {
        "insights": [
            {
                "type": "cost_savings",
                "title": "Potential Savings Detected",
                "description": "Bulk ordering office chairs could save 15% on unit price",
                "potential_savings": 225.00,
                "request_ids": ["REQ-001"]
            },
            {
                "type": "vendor_optimization",
                "title": "Better Vendor Available",
                "description": "Tech Supplies Ltd offers better warranty for laptops",
                "potential_savings": 300.00,
                "request_ids": ["REQ-002"]
            },
            {
                "type": "priority_alert",
                "title": "Urgent Review Needed",
                "description": "Safety equipment request requires immediate attention",
                "potential_savings": 0,
                "request_ids": ["REQ-003"]
            }
        ]
    }

# Requests endpoints
@app.get("/api/requests")
async def get_requests():
    """Get all procurement requests"""
    return {
        "requests": sample_requests,
        "total": len(sample_requests)
    }

@app.get("/api/requests/{request_id}")
async def get_request(request_id: str):
    """Get specific request details"""
    request = next((r for r in sample_requests if r["id"] == request_id), None)
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    return request

# Email endpoint
@app.post("/api/email")
async def send_email(request: EmailRequest):
    """Send email (mock implementation)"""
    print(f"Sending email to {request.to}")
    print(f"Subject: {request.subject}")
    print(f"Body: {request.body[:100]}...")

    # Simulate email sending
    await asyncio.sleep(0.5)

    return {
        "success": True,
        "message": "Email sent successfully",
        "email_id": f"EMAIL-{datetime.now().strftime('%Y%m%d%H%M%S')}"
    }

# CSV Upload endpoint
@app.post("/api/upload-csv")
async def upload_csv(file: UploadFile = File(...)):
    """Upload and parse CSV file"""
    if not file.filename.endswith(('.csv', '.xlsx', '.xls')):
        raise HTTPException(status_code=400, detail="Invalid file format")

    try:
        contents = await file.read()

        if file.filename.endswith('.csv'):
            df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
        else:
            df = pd.read_excel(io.BytesIO(contents))

        # Validate required columns
        required_columns = ['item_name', 'category', 'quantity', 'unit_price', 'priority']
        missing_columns = [col for col in required_columns if col not in df.columns]

        if missing_columns:
            raise HTTPException(
                status_code=400,
                detail=f"Missing required columns: {', '.join(missing_columns)}"
            )

        # Convert to list of requests
        new_requests = []
        for _, row in df.iterrows():
            new_requests.append({
                "id": f"REQ-{datetime.now().strftime('%Y%m%d')}-{len(new_requests)+1:03d}",
                "item_name": row['item_name'],
                "category": row['category'],
                "quantity": int(row['quantity']),
                "unit_price": float(row['unit_price']),
                "total_value": float(row['quantity']) * float(row['unit_price']),
                "priority": row['priority'].upper(),
                "status": "pending_approval",
                "requester": "CSV Upload",
                "department": "General",
                "created_at": datetime.now().isoformat() + "Z",
                "vendor": "To be determined",
                "description": row.get('description', '')
            })

        return {
            "success": True,
            "message": f"Successfully processed {len(new_requests)} requests",
            "requests": new_requests
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

# WebSocket endpoint for chat
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()

            # Parse message
            try:
                message_data = json.loads(data)
                user_message = message_data.get('message', '')
            except:
                user_message = data

            # Simulate AI response
            await asyncio.sleep(1)  # Simulate processing time

            ai_response = {
                "type": "ai_response",
                "message": f"I understand you're asking about: {user_message}. As the AI procurement assistant, I can help you analyze requests, find savings opportunities, and optimize your purchasing decisions. This is a test response.",
                "timestamp": datetime.now().isoformat(),
                "suggestions": [
                    "Consider bulk ordering for better discounts",
                    "Review vendor performance metrics",
                    "Check approval workflow status"
                ]
            }

            await manager.send_personal_message(json.dumps(ai_response), websocket)

    except WebSocketDisconnect:
        manager.disconnect(websocket)

# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.get("/")
async def root():
    return {"message": "SupplyGraph Test API is running", "docs": "/docs"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)