"""
Basic FastAPI test server for SupplyGraph
"""
from fastapi import FastAPI, HTTPException, File, UploadFile, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import json
import uuid
import io
import csv
from datetime import datetime

app = FastAPI(title="SupplyGraph Basic API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
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
        "description": "Ergonomic office chairs"
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
        "description": "Dell Latitude laptops"
    }
]

@app.get("/health")
async def health():
    return {"status": "healthy", "time": datetime.now().isoformat()}

@app.get("/api/stats")
async def get_stats():
    return {
        "total_requests": len(sample_requests),
        "savings_amount": 12500.00,
        "in_progress": 1,
        "active_vendors": 2
    }

@app.get("/api/ai-insights")
async def get_insights():
    return {
        "insights": [
            {
                "type": "cost_savings",
                "title": "Bulk Discount Available",
                "description": "Order 10+ chairs for 15% discount",
                "potential_savings": 225.00
            }
        ]
    }

@app.get("/api/requests")
async def get_requests():
    return {"requests": sample_requests, "total": len(sample_requests)}

@app.post("/api/email")
async def send_email(data: dict):
    return {"success": True, "message": "Email sent"}

@app.post("/api/upload-csv")
async def upload_csv(file: UploadFile = File(...)):
    """Upload and parse CSV file"""
    if not file.filename.endswith(('.csv', '.xlsx', '.xls')):
        raise HTTPException(status_code=400, detail="Invalid file format")

    try:
        contents = await file.read()

        # Simple CSV parsing
        if file.filename.endswith('.csv'):
            csv_reader = csv.DictReader(io.StringIO(contents.decode('utf-8')))
            rows = list(csv_reader)
        else:
            # For Excel files, just parse as CSV for simplicity
            csv_reader = csv.DictReader(io.StringIO(contents.decode('utf-8')))
            rows = list(csv_reader)

        # Validate required columns
        required_columns = ['item_name', 'category', 'quantity', 'unit_price', 'priority']
        if rows:
            missing_columns = [col for col in required_columns if col not in rows[0]]
            if missing_columns:
                raise HTTPException(
                    status_code=400,
                    detail=f"Missing required columns: {', '.join(missing_columns)}"
                )

        # Convert to list of requests
        new_requests = []
        for i, row in enumerate(rows):
            new_requests.append({
                "id": f"REQ-{datetime.now().strftime('%Y%m%d')}-{i+1:03d}",
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

        # Add to sample requests
        sample_requests.extend(new_requests)

        return {
            "success": True,
            "message": f"Successfully processed {len(new_requests)} requests",
            "requests": new_requests
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@app.get("/api/requests/{request_id}")
async def get_request(request_id: str):
    """Get specific request details"""
    request = next((r for r in sample_requests if r["id"] == request_id), None)
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    return request

# WebSocket endpoint for chat
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    try:
        while True:
            # Receive message
            data = await websocket.receive_text()

            # Parse message
            try:
                message_data = json.loads(data)
                user_message = message_data.get('message', '')
            except:
                user_message = data

            # Simulate AI response
            import asyncio
            await asyncio.sleep(0.5)  # Simulate processing time

            ai_response = {
                "type": "ai_response",
                "message": f"I understand you're asking about: {user_message}. As the AI procurement assistant, I can help you analyze requests, find savings opportunities, and optimize your purchasing decisions.",
                "timestamp": datetime.now().isoformat(),
                "suggestions": [
                    "Consider bulk ordering for better discounts",
                    "Review vendor performance metrics",
                    "Check approval workflow status"
                ]
            }

            await websocket.send_text(json.dumps(ai_response))

    except WebSocketDisconnect:
        pass

@app.get("/")
async def root():
    return {"message": "SupplyGraph API running", "docs": "/docs"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)