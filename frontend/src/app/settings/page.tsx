"use client";

import React, { useState } from "react";
import {
  Settings,
  Eye,
  Type,
  Gauge,
  Volume2,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  Check,
  Sliders,
} from "lucide-react";
import { useAccessibilityStore } from "@/store/useAccessibilityStore";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [savedNotice, setSavedNotice] = useState(false);
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
    speakText,
    resetDefaults,
  } = useAccessibilityStore();

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <AppShell
      breadcrumbs={[{ label: "Accessibility Settings", active: true }]}
      title="Accessibility & System Preferences"
      description="Customize your visual contrast, text scaling, sign playback speeds, color vision presets, and assistive audio feedback."
      actions={
        <div className="flex items-center gap-2">
          <Badge variant="accent" className="gap-1 py-1 px-2.5">
            <ShieldCheck className="h-3 w-3 text-brand-600" />
            WCAG 2.2 AAA Compliant
          </Badge>
          <Button size="sm" variant="outline" onClick={resetDefaults} className="gap-1.5 text-xs">
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Defaults
          </Button>
        </div>
      }
    >
      {savedNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2 shadow-sm animate-in fade-in">
          <Check className="h-4 w-4" /> Preferences saved and applied to your platform experience!
        </div>
      )}

      {/* Preferences Form Container */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardContent className="p-6 sm:p-8 space-y-8">
          {/* 1. High Contrast */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Eye className="h-4 w-4 text-brand-600" /> High Contrast Interface
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Enforces maximum distinction between text, backgrounds, and interactive elements.
              </p>
            </div>
            <input
              type="checkbox"
              checked={highContrast}
              onChange={(e) => setHighContrast(e.target.checked)}
              className="h-5 w-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
            />
          </div>

          {/* 2. Font Scaling Slider */}
          <div className="space-y-3 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Type className="h-4 w-4 text-brand-600" /> Dynamic Font Scaling: {fontScale.toFixed(2)}x
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Scales all UI typography proportionally for comfortable reading.
                </p>
              </div>
              <button
                onClick={() => setFontScale(1.0)}
                className="text-xs font-bold text-brand-600 hover:text-brand-700"
              >
                Reset 1.0x
              </button>
            </div>
            <input
              type="range"
              min="0.8"
              max="1.6"
              step="0.05"
              value={fontScale}
              onChange={(e) => setFontScale(parseFloat(e.target.value))}
              className="w-full accent-brand-600 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-400">
              <span>Small (80%)</span>
              <span>Standard (100%)</span>
              <span>Large (160%)</span>
            </div>
          </div>

          {/* 3. ISL Sign Playback Speed Slider */}
          <div className="space-y-3 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-brand-600" /> Sign Playback Speed: {signPlaybackSpeed.toFixed(2)}x
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Regulates the pace of visual 3D sign demonstrations in the studio and translator.
                </p>
              </div>
              <button
                onClick={() => setSignPlaybackSpeed(1.0)}
                className="text-xs font-bold text-brand-600 hover:text-brand-700"
              >
                Reset 1.0x
              </button>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.1"
              value={signPlaybackSpeed}
              onChange={(e) => setSignPlaybackSpeed(parseFloat(e.target.value))}
              className="w-full accent-brand-600 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-400">
              <span>0.5x (Slow - Good for learners)</span>
              <span>1.0x (Standard)</span>
              <span>1.5x (Fluent speed)</span>
            </div>
          </div>

          {/* 4. Speech Synthesis TTS */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-brand-600" /> Text-to-Speech Audio Feedback
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Audibly reads recognized signs and sentences via browser speech synthesis.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => speakText("SignConnect AI audio feedback is working properly.")}
                className="text-xs"
              >
                Test Voice
              </Button>
              <input
                type="checkbox"
                checked={ttsVoiceEnabled}
                onChange={(e) => setTtsVoiceEnabled(e.target.checked)}
                className="h-5 w-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
              />
            </div>
          </div>

          {/* 5. Reduced Motion */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-brand-600" /> Reduce Motion & Flashes
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Disables non-essential transition animations for vestibular safety.
              </p>
            </div>
            <input
              type="checkbox"
              checked={reduceMotion}
              onChange={(e) => setReduceMotion(e.target.checked)}
              className="h-5 w-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
            />
          </div>

          {/* 6. Color Vision Presets */}
          <div className="space-y-3 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Color Vision Accommodation Presets
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Select tailored palette contrast for color vision deficiencies.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { key: "none", label: "Standard" },
                { key: "protanopia", label: "Protanopia" },
                { key: "deuteranopia", label: "Deuteranopia" },
                { key: "tritanopia", label: "Tritanopia" },
              ].map((preset) => (
                <button
                  key={preset.key}
                  onClick={() => setColorBlindMode(preset.key as any)}
                  className={cn(
                    "p-3 rounded-xl border text-xs font-bold transition-all text-center",
                    colorBlindMode === preset.key
                      ? "border-brand-600 bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 shadow-sm"
                      : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300"
                  )}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Save Action */}
          <div className="pt-2 flex justify-end">
            <Button onClick={handleSave} className="font-bold px-8">
              Save Preferences
            </Button>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
