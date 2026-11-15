"use client";

import React, { useState } from "react";
import {
  Languages,
  Mic,
  MicOff,
  Sparkles,
  ArrowRight,
  RotateCw,
  Info,
  Layers,
  Volume2,
} from "lucide-react";
import { api, SignSequenceItem, TextToSignResult } from "@/lib/api";
import { SignVisualizer } from "@/components/sign-player/SignVisualizer";
import { useAccessibilityStore } from "@/store/useAccessibilityStore";
import { cn } from "@/lib/utils";

const PRESET_PHRASES = [
  { text: "Where is the doctor?", lang: "en" },
  { text: "I need water today", lang: "en" },
  { text: "Namaste please help me", lang: "en" },
  { text: "Where is the hospital?", lang: "en" },
  { text: "नमस्ते मुझे पानी चाहिए", lang: "hi" },
  { text: "धन्यवाद डॉक्टर", lang: "hi" },
];

export default function TranslatePage() {
  const [inputText, setInputText] = useState("Where is the hospital?");
  const [sourceLang, setSourceLang] = useState<"en" | "hi">("en");
  const [simplifyGrammar, setSimplifyGrammar] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [translationResult, setTranslationResult] = useState<TextToSignResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  const { speakText } = useAccessibilityStore();

  const handleTranslate = async (textToUse?: string) => {
    const text = textToUse || inputText;
    if (!text.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await api.textToSign(text, sourceLang, simplifyGrammar);
      setTranslationResult(result);
    } catch (err: any) {
      console.error("Translation error:", err);
      setError(err.message || "Translation failed. Check backend connection.");
    } finally {
      setIsLoading(false);
    }
  };

  // Browser Web Speech Recognition
  const toggleSpeechRecognition = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = sourceLang === "hi" ? "hi-IN" : "en-IN";
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      handleTranslate(transcript);
    };

    recognition.start();
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600">
            <Languages className="h-6 w-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Text-to-Sign Converter
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
          Converts spoken or written English & Hindi into authentic Indian Sign Language (ISL) gloss sequences
          with Subject-Object-Verb (SOV) grammatical transformation and visual animated playback.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Input & Translation Config Panel */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md space-y-4">
            {/* Language Selector & Grammar Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Source:</span>
                <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs font-semibold">
                  <button
                    onClick={() => setSourceLang("en")}
                    className={cn(
                      "px-3 py-1 rounded-md transition-colors",
                      sourceLang === "en" ? "bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white font-bold" : "text-slate-500"
                    )}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setSourceLang("hi")}
                    className={cn(
                      "px-3 py-1 rounded-md transition-colors",
                      sourceLang === "hi" ? "bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white font-bold" : "text-slate-500"
                    )}
                  >
                    हिंदी (Hindi)
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={simplifyGrammar}
                  onChange={(e) => setSimplifyGrammar(e.target.checked)}
                  className="rounded text-brand-600 border-slate-300"
                />
                <span>ISL SOV Syntax Reordering</span>
              </label>
            </div>

            {/* Input Text Area */}
            <div className="relative">
              <textarea
                rows={4}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={sourceLang === "hi" ? "यहाँ वाक्य लिखें या बोलें..." : "Type or speak your sentence here..."}
                className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none resize-none"
              />

              {/* Speech to Text Microphone Button */}
              <button
                onClick={toggleSpeechRecognition}
                aria-label="Toggle voice input"
                title="Speak to dictate text"
                className={cn(
                  "absolute bottom-3 right-3 p-2 rounded-xl transition-colors shadow",
                  isListening
                    ? "bg-rose-600 text-white animate-pulse"
                    : "bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                )}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => handleTranslate()}
                disabled={isLoading || !inputText.trim()}
                className="flex-1 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow disabled:opacity-50 transition-colors"
              >
                {isLoading ? (
                  <>
                    <RotateCw className="h-4 w-4 animate-spin" /> Translating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" /> Convert to ISL Signs
                  </>
                )}
              </button>
            </div>

            {/* Preset Phrases */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Quick Phrases
              </span>
              <div className="flex flex-wrap gap-2">
                {PRESET_PHRASES.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputText(p.text);
                      setSourceLang(p.lang as any);
                      handleTranslate(p.text);
                    }}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-950/40 text-xs text-slate-600 dark:text-slate-300"
                  >
                    {p.text}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grammar & Linguistic Notes Banner */}
          {translationResult && (
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3 text-xs">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Info className="h-4 w-4 text-teal-600" /> ISL Linguistic Syntax Analysis
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {translationResult.grammar_notes}
              </p>
              <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 font-mono text-teal-900 dark:text-teal-200">
                ISL Gloss Sequence: [ {translationResult.isl_gloss_sequence.join(" -> ")} ]
              </div>
            </div>
          )}
        </div>

        {/* Visual Sign Player & Sequence Timeline */}
        <div className="space-y-6">
          {translationResult ? (
            <div className="space-y-4">
              <SignVisualizer sequence={translationResult.sequence} />

              {/* Sequence Breakdown Card List */}
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Sign Sequence ({translationResult.sequence.length} Steps)
                  </h4>
                  <span className="text-xs font-mono text-slate-400">
                    Total: {translationResult.total_duration_seconds}s
                  </span>
                </div>

                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {translationResult.sequence.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-mono font-bold text-xs">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                            {item.english_label}
                            {item.is_fingerspelled && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                Letter
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-teal-600 dark:text-teal-400">{item.hindi_label}</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[11px] text-slate-400 font-mono">{item.duration_seconds}s</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400 space-y-3">
              <Layers className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-700" />
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">Visual Sign Player Ready</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Type an English or Hindi sentence and press "Convert to ISL Signs" to watch the animated sequence.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
