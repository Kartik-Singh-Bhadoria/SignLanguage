"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Search,
  Filter,
  GraduationCap,
  Sparkles,
  Layers,
  ArrowRight,
  HandMetal,
} from "lucide-react";
import { api, ISLSignItem } from "@/lib/api";
import { SignVisualizer } from "@/components/sign-player/SignVisualizer";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { key: "all", label: "All Categories" },
  { key: "alphabet", label: "Alphabets (A-Z)" },
  { key: "number", label: "Numbers (0-9)" },
  { key: "greeting", label: "Greetings" },
  { key: "daily", label: "Daily Life" },
  { key: "emergency", label: "Emergency & Health" },
  { key: "question", label: "Questions" },
];

export default function DictionaryPage() {
  const [signs, setSigns] = useState<ISLSignItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSign, setSelectedSign] = useState<ISLSignItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSigns() {
      setLoading(true);
      try {
        const res = await api.getSigns(selectedCategory, searchQuery, 0, 70);
        setSigns(res.items);
        if (res.items.length > 0 && !selectedSign) {
          setSelectedSign(res.items[0]);
        }
      } catch (err) {
        console.error("Failed to load dictionary signs:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSigns();
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600">
              <BookOpen className="h-6 w-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              ISL Comprehensive Sign Dictionary
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Explore 60 authentic Indian Sign Language signs with bilingual English & Hindi labels,
            anatomical hand configurations, and 3D reference landmarks.
          </p>
        </div>

        <div className="text-xs font-mono font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
          Total Signs: {signs.length}
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search signs in English or Hindi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none shadow-sm"
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors",
                selectedCategory === cat.key
                  ? "bg-amber-600 text-white shadow-sm"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Signs Grid / Cards (2 cols on large) */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="p-12 text-center text-slate-400">Loading ISL dictionary...</div>
          ) : signs.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {signs.map((sign) => {
                const isSelected = selectedSign?.id === sign.id;
                return (
                  <button
                    key={sign.id}
                    onClick={() => setSelectedSign(sign)}
                    className={cn(
                      "p-4 rounded-2xl border text-left transition-all space-y-2",
                      isSelected
                        ? "border-amber-500 bg-amber-50/60 dark:bg-amber-950/40 shadow-md ring-2 ring-amber-500/30"
                        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-amber-400 hover:shadow-sm"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {sign.category}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {sign.hand_type === "two_hands" ? "2 Hands" : "1 Hand"}
                      </span>
                    </div>

                    <div className="font-black text-base text-slate-900 dark:text-white line-clamp-1">
                      {sign.english_label}
                    </div>

                    <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 line-clamp-1">
                      {sign.hindi_label}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400">
              No signs found matching your search.
            </div>
          )}
        </div>

        {/* Selected Sign Detail & 3D Pose View (1 col on large) */}
        <div className="space-y-6">
          {selectedSign ? (
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-100 dark:bg-amber-950 px-2.5 py-0.5 rounded-full">
                  {selectedSign.category}
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {selectedSign.english_label}
                </h3>
                <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                  {selectedSign.hindi_label}
                </p>
              </div>

              {/* 3D Reference Landmarks */}
              {selectedSign.landmark_template && (
                <div className="pt-2">
                  <SignVisualizer
                    sequence={[]}
                    landmarksTemplate={selectedSign.landmark_template}
                  />
                </div>
              )}

              {/* Description & Execution */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-2 text-xs">
                <div className="font-bold text-slate-900 dark:text-white">Anatomical Execution:</div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {selectedSign.description}
                </p>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-3 grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-slate-400 block">Hand Configuration</span>
                  <span className="font-bold text-slate-900 dark:text-white capitalize">{selectedSign.hand_type.replace('_', ' ')}</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-slate-400 block">Difficulty</span>
                  <span className="font-bold text-slate-900 dark:text-white capitalize">{selectedSign.difficulty_level}</span>
                </div>
              </div>

              {/* Practice Shortcut Link */}
              <Link
                href="/learn"
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow"
              >
                <GraduationCap className="h-4 w-4" /> Practice in Learning Arena
              </Link>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400">Click a sign to view anatomical pose.</div>
          )}
        </div>
      </div>
    </div>
  );
}
