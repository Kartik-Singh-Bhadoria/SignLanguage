"use client";

import React from "react";
import Link from "next/link";
import {
  MessageSquare,
  Video,
  GraduationCap,
  FlaskConical,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Play,
  Flame,
  Sparkles,
  Zap,
  Activity,
  Layers,
  Settings,
  Shield,
  HelpCircle,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Identified temporary demo data for Phase 2 UI preview
const DEMO_RECENT_TRANSLATIONS = [
  {
    id: "tx-1",
    input: "Where is the railway station?",
    sovGloss: "[RAILWAY] [STATION] [WHERE]",
    type: "Text to ISL",
    time: "14m ago",
    confidence: "99%",
  },
  {
    id: "tx-2",
    input: "I am drinking cold water",
    sovGloss: "[I] [COLD] [WATER] [DRINK]",
    type: "Text to ISL",
    time: "1h ago",
    confidence: "97%",
  },
  {
    id: "tx-3",
    input: "Sign Gesture: 'THANK YOU'",
    sovGloss: "[THANK YOU] (Hindi: धन्यवाद)",
    type: "Sign to Text",
    time: "3h ago",
    confidence: "95%",
  },
];

const DEMO_RECENT_ACTIVITY = [
  {
    id: "act-1",
    title: "Lesson Complete: Everyday Greetings",
    description: "Achieved 96% accuracy on 'NAMASTE' and 'WELCOME' gestures.",
    time: "Today, 11:20 AM",
    badge: "Academy",
    badgeVariant: "success" as const,
  },
  {
    id: "act-2",
    title: "Live Connect Room: 'Accessibility Sync'",
    description: "3 participants joined with real-time ISL subtitles enabled.",
    time: "Yesterday, 4:15 PM",
    badge: "WebRTC",
    badgeVariant: "default" as const,
  },
  {
    id: "act-3",
    title: "Gesture Lab: Landmark Calibration",
    description: "Wrist Euclidean distance normalized for 21-point tracking.",
    time: "Yesterday, 10:30 AM",
    badge: "Lab",
    badgeVariant: "secondary" as const,
  },
];

export default function DashboardPage() {
  return (
    <AppShell
      breadcrumbs={[{ label: "Dashboard", active: true }]}
      title="Platform Dashboard"
      description="Welcome back, Rajesh. Real-time overview of your ISL activity, learning progress, and assistive communication."
      actions={
        <div className="flex items-center gap-2">
          <Badge variant="success" className="gap-1 py-1 px-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Backend API Online (Port 8000)
          </Badge>
          <Link href="/settings">
            <Button size="sm" variant="outline" className="gap-1.5">
              <Settings className="h-3.5 w-3.5" />
              Settings
            </Button>
          </Link>
        </div>
      }
    >
      {/* 1. Welcome Banner & System Status */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white border border-slate-800 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-500/20 px-3 py-0.5 text-[11px] font-semibold text-brand-300 border border-brand-500/30">
              <Sparkles className="h-3 w-3" />
              Demo Environment • Phase 2 Core UI Foundation
            </div>
            <h2 className="text-2xl font-black tracking-tight">
              Indian Sign Language Assistant Ready
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              60 trained ISL classes loaded. MediaPipe 21-point hand tracking, SOV grammar engine, and WebRTC signaling server are primed for use.
            </p>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-800">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-amber-400" />
              <div>
                <div className="text-xs text-slate-400">Practice Streak</div>
                <div className="text-lg font-black text-white">5 Days</div>
              </div>
            </div>
            <div className="text-xs text-slate-400">
              Avg. Posture Accuracy: <span className="font-bold text-emerald-400">92.4%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Quick Actions Bar */}
      <div className="space-y-2">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Quick Actions
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Link href="/communication">
            <Button size="sm" className="gap-1.5 bg-brand-600 hover:bg-brand-700">
              <MessageSquare className="h-3.5 w-3.5" />
              Start Sign-to-Text
            </Button>
          </Link>

          <Link href="/communication">
            <Button size="sm" variant="outline" className="gap-1.5">
              <Zap className="h-3.5 w-3.5 text-teal-500" />
              Translate Text to Sign (SOV)
            </Button>
          </Link>

          <Link href="/live-connect">
            <Button size="sm" variant="outline" className="gap-1.5">
              <Video className="h-3.5 w-3.5 text-brand-500" />
              Join Live Connect Room
            </Button>
          </Link>

          <Link href="/academy">
            <Button size="sm" variant="outline" className="gap-1.5">
              <GraduationCap className="h-3.5 w-3.5 text-emerald-500" />
              Practice Next Lesson
            </Button>
          </Link>

          <Link href="/lab">
            <Button size="sm" variant="outline" className="gap-1.5">
              <FlaskConical className="h-3.5 w-3.5 text-purple-500" />
              Calibrate Gesture Lab
            </Button>
          </Link>
        </div>
      </div>

      {/* 3. Five Core Module Shortcuts */}
      <div className="space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Core Module Hubs
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Module 1: Communication */}
          <Card className="hover:border-brand-300 dark:hover:border-brand-800 transition-all">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between mb-1">
                <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <Badge variant="accent">Module 1</Badge>
              </div>
              <CardTitle className="text-sm">AI Communication Center</CardTitle>
              <CardDescription className="text-xs line-clamp-2">
                Real-time camera sign recognition with audio speech playback & SOV text translator.
              </CardDescription>
            </CardHeader>
            <CardFooter className="p-4 pt-2 mt-2">
              <Link href="/communication" className="w-full">
                <Button size="sm" variant="subtle" className="w-full justify-between">
                  <span>Open Center</span>
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Module 2: Live Connect */}
          <Card className="hover:border-teal-300 dark:hover:border-teal-800 transition-all">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between mb-1">
                <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600">
                  <Video className="h-4 w-4" />
                </div>
                <Badge variant="default">Module 2</Badge>
              </div>
              <CardTitle className="text-sm">Live Connect (WebRTC)</CardTitle>
              <CardDescription className="text-xs line-clamp-2">
                Peer-to-peer inclusive video rooms with live sign captions directly overlaid on participant streams.
              </CardDescription>
            </CardHeader>
            <CardFooter className="p-4 pt-2 mt-2">
              <Link href="/live-connect" className="w-full">
                <Button size="sm" variant="subtle" className="w-full justify-between text-teal-700 dark:text-teal-300">
                  <span>Join Video Call</span>
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Module 3: Learning Academy */}
          <Card className="hover:border-emerald-300 dark:hover:border-emerald-800 transition-all">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between mb-1">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <Badge variant="success">Module 3</Badge>
              </div>
              <CardTitle className="text-sm">Learning Academy</CardTitle>
              <CardDescription className="text-xs line-clamp-2">
                Guided ISL curriculum with interactive posture scoring (0-100%) and instant coaching tips.
              </CardDescription>
            </CardHeader>
            <CardFooter className="p-4 pt-2 mt-2">
              <Link href="/academy" className="w-full">
                <Button size="sm" variant="subtle" className="w-full justify-between text-emerald-700 dark:text-emerald-300">
                  <span>Start Lessons</span>
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Module 4: Gesture Lab */}
          <Card className="hover:border-purple-300 dark:hover:border-purple-800 transition-all">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between mb-1">
                <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600">
                  <FlaskConical className="h-4 w-4" />
                </div>
                <Badge variant="secondary">Module 4</Badge>
              </div>
              <CardTitle className="text-sm">Gesture Recognition Lab</CardTitle>
              <CardDescription className="text-xs line-clamp-2">
                Real-time 21 hand landmark inspector, Euclidean normalization tester, and model calibration tool.
              </CardDescription>
            </CardHeader>
            <CardFooter className="p-4 pt-2 mt-2">
              <Link href="/lab" className="w-full">
                <Button size="sm" variant="subtle" className="w-full justify-between text-purple-700 dark:text-purple-300">
                  <span>Inspect Landmarks</span>
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Module 5: Dictionary */}
          <Card className="hover:border-amber-300 dark:hover:border-amber-800 transition-all">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between mb-1">
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600">
                  <BookOpen className="h-4 w-4" />
                </div>
                <Badge variant="warning">Module 5</Badge>
              </div>
              <CardTitle className="text-sm">ISL Dictionary & Lexicon</CardTitle>
              <CardDescription className="text-xs line-clamp-2">
                Standardized reference of 60 Indian Sign Language signs with English/Hindi translations and 3D pose templates.
              </CardDescription>
            </CardHeader>
            <CardFooter className="p-4 pt-2 mt-2">
              <Link href="/dictionary" className="w-full">
                <Button size="sm" variant="subtle" className="w-full justify-between text-amber-700 dark:text-amber-300">
                  <span>Search Lexicon</span>
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Quick Metrics Card */}
          <Card className="hover:border-slate-300 dark:hover:border-slate-700 transition-all">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between mb-1">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600">
                  <Activity className="h-4 w-4" />
                </div>
                <Badge variant="outline">Engine</Badge>
              </div>
              <CardTitle className="text-sm">System Performance</CardTitle>
              <CardDescription className="text-xs line-clamp-2">
                140-d normalized vector pipeline. Sub-15ms edge inference with PyTorch & MediaPipe 0.10+.
              </CardDescription>
            </CardHeader>
            <CardFooter className="p-4 pt-2 mt-2">
              <div className="w-full flex items-center justify-between text-xs text-slate-500">
                <span>Latency: &lt;14.2ms</span>
                <span className="font-bold text-emerald-600">Optimal</span>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* 4. Grid Section: Learning Progress & Recent Translations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Learning Progress Area (1 col) */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-emerald-600" />
                Learning Progress
              </CardTitle>
              <Badge variant="success">Level 2</Badge>
            </div>
            <CardDescription>
              Conversational ISL track progress and daily milestones.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700 dark:text-slate-300">Curriculum Mastery</span>
                <span className="text-brand-600">42%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-brand-600 h-2.5 rounded-full w-[42%]" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">25 of 60 signs mastered</p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Mastered Recently</p>
              <div className="flex flex-wrap gap-1.5">
                {["HELLO", "THANK YOU", "WATER", "YES", "NO", "PLEASE"].map((sign) => (
                  <span
                    key={sign}
                    className="inline-flex items-center gap-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 text-[10px] font-semibold"
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    {sign}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <Link href="/academy">
                <Button size="sm" variant="outline" className="w-full text-xs">
                  Continue Lesson 4: Everyday Verbs
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Translations Area (2 cols) */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4 text-brand-600" />
                  Recent Translations
                </CardTitle>
                <CardDescription>
                  Recent Subject-Object-Verb (SOV) transformations and recognized gestures.
                </CardDescription>
              </div>
              <Badge variant="secondary">Demo Records</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {DEMO_RECENT_TRANSLATIONS.map((tx) => (
                <div key={tx.id} className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {tx.input}
                      </span>
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded">
                        {tx.type}
                      </span>
                    </div>
                    <div className="text-xs font-mono font-semibold text-brand-700 dark:text-brand-300">
                      {tx.sovGloss}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="text-[11px] text-emerald-600 font-bold">{tx.confidence}</span>
                    <span className="text-[11px]">{tx.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 5. Recent Activity Timeline */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4 text-indigo-600" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Chronological log of practice sessions, rooms attended, and diagnostics.
              </CardDescription>
            </div>
            <span className="text-[11px] text-slate-400">Identified Demo Timeline</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {DEMO_RECENT_ACTIVITY.map((act) => (
              <div key={act.id} className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full p-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-brand-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      {act.title}
                    </p>
                    <Badge variant={act.badgeVariant}>{act.badge}</Badge>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {act.description}
                  </p>
                </div>
                <span className="text-[11px] text-slate-400 whitespace-nowrap">
                  {act.time}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}

