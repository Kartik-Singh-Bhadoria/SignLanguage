"use client";

import React, { useEffect, useState } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Sparkles,
  Info,
  Layers,
} from "lucide-react";
import { SignSequenceItem } from "@/lib/api";
import { useAccessibilityStore } from "@/store/useAccessibilityStore";
import { cn } from "@/lib/utils";

const BONE_CONNECTIONS = [
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
  [5, 9], [9, 13], [13, 17],
];

interface SignVisualizerProps {
  sequence: SignSequenceItem[];
  currentIndex?: number;
  onIndexChange?: (index: number) => void;
  landmarksTemplate?: any;
}

export function SignVisualizer({
  sequence,
  currentIndex = 0,
  onIndexChange,
  landmarksTemplate,
}: SignVisualizerProps) {
  const [index, setIndex] = useState(currentIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const { signPlaybackSpeed } = useAccessibilityStore();

  const currentItem = sequence[index];

  // Auto playback loop through sequence
  useEffect(() => {
    if (!isPlaying || sequence.length <= 1) return;

    const currentDuration = (currentItem?.duration_seconds || 1.2) * 1000 / signPlaybackSpeed;
    const timer = setTimeout(() => {
      setIndex((prev) => {
        const next = (prev + 1) % sequence.length;
        if (onIndexChange) onIndexChange(next);
        return next;
      });
    }, currentDuration);

    return () => clearTimeout(timer);
  }, [isPlaying, index, sequence, signPlaybackSpeed, currentItem, onIndexChange]);

  const handleStepPrev = () => {
    const prev = Math.max(0, index - 1);
    setIndex(prev);
    if (onIndexChange) onIndexChange(prev);
  };

  const handleStepNext = () => {
    const next = Math.min(sequence.length - 1, index + 1);
    setIndex(next);
    if (onIndexChange) onIndexChange(next);
  };

  if (!currentItem && !landmarksTemplate) {
    return (
      <div className="p-8 text-center text-slate-400 bg-slate-900 rounded-2xl border border-slate-800">
        <Layers className="h-10 w-10 mx-auto text-slate-600 mb-2" />
        <p className="text-sm font-semibold">No sign sequence loaded.</p>
        <p className="text-xs text-slate-500 mt-1">Translate a sentence or pick a sign from dictionary.</p>
      </div>
    );
  }

  // Get landmarks for display
  const hands = landmarksTemplate?.hands || [
    {
      handedness: "Right",
      landmarks: Array.from({ length: 21 }, (_, i) => ({
        x: 0.5 + Math.sin(i * 0.4) * 0.15,
        y: 0.7 - (i / 20) * 0.45,
      })),
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
      {/* Visual Canvas Display */}
      <div className="relative aspect-video bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-6 overflow-hidden">
        {/* SVG Hand Landmark Skeleton */}
        <svg viewBox="0 0 640 480" className="w-full h-full max-h-[340px]">
          {hands.map((hand: any, hIdx: number) => {
            const pts = hand.landmarks;
            const isRight = hand.handedness === "Right";
            const strokeColor = isRight ? "#818cf8" : "#2dd4bf"; // Indigo / Teal

            return (
              <g key={`hand-${hIdx}`}>
                {/* Bones */}
                {BONE_CONNECTIONS.map(([s, e], bIdx) => {
                  const p1 = pts[s];
                  const p2 = pts[e];
                  if (!p1 || !p2) return null;
                  return (
                    <line
                      key={`bone-${bIdx}`}
                      x1={p1.x * 640}
                      y1={p1.y * 480}
                      x2={p2.x * 640}
                      y2={p2.y * 480}
                      stroke={strokeColor}
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                  );
                })}

                {/* Joint Points */}
                {pts.map((pt: any, pIdx: number) => {
                  const isTip = [4, 8, 12, 16, 20].includes(pIdx);
                  const isWrist = pIdx === 0;
                  return (
                    <circle
                      key={`pt-${pIdx}`}
                      cx={pt.x * 640}
                      cy={pt.y * 480}
                      r={isTip ? 7 : isWrist ? 8 : 4.5}
                      fill={isTip ? "#10b981" : isWrist ? "#f59e0b" : "#ffffff"}
                      stroke="#0f172a"
                      strokeWidth="2"
                    />
                  );
                })}
              </g>
            );
          })}
        </svg>

        {/* Floating Sign Name Card */}
        {currentItem && (
          <div className="absolute top-4 left-4 p-3 rounded-xl bg-slate-900/80 backdrop-blur border border-slate-700/60 shadow-lg text-left">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-white">{currentItem.english_label}</span>
              {currentItem.is_fingerspelled && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Fingerspelled
                </span>
              )}
            </div>
            <div className="text-xs font-semibold text-brand-400 mt-0.5">{currentItem.hindi_label}</div>
          </div>
        )}

        {/* Hand Type Indicator */}
        <div className="absolute bottom-4 left-4 flex gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur border border-slate-700/60 text-xs font-semibold text-slate-300">
            {currentItem?.hand_type === "two_hands" ? "Two Hands" : "Dominant Hand"}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur border border-slate-700/60 text-xs font-semibold text-slate-300">
            Speed: {signPlaybackSpeed}x
          </span>
        </div>
      </div>

      {/* Playback Controls & Scrubber */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
        {/* Sequence Timeline scrubber */}
        {sequence.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400 w-12 text-right">
              {index + 1} / {sequence.length}
            </span>
            <div className="flex-1 flex gap-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
              {sequence.map((item, idx) => (
                <div
                  key={`${item.token}-${idx}`}
                  onClick={() => {
                    setIndex(idx);
                    if (onIndexChange) onIndexChange(idx);
                  }}
                  className={cn(
                    "flex-1 h-full rounded-full cursor-pointer transition-colors",
                    idx === index
                      ? "bg-brand-600"
                      : idx < index
                      ? "bg-brand-300 dark:bg-brand-900"
                      : "bg-slate-200 dark:bg-slate-700 hover:bg-slate-300"
                  )}
                />
              ))}
            </div>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-500 max-w-sm line-clamp-1">
            {currentItem?.description || "Anatomical hand orientation view"}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleStepPrev}
              disabled={index === 0}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-30"
              title="Previous Sign"
            >
              <SkipBack className="h-4 w-4" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-2 shadow"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              <span>{isPlaying ? "Pause" : "Play Sequence"}</span>
            </button>

            <button
              onClick={handleStepNext}
              disabled={index === sequence.length - 1}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-30"
              title="Next Sign"
            >
              <SkipForward className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
