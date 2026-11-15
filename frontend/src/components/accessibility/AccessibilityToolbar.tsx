"use client";

import React, { useState } from "react";
import {
  Eye,
  Type,
  Volume2,
  VolumeX,
  Gauge,
  Sparkles,
  RotateCcw,
  Sliders,
  Check,
} from "lucide-react";
import { useAccessibilityStore } from "@/store/useAccessibilityStore";

export function AccessibilityToolbar() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    highContrast,
    setHighContrast,
    fontScale,
    setFontScale,
    signPlaybackSpeed,
    setSignPlaybackSpeed,
    captionSize,
    setCaptionSize,
    reduceMotion,
    setReduceMotion,
    colorBlindMode,
    setColorBlindMode,
    ttsVoiceEnabled,
    setTtsVoiceEnabled,
    resetDefaults,
  } = useAccessibilityStore();

  return (
    <>
      {/* Floating Accessibility Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Accessibility Toolbar"
        aria-expanded={isOpen}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-brand-600 px-4 py-3 text-white shadow-xl hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-accessibility-focus"
      >
        <Sliders className="h-5 w-5" />
        <span className="font-semibold text-sm hidden sm:inline">Accessibility</span>
      </button>

      {/* Accessibility Drawer / Modal */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="accessibility-title"
          className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto"
        >
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Sliders className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                <h2 id="accessibility-title" className="text-lg font-bold text-slate-900 dark:text-white">
                  Accessibility Controls
                </h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close accessibility controls"
                className="text-slate-500 hover:text-slate-800 dark:hover:text-white text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* High Contrast Mode */}
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="toggle-contrast" className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Eye className="h-4 w-4 text-brand-600" /> High Contrast
                  </label>
                  <p className="text-xs text-slate-500">Maximum readability borders and colors</p>
                </div>
                <input
                  id="toggle-contrast"
                  type="checkbox"
                  checked={highContrast}
                  onChange={(e) => setHighContrast(e.target.checked)}
                  className="h-5 w-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
              </div>

              {/* Font Scaling */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="font-scale-range" className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Type className="h-4 w-4 text-brand-600" /> Font Scale: {fontScale.toFixed(2)}x
                  </label>
                </div>
                <input
                  id="font-scale-range"
                  type="range"
                  min="0.8"
                  max="1.6"
                  step="0.05"
                  value={fontScale}
                  onChange={(e) => setFontScale(parseFloat(e.target.value))}
                  className="w-full accent-brand-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>80%</span>
                  <span>100% (Default)</span>
                  <span>160%</span>
                </div>
              </div>

              {/* Sign Playback Speed */}
              <div>
                <label htmlFor="sign-speed-range" className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-1">
                  <Gauge className="h-4 w-4 text-brand-600" /> Sign Speed: {signPlaybackSpeed.toFixed(2)}x
                </label>
                <input
                  id="sign-speed-range"
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.1"
                  value={signPlaybackSpeed}
                  onChange={(e) => setSignPlaybackSpeed(parseFloat(e.target.value))}
                  className="w-full accent-brand-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>0.5x (Slow)</span>
                  <span>1.0x (Normal)</span>
                  <span>1.5x (Fast)</span>
                </div>
              </div>

              {/* Speech Synthesis Voice */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    {ttsVoiceEnabled ? <Volume2 className="h-4 w-4 text-brand-600" /> : <VolumeX className="h-4 w-4 text-slate-400" />}
                    Spoken Feedback (TTS)
                  </span>
                  <p className="text-xs text-slate-500">Audio narration of recognized signs</p>
                </div>
                <input
                  type="checkbox"
                  checked={ttsVoiceEnabled}
                  onChange={(e) => setTtsVoiceEnabled(e.target.checked)}
                  className="h-5 w-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
              </div>

              {/* Reduced Motion */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-brand-600" /> Reduce Motion
                  </span>
                  <p className="text-xs text-slate-500">Diminish animations and transitions</p>
                </div>
                <input
                  type="checkbox"
                  checked={reduceMotion}
                  onChange={(e) => setReduceMotion(e.target.checked)}
                  className="h-5 w-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
              </div>

              {/* Color Blind Safe Mode */}
              <div>
                <label htmlFor="colorblind-mode" className="font-medium text-slate-800 dark:text-slate-200 block mb-1">
                  Color Vision Accommodation
                </label>
                <select
                  id="colorblind-mode"
                  value={colorBlindMode}
                  onChange={(e) => setColorBlindMode(e.target.value as any)}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-sm"
                >
                  <option value="none">Standard Vision</option>
                  <option value="protanopia">Protanopia (Red-Blind)</option>
                  <option value="deuteranopia">Deuteranopia (Green-Blind)</option>
                  <option value="tritanopia">Tritanopia (Blue-Blind)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex gap-2">
            <button
              onClick={resetDefaults}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              <RotateCcw className="h-4 w-4" /> Reset Defaults
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="w-full py-2 px-4 rounded-lg bg-brand-600 hover:bg-brand-700 text-sm font-medium text-white"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}
