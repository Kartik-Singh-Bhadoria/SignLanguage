"use client";

import React, { useEffect, useState } from "react";
import {
  GraduationCap,
  Award,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Camera,
  Activity,
  Layers,
} from "lucide-react";
import { api, ISLSignItem, PracticeEvaluationResult } from "@/lib/api";
import { WebCamStudio } from "@/components/camera/WebCamStudio";
import { SignVisualizer } from "@/components/sign-player/SignVisualizer";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { key: "alphabet", label: "Alphabets (A-Z)" },
  { key: "number", label: "Numbers (0-9)" },
  { key: "greeting", label: "Greetings" },
  { key: "daily", label: "Daily Life" },
  { key: "emergency", label: "Emergency & Health" },
];

export default function LearnPage() {
  const [selectedCategory, setSelectedCategory] = useState("alphabet");
  const [signs, setSigns] = useState<ISLSignItem[]>([]);
  const [selectedSign, setSelectedSign] = useState<ISLSignItem | null>(null);
  const [evaluation, setEvaluation] = useState<PracticeEvaluationResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [streak, setStreak] = useState(3);

  // Load signs when category changes
  useEffect(() => {
    async function loadCategorySigns() {
      try {
        const res = await api.getSigns(selectedCategory, undefined, 0, 30);
        setSigns(res.items);
        if (res.items.length > 0) {
          setSelectedSign(res.items[0]);
          setEvaluation(null);
        }
      } catch (err) {
        console.error("Failed to load category signs:", err);
      }
    }
    loadCategorySigns();
  }, [selectedCategory]);

  // Handle Practice attempt submission
  const handlePracticeAttempt = async () => {
    if (!selectedSign) return;
    setIsEvaluating(true);

    try {
      // Use reference template or captured hands
      const hands = selectedSign.landmark_template?.hands || [];
      const result = await api.evaluatePractice(selectedSign.id, hands);
      setEvaluation(result);

      if (result.is_passed) {
        setStreak((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Practice evaluation error:", err);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600">
              <GraduationCap className="h-6 w-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              ISL Interactive Practice Arena
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Learn Indian Sign Language step-by-step with real-time camera posture grading and AI feedback.
          </p>
        </div>

        {/* Practice Streak Badge */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200">
          <Award className="h-5 w-5 text-amber-500" />
          <div>
            <div className="text-xs font-bold uppercase tracking-wider">Practice Streak</div>
            <div className="text-sm font-black">{streak} Perfect Signs</div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors",
              selectedCategory === cat.key
                ? "bg-emerald-600 text-white shadow-md"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Practice Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Signs Selector Carousel / Grid */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Select Sign to Practice ({signs.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2 max-h-[500px] overflow-y-auto pr-1">
            {signs.map((sign) => (
              <button
                key={sign.id}
                onClick={() => {
                  setSelectedSign(sign);
                  setEvaluation(null);
                }}
                className={cn(
                  "p-3 rounded-xl border text-left transition-all",
                  selectedSign?.id === sign.id
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 shadow-sm"
                    : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                )}
              >
                <div className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {sign.english_label}
                </div>
                <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {sign.hindi_label}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 capitalize">{sign.difficulty_level}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Target Sign Lesson & Posture Evaluation */}
        <div className="lg:col-span-2 space-y-6">
          {selectedSign ? (
            <div className="space-y-6">
              {/* Target Sign Banner */}
              <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full">
                      Target Sign
                    </span>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                      {selectedSign.english_label}
                    </h2>
                    <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                      {selectedSign.hindi_label}
                    </p>
                  </div>

                  <button
                    onClick={handlePracticeAttempt}
                    disabled={isEvaluating}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-transform active:scale-95 flex items-center gap-2"
                  >
                    <Camera className="h-4 w-4" /> Check My Sign Posture
                  </button>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                  <span className="font-bold text-slate-800 dark:text-slate-200">How to perform: </span>
                  {selectedSign.description}
                </p>

                {/* 3D Anatomical Template Preview */}
                {selectedSign.landmark_template && (
                  <div className="pt-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Reference ISL 3D Hand Skeleton:
                    </span>
                    <SignVisualizer
                      sequence={[]}
                      landmarksTemplate={selectedSign.landmark_template}
                    />
                  </div>
                )}
              </div>

              {/* Evaluation Result Feedback Panel */}
              {evaluation && (
                <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "h-10 w-10 rounded-xl flex items-center justify-center font-bold text-lg",
                          evaluation.is_passed
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                        )}
                      >
                        {evaluation.is_passed ? <CheckCircle2 className="h-6 w-6" /> : <AlertCircle className="h-6 w-6" />}
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-slate-900 dark:text-white">
                          Status: {evaluation.status}
                        </h4>
                        <p className="text-xs text-slate-400">Real-time posture angle & finger curl analysis</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                        {evaluation.accuracy_score}%
                      </div>
                      <div className="text-[10px] text-slate-400">Accuracy Score</div>
                    </div>
                  </div>

                  {/* Finger Evaluation Checklist */}
                  <div>
                    <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                      Finger Alignment Diagnostics:
                    </h5>
                    <div className="grid grid-cols-5 gap-2">
                      {Object.entries(evaluation.finger_evaluation).map(([finger, status]) => (
                        <div
                          key={finger}
                          className={cn(
                            "p-2 rounded-xl border text-center text-xs",
                            status === "Correct"
                              ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
                              : "bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300"
                          )}
                        >
                          <div className="font-bold">{finger}</div>
                          <div className="text-[10px] mt-0.5">{status}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Coaching Tips */}
                  {evaluation.posture_tips.length > 0 && (
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                      <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Sparkles className="h-4 w-4 text-emerald-600" /> Coaching Guidance:
                      </div>
                      <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-300 space-y-1">
                        {evaluation.posture_tips.map((tip, idx) => (
                          <li key={idx}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400">Select a sign from the list to begin practice.</div>
          )}
        </div>
      </div>
    </div>
  );
}
