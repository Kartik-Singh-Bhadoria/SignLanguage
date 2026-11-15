"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Camera,
  CameraOff,
  Sparkles,
  Volume2,
  Trash2,
  Undo2,
  Layers,
  Activity,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Play,
} from "lucide-react";
import { api, HandData, LandmarkPoint, RecognitionResult } from "@/lib/api";
import { useSignStore } from "@/store/useSignStore";
import { useAccessibilityStore } from "@/store/useAccessibilityStore";
import { cn, formatTime } from "@/lib/utils";

// 21 MediaPipe hand connections for visual canvas overlay
const HAND_CONNECTIONS = [
  // Thumb
  [0, 1], [1, 2], [2, 3], [3, 4],
  // Index
  [0, 5], [5, 6], [6, 7], [7, 8],
  // Middle
  [0, 9], [9, 10], [10, 11], [11, 12],
  // Ring
  [0, 13], [13, 14], [14, 15], [15, 16],
  // Pinky
  [0, 17], [17, 18], [18, 19], [19, 20],
  // Palm Base
  [5, 9], [9, 13], [13, 17]
];

interface WebCamStudioProps {
  onSignRecognized?: (signKey: string, result: RecognitionResult) => void;
  targetSignKey?: string; // If in practice mode
}

export function WebCamStudio({ onSignRecognized, targetSignKey }: WebCamStudioProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [activeHands, setActiveHands] = useState<HandData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [autoStream, setAutoStream] = useState(true);

  const {
    currentSign,
    currentConfidence,
    englishLabel,
    hindiLabel,
    topPredictions,
    postureFeedback,
    sentenceBuffer,
    setRecognitionResult,
    addSignToSentence,
    removeLastSign,
    clearSentence,
    inferenceMs,
  } = useSignStore();

  const { speakText, ttsVoiceEnabled } = useAccessibilityStore();

  // Draw hand bones and joints on HTML5 canvas
  const drawLandmarks = useCallback((hands: HandData[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    hands.forEach((hand) => {
      const pts = hand.landmarks;
      const isRight = hand.handedness === "Right";
      const boneColor = isRight ? "#6366f1" : "#0d9488"; // Indigo for dominant, Teal for secondary

      // Draw bones
      ctx.lineWidth = 3;
      ctx.strokeStyle = boneColor;

      HAND_CONNECTIONS.forEach(([startIdx, endIdx]) => {
        const p1 = pts[startIdx];
        const p2 = pts[endIdx];
        if (p1 && p2) {
          ctx.beginPath();
          ctx.moveTo(p1.x * canvas.width, p1.y * canvas.height);
          ctx.lineTo(p2.x * canvas.width, p2.y * canvas.height);
          ctx.stroke();
        }
      });

      // Draw landmark joints
      pts.forEach((pt, idx) => {
        const cx = pt.x * canvas.width;
        const cy = pt.y * canvas.height;

        ctx.beginPath();
        ctx.arc(cx, cy, idx % 4 === 0 ? 5 : 3.5, 0, 2 * Math.PI);

        if ([4, 8, 12, 16, 20].includes(idx)) {
          ctx.fillStyle = "#10b981"; // Emerald tips
        } else if (idx === 0) {
          ctx.fillStyle = "#f59e0b"; // Amber wrist
        } else {
          ctx.fillStyle = "#ffffff";
        }
        ctx.fill();
        ctx.strokeStyle = "#1e1b4b";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
    });
  }, []);

  // Send landmarks to backend for AI inference
  const sendInference = useCallback(async (hands: HandData[]) => {
    if (isProcessing || hands.length === 0) return;
    setIsProcessing(true);

    try {
      const result = await api.predictLandmarks(hands);
      setRecognitionResult(result);

      if (result.is_detected && result.predicted_sign && result.confidence > 0.6) {
        if (onSignRecognized) {
          onSignRecognized(result.predicted_sign, result);
        }
        if (ttsVoiceEnabled && result.english_label) {
          // Announce sign when confidence is high
          // Speak throttled
        }
      }
    } catch (err) {
      console.error("Inference request error:", err);
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, onSignRecognized, setRecognitionResult, ttsVoiceEnabled]);

  // Start Camera
  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err: any) {
      console.warn("Camera access failed or unavailable:", err);
      setCameraError("Camera unavailable or permission denied. You can use the Quick Sign Simulator below.");
      setCameraActive(false);
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  // Quick Sign Simulator: Allows instant testing of realistic signs
  const simulateSignPose = async (signKey: string) => {
    try {
      const signDetail = await api.getSignDetail(signKey);
      if (signDetail.landmark_template?.hands) {
        const hands: HandData[] = signDetail.landmark_template.hands;
        setActiveHands(hands);
        drawLandmarks(hands);
        await sendInference(hands);
      }
    } catch (err) {
      console.error("Sign simulation error:", err);
    }
  };

  // Auto clean-up on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Video & Landmark Canvas Column */}
      <div className="lg:col-span-2 space-y-4">
        <div className="relative rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl aspect-[4/3] flex items-center justify-center">
          {/* Live Video Element */}
          <video
            ref={videoRef}
            playsInline
            muted
            className={cn(
              "absolute inset-0 w-full h-full object-cover transform -scale-x-100",
              !cameraActive && "hidden"
            )}
          />

          {/* Landmark Drawing Canvas */}
          <canvas
            ref={canvasRef}
            width={640}
            height={480}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10"
          />

          {/* Placeholder / Camera Off State */}
          {!cameraActive && (
            <div className="text-center p-6 space-y-4 z-20 max-w-md">
              <div className="h-16 w-16 mx-auto rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400">
                <Camera className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Camera Standby</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Activate your webcam for real-time ISL recognition or use the quick simulation triggers below.
                </p>
              </div>
              <button
                onClick={startCamera}
                className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-lg transition-transform active:scale-95"
              >
                Enable Camera
              </button>
            </div>
          )}

          {/* Camera Error Banner */}
          {cameraError && (
            <div className="absolute top-4 left-4 right-4 z-30 p-3 rounded-xl bg-amber-950/80 border border-amber-800 text-amber-200 text-xs flex items-center gap-2 backdrop-blur">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-400" />
              <span>{cameraError}</span>
            </div>
          )}

          {/* Active Status Badges */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
            {cameraActive && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Live Camera
              </span>
            )}
            {inferenceMs > 0 && (
              <span className="px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-xs backdrop-blur font-mono">
                Latency: {formatTime(inferenceMs)}
              </span>
            )}
          </div>

          {/* Camera Control Overlay */}
          {cameraActive && (
            <div className="absolute bottom-4 right-4 z-20 flex gap-2">
              <button
                onClick={stopCamera}
                className="p-2.5 rounded-xl bg-rose-600/80 hover:bg-rose-700 text-white backdrop-blur shadow"
                title="Stop Camera"
              >
                <CameraOff className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Quick ISL Pose Simulator Triggers */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-brand-600" /> Quick Sign Simulator (Injects Real ISL Anatomical Pose)
            </span>
            <span className="text-[11px] text-slate-400">Click any sign to test inference</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { key: "NAMASTE", label: "Namaste" },
              { key: "WATER", label: "Water" },
              { key: "HELP", label: "Help" },
              { key: "DOCTOR", label: "Doctor" },
              { key: "THANK_YOU", label: "Thank You" },
              { key: "A", label: "Letter A" },
              { key: "B", label: "Letter B" },
              { key: "L", label: "Letter L" },
              { key: "V", label: "Letter V" },
              { key: "1", label: "Digit 1" },
            ].map((s) => (
              <button
                key={s.key}
                onClick={() => simulateSignPose(s.key)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-950/40 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recognition Feed & Sentence Builder Column */}
      <div className="space-y-6">
        {/* Live Detected Sign Banner */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Current AI Prediction</span>
            {currentConfidence > 0 && (
              <span
                className={cn(
                  "px-2.5 py-1 rounded-full text-xs font-bold font-mono",
                  currentConfidence >= 0.7
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                    : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                )}
              >
                {(currentConfidence * 100).toFixed(1)}% Match
              </span>
            )}
          </div>

          {currentSign ? (
            <div className="space-y-4">
              <div>
                <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {englishLabel || currentSign}
                </div>
                {hindiLabel && (
                  <div className="text-lg font-medium text-brand-600 dark:text-brand-400 mt-0.5">
                    {hindiLabel}
                  </div>
                )}
              </div>

              {/* Confidence Meter Bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-brand-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, currentConfidence * 100)}%` }}
                />
              </div>

              {/* Posture Coaching Feedback */}
              {postureFeedback && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs space-y-1.5">
                  <div className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Activity className="h-3.5 w-3.5 text-brand-600" /> Posture Orientation:
                  </div>
                  <div className="text-slate-600 dark:text-slate-400">
                    Palm: <span className="font-medium text-slate-900 dark:text-white">{postureFeedback.palm_orientation}</span>
                  </div>
                  {postureFeedback.guidance && (
                    <div className="text-brand-600 dark:text-brand-400 font-medium pt-1">
                      {postureFeedback.guidance}
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => addSignToSentence(currentSign, englishLabel || currentSign)}
                  className="flex-1 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow transition-colors"
                >
                  + Add to Sentence
                </button>
                <button
                  onClick={() => speakText(englishLabel || currentSign)}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                  title="Speak Sign"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 text-sm">
              <p>No hand detected in camera frame.</p>
              <p className="text-xs text-slate-500 mt-1">Sign clearly in front of the lens.</p>
            </div>
          )}
        </div>

        {/* Real-time Sentence Builder */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-brand-600" /> Assembled Sentence
            </h4>
            <div className="flex items-center gap-1">
              <button
                onClick={removeLastSign}
                disabled={sentenceBuffer.length === 0}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 disabled:opacity-30"
                title="Undo last sign"
              >
                <Undo2 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={clearSentence}
                disabled={sentenceBuffer.length === 0}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-rose-500 hover:bg-rose-50 disabled:opacity-30"
                title="Clear sentence"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="min-h-[70px] p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 flex flex-wrap gap-2 items-center">
            {sentenceBuffer.length > 0 ? (
              sentenceBuffer.map((item, idx) => (
                <span
                  key={`${item.sign_key}-${idx}`}
                  className="px-2.5 py-1 rounded-lg bg-brand-100 dark:bg-brand-950 text-brand-800 dark:text-brand-300 text-xs font-bold border border-brand-200 dark:border-brand-800"
                >
                  {item.label}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">Signs added will appear here to form sentences...</span>
            )}
          </div>

          {sentenceBuffer.length > 0 && (
            <button
              onClick={() => {
                const fullSentence = sentenceBuffer.map((s) => s.label).join(" ");
                speakText(fullSentence);
              }}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow"
            >
              <Volume2 className="h-4 w-4" /> Speak Full Sentence
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
