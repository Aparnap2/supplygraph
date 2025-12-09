"""
WebSocket manager for real-time communication with frontend
"""
from typing import Dict, List, Any
import json
import asyncio
from fastapi import WebSocket


class WebSocketManager:
    """Manages WebSocket connections for real-time workflow updates"""

    def __init__(self):
        # Map thread_id to list of WebSocket connections
        self.thread_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, thread_id: str):
        """Accept and store WebSocket connection"""
        await websocket.accept()

        if thread_id not in self.thread_connections:
            self.thread_connections[thread_id] = []

        self.thread_connections[thread_id].append(websocket)
        print(f" WebSocket connected for thread {thread_id}")

        # Send connection confirmation
        await self._send_to_websocket(websocket, {
            "type": "connection_established",
            "thread_id": thread_id
        })

    def disconnect(self, websocket: WebSocket, thread_id: str):
        """Remove WebSocket connection"""
        if thread_id in self.thread_connections:
            try:
                self.thread_connections[thread_id].remove(websocket)
                print(f"= WebSocket disconnected for thread {thread_id}")

                # Clean up empty thread connections
                if not self.thread_connections[thread_id]:
                    del self.thread_connections[thread_id]
            except ValueError:
                pass  # Connection already removed

    async def broadcast_to_thread(self, thread_id: str, data: Dict[str, Any]):
        """Broadcast message to all connections in a thread"""
        if thread_id not in self.thread_connections:
            return

        message = {
            **data,
            "timestamp": asyncio.get_event_loop().time()
        }

        # Send to all connected clients in this thread
        disconnected_clients = []
        for websocket in self.thread_connections[thread_id]:
            try:
                await self._send_to_websocket(websocket, message)
            except Exception as e:
                print(f"L Failed to send to WebSocket: {e}")
                disconnected_clients.append(websocket)

        # Clean up disconnected clients
        for websocket in disconnected_clients:
            self.disconnect(websocket, thread_id)

    async def _send_to_websocket(self, websocket: WebSocket, data: Dict[str, Any]):
        """Send data to specific WebSocket"""
        try:
            await websocket.send_text(json.dumps(data))
        except Exception as e:
            print(f"L WebSocket send error: {e}")
            raise

    def get_connection_count(self, thread_id: str) -> int:
        """Get number of active connections for a thread"""
        return len(self.thread_connections.get(thread_id, []))

    def get_all_threads(self) -> List[str]:
        """Get list of all active thread IDs"""
        return list(self.thread_connections.keys())