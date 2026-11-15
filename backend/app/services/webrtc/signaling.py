"""WebRTC Room Signaling and Real-Time ISL Subtitle Broadcaster."""

import json
from typing import Any, Dict, List, Optional
from fastapi import WebSocket


class WebRTCSignalingManager:
    """Manages WebSocket signaling sessions and caption broadcasting for WebRTC rooms."""

    def __init__(self):
        # Map: room_code -> Dict[peer_id, WebSocket]
        self.rooms: Dict[str, Dict[str, Any]] = {}

    def register_peer(self, room_code: str, peer_id: str, websocket: Any) -> int:
        """Register a peer in room synchronously."""
        if room_code not in self.rooms:
            self.rooms[room_code] = {}
        self.rooms[room_code][peer_id] = websocket
        return len(self.rooms[room_code])

    def unregister_peer(self, room_code: str, peer_id: str) -> int:
        """Remove a peer from room synchronously."""
        if room_code in self.rooms and peer_id in self.rooms[room_code]:
            del self.rooms[room_code][peer_id]
            if not self.rooms[room_code]:
                del self.rooms[room_code]
                return 0
            return len(self.rooms[room_code])
        return 0

    def get_room_peers(self, room_code: str) -> List[str]:
        """List active peer IDs in a room."""
        if room_code in self.rooms:
            return list(self.rooms[room_code].keys())
        return []

    async def connect(self, room_code: str, peer_id: str, websocket: WebSocket) -> None:
        """Register a peer and broadcast join notification."""
        await websocket.accept()
        total = self.register_peer(room_code, peer_id, websocket)

        await self.broadcast(
            room_code=room_code,
            message={
                "type": "peer_joined",
                "room_code": room_code,
                "peer_id": peer_id,
                "total_peers": total
            },
            exclude_peer=peer_id
        )

    def disconnect(self, room_code: str, peer_id: str) -> None:
        """Remove peer from room when disconnected."""
        self.unregister_peer(room_code, peer_id)

    async def send_to_peer(self, room_code: str, recipient_id: str, message: Dict[str, Any]) -> bool:
        """Send direct signaling message to a target peer."""
        if room_code in self.rooms and recipient_id in self.rooms[room_code]:
            ws = self.rooms[room_code][recipient_id]
            await ws.send_text(json.dumps(message))
            return True
        return False

    async def broadcast(self, room_code: str, message: Dict[str, Any], exclude_peer: str = "") -> None:
        """Broadcast message to all peers in room."""
        if room_code not in self.rooms:
            return

        payload_str = json.dumps(message)
        dead_peers = []

        for p_id, ws in list(self.rooms[room_code].items()):
            if p_id == exclude_peer:
                continue
            try:
                await ws.send_text(payload_str)
            except Exception:
                dead_peers.append(p_id)

        for p_id in dead_peers:
            self.disconnect(room_code, p_id)


signaling_manager = WebRTCSignalingManager()
