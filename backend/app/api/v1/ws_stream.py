"""Real-Time WebSocket Streaming for ISL Recognition and WebRTC Signaling."""

import json
import time
from typing import Any, Dict
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from backend.app.schemas.recognition import LandmarkFrame
from backend.app.services.ai.isl_dataset import get_isl_class_metadata
from backend.app.services.ai.isl_model import get_isl_classifier
from backend.app.services.ai.landmark_normalizer import HandLandmarkNormalizer
from backend.app.services.webrtc.signaling import signaling_manager

router = APIRouter(tags=["WebSockets"])


@router.websocket("/ws/live-sign-stream")
async def live_sign_stream(websocket: WebSocket):
    """
    Ultra-low latency WebSocket stream for live video/camera landmark prediction.
    Clients send continuous landmark frames; server streams real-time predictions.
    """
    await websocket.accept()
    classifier = get_isl_classifier()

    try:
        while True:
            data = await websocket.receive_text()
            start_time = time.perf_counter()

            try:
                frame_dict = json.loads(data)
                hands = frame_dict.get("hands", [])

                if not hands:
                    await websocket.send_text(json.dumps({
                        "is_detected": False,
                        "predicted_sign": None,
                        "confidence": 0.0,
                        "english_label": None,
                        "hindi_label": None,
                        "posture_feedback": None,
                        "inference_time_ms": 0.0
                    }))
                    continue

                # Extract features and predict
                features = HandLandmarkNormalizer.extract_features(hands)
                predictions = classifier.predict(features, top_k=3)

                top_sign, top_conf = predictions[0]
                meta = get_isl_class_metadata(top_sign)

                elapsed_ms = round((time.perf_counter() - start_time) * 1000, 2)

                await websocket.send_text(json.dumps({
                    "is_detected": True,
                    "predicted_sign": top_sign,
                    "confidence": round(top_conf, 4),
                    "english_label": meta["en"],
                    "hindi_label": meta["hi"],
                    "category": meta.get("category", "alphabet"),
                    "top_3": [{"sign": s, "conf": round(c, 4)} for s, c in predictions],
                    "inference_time_ms": elapsed_ms
                }))
            except Exception as parse_err:
                await websocket.send_text(json.dumps({"error": str(parse_err)}))

    except WebSocketDisconnect:
        pass


@router.websocket("/ws/video/rooms/{room_code}/signal")
async def room_webrtc_signaling(websocket: WebSocket, room_code: str):
    """
    WebSocket endpoint handling WebRTC peer-to-peer signaling and live ISL captions.
    """
    peer_id = f"peer_{int(time.time() * 1000) % 100000}"
    await signaling_manager.connect(room_code=room_code, peer_id=peer_id, websocket=websocket)

    try:
        # Send initial registration confirmation to the joining peer
        await websocket.send_text(json.dumps({
            "type": "registered",
            "room_code": room_code,
            "peer_id": peer_id,
            "peers": signaling_manager.get_room_peers(room_code)
        }))

        while True:
            text_data = await websocket.receive_text()
            msg = json.loads(text_data)
            msg_type = msg.get("type")
            recipient_id = msg.get("recipient_id")

            # Stamp sender id
            msg["sender_id"] = peer_id
            msg["room_code"] = room_code

            if msg_type in ["offer", "answer", "ice_candidate"] and recipient_id:
                # Direct relay to specific peer
                await signaling_manager.send_to_peer(room_code, recipient_id, msg)
            elif msg_type == "caption":
                # Broadcast live ISL recognition subtitle to all room participants
                await signaling_manager.broadcast(room_code, msg)
            else:
                # General room broadcast
                await signaling_manager.broadcast(room_code, msg, exclude_peer=peer_id)

    except WebSocketDisconnect:
        signaling_manager.disconnect(room_code, peer_id)
        await signaling_manager.broadcast(
            room_code,
            {"type": "peer_left", "room_code": room_code, "peer_id": peer_id}
        )

