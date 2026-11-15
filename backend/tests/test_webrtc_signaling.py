"""Tests for WebRTC Signaling Manager."""

from backend.app.services.webrtc.signaling import WebRTCSignalingManager


class DummyWebSocket:
    def __init__(self):
        self.sent_messages = []

    def send_text(self, text: str):
        self.sent_messages.append(text)


def test_webrtc_signaling_manager_peer_lifecycle():
    manager = WebRTCSignalingManager()
    room_code = "ROOM-TEST-1"
    ws1 = DummyWebSocket()
    ws2 = DummyWebSocket()

    # Register peer 1
    count1 = manager.register_peer(room_code=room_code, peer_id="peer_1", websocket=ws1)
    assert count1 == 1
    assert manager.get_room_peers(room_code) == ["peer_1"]

    # Register peer 2
    count2 = manager.register_peer(room_code=room_code, peer_id="peer_2", websocket=ws2)
    assert count2 == 2
    peers = manager.get_room_peers(room_code)
    assert "peer_1" in peers
    assert "peer_2" in peers

    # Disconnect peer 1
    remaining = manager.unregister_peer(room_code, "peer_1")
    assert remaining == 1
    assert manager.get_room_peers(room_code) == ["peer_2"]

    # Disconnect peer 2
    remaining2 = manager.unregister_peer(room_code, "peer_2")
    assert remaining2 == 0
    assert manager.get_room_peers(room_code) == []
