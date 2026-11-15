"use client";

import React, { useState } from "react";
import { Camera, Volume2, Sparkles, Copy, Check, MessageSquare, Info } from "lucide-react";
import { WebCamStudio } from "@/components/camera/WebCamStudio";
import { useSignStore } from "@/store/useSignStore";
import { useAccessibilityStore } from "@/store/useAccessibilityStore";

export default function StudioPage() {
  const [copied, setCopied] = useState(false);
  const { sentenceBuffer, clearSentence } = useSignStore();
  const { speakText } = useAccessibilityStore();

  const fullSentence = sentenceBuffer.map((s) => s.label).join(" ");

  const handleCopy = () => {
    if (!fullSentence) return;
    navigator.clipboard.writeText(fullSentence);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Page Title & Instructions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-brand-100 dark:bg-brand-950 text-brand-600">
              <Camera className="h-6 w-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Sign-to-Text Studio
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Real-time Indian Sign Language (ISL) recognition using MediaPipe 21-point hand landmark tracking
            and deep learning neural classification.
          </p>
        </div>

        {fullSentence && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => speakText(fullSentence)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow"
            >
              <Volume2 className="h-4 w-4" /> Speak
            </button>
            <button
              onClick={handleCopy}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        )}
      </div>

      {/* Main Camera Studio Component */}
      <WebCamStudio />

      {/* Usage Tips & ISL Instructions */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Info className="h-4 w-4 text-brand-600" /> Tips for Best ISL Recognition Accuracy
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 dark:text-slate-400">
          <li className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-white block mb-1">1. Ample Lighting</span>
            Position yourself facing a clear light source. Avoid dark silhouettes or harsh backlighting.
          </li>
          <li className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-white block mb-1">2. Two-Hand Positioning</span>
            For two-handed signs like <span className="font-semibold text-brand-600">Namaste</span> or <span className="font-semibold text-brand-600">Help</span>, ensure both hands remain within camera boundary.
          </li>
          <li className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-white block mb-1">3. Clear Hand Separation</span>
            Hold signs distinctly for 0.5 - 1.0 seconds to allow the inference engine to classify and buffer into sentence.
          </li>
        </ul>
      </div>
    </div>
  );
}
