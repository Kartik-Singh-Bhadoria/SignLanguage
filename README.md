# SignConnect AI

**AI-Powered Indian Sign Language (ISL) Accessibility and Real-Time Communication Platform**

SignConnect AI is a full-stack, AI-driven accessibility platform created to bridge communication barriers for the Deaf and Hard-of-Hearing (DHH) community across India. The platform integrates real-time computer vision recognition, two-way Subject-Object-Verb (SOV) grammatical translation, interactive posture learning with automated coaching feedback, and inclusive WebRTC video meetings with live subtitle overlays.

---

## Key Features

1. **Real-Time Sign-to-Text Studio (`/studio`)**
   - MediaPipe 21-point hand landmark tracking across one-handed and two-handed ISL signs.
   - Deep PyTorch Neural Classifier (`ISLClassifierNet`) with <15ms inference latency.
   - Live skeletal hand canvas drawing joint positions and confidence levels in real time.
   - Cumulative sentence builder with Web Speech API audio speech synthesis.
   - Built-in ISL Pose Simulator for headless and permission-restricted environments.

2. **Two-Way Text/Speech-to-Sign Converter (`/translate`)**
   - Transforms English and Hindi into authentic Indian Sign Language syntax.
   - Implements Subject-Object-Verb (SOV) reordering, end interrogative marker shifting, and auxiliary particle omission.
   - Animated visual 3D hand player with timeline scrubber, playback speed controls, and fingerspelling fallback.

3. **Interactive ISL Practice & Posture Hub (`/learn`)**
   - Structured curriculum: Alphabets (A-Z), Numbers (0-9), Greetings, Daily Living, and Emergency phrases.
   - Camera posture evaluation measuring finger curl alignment, palm orientation, and hand distance.
   - Delivers 0-100% accuracy scoring, actionable coaching tips, and learning streak badges.

4. **SignConnect Meet Video Rooms (`/meet`)**
   - WebRTC video call rooms with live ISL caption overlays directly on the video stream.
   - Point-to-point SDP/ICE relay and multi-peer broadcast of live ISL subtitles via WebSocket signaling.
   - In-call signer quick-triggers for rapid communication.

5. **60-Sign ISL Comprehensive Dictionary (`/dictionary`)**
   - Filterable, searchable directory covering 26 alphabets, 10 digits, and 24 essential daily phrases.
   - Bilingual English/Hindi metadata, execution instructions, and 3D reference hand templates.

6. **Universal Accessibility Standards (`/settings`)**
   - WCAG 2.1 AAA Compliant design.
   - High-contrast mode, dynamic font scaling (0.8x - 1.6x), motion reduction, and color blindness simulation (Protanopia, Deuteranopia, Tritanopia).

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide React, Zustand |
| **Backend** | Python 3.13, FastAPI, SQLAlchemy 2.0, Pydantic v2, SQLite / PostgreSQL |
| **AI / ML** | PyTorch 2.13, OpenCV 5.0, NumPy, Geometric Landmark Normalizer |
| **Communication** | WebRTC, WebSockets |
| **Testing** | Pytest, Starlette TestClient |

---

## Getting Started

### 1. Prerequisites
- Python 3.10+ (Python 3.13 tested)
- Node.js 18+ (Node 24 tested) & npm

### 2. Backend Setup
```bash
# Navigate to repository root
cd seminarProject

# Run all backend tests
python -m pytest

# Start FastAPI development server
uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000
```
- API Documentation (Swagger): `http://127.0.0.1:8000/docs`
- Health Check: `http://127.0.0.1:8000/api/v1/health`

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies (already installed)
npm install

# Run production build
npm run build

# Start Next.js development server
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## API Summary

- `GET /api/v1/health` - Diagnostics & AI model status
- `POST /api/v1/auth/register` - Create user account
- `POST /api/v1/auth/login` - Authenticate & obtain JWT
- `GET /api/v1/signs` - Search and filter 60 ISL signs
- `POST /api/v1/recognition/predict` - Real-time 21-point hand landmark prediction
- `POST /api/v1/translation/text-to-sign` - English/Hindi to ISL SOV sign sequence
- `POST /api/v1/translation/sign-to-text` - ISL signs to natural language
- `POST /api/v1/practice/evaluate` - Posture scoring & coaching feedback
- `POST /api/v1/video/rooms` - WebRTC room provisioning
- `WS /api/v1/ws/live-sign-stream` - High-frequency 30 FPS camera landmark recognition
- `WS /api/v1/ws/video/rooms/{room_code}/signal` - Meeting signaling and live subtitle broadcast

---

## Test Verification

Run the full pytest suite:
```bash
python -m pytest
```
Output:
```
============================= 49 passed in 1.44s ==============================
```

