import React from "react";
import Link from "next/link";
import {
  MessageSquare,
  Video,
  GraduationCap,
  FlaskConical,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Zap,
  HandMetal,
  CheckCircle2,
  Users,
  Sparkles,
  Camera,
  Layers,
  ArrowUpRight,
  Sliders,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-20">
      {/* 1. Hero / Project Introduction */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 sm:p-14 border border-slate-800 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-600/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-500/20 border border-brand-500/30 px-3.5 py-1 text-xs font-semibold text-brand-300">
            <Sparkles className="h-3.5 w-3.5 text-brand-400" />
            AI-Powered Indian Sign Language Accessibility Platform
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Bridging Worlds with <br />
            <span className="text-brand-400">Indian Sign Language</span> & AI
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
            SignConnect AI empowers deaf and hard-of-hearing individuals across India with real-time
            21-point hand landmark recognition, authentic Subject-Object-Verb (SOV) translation, interactive
            posture coaching, and inclusive video meetings.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link href="/dashboard">
              <Button size="lg" className="gap-2 font-bold bg-brand-500 hover:bg-brand-600">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            <Link href="/communication">
              <Button size="lg" variant="outline" className="gap-2 border-slate-700 text-slate-200 hover:bg-slate-800">
                <MessageSquare className="h-4 w-4 text-brand-400" />
                AI Communication Center
              </Button>
            </Link>

            <Link href="/live-connect">
              <Button size="lg" variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800">
                <Video className="h-4 w-4 mr-1.5 text-teal-400" />
                Live Connect
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Platform Overview & Metrics */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "ISL Signs Trained", value: "60+", desc: "Alphabets, numbers & core phrases" },
          { label: "Edge Inference", value: "<15ms", desc: "Real-time hand landmark prediction" },
          { label: "Grammar Engine", value: "ISL SOV", desc: "Native Subject-Object-Verb syntax" },
          { label: "Accessibility Tier", value: "WCAG AAA", desc: "High-contrast, TTS & colorblind modes" },
        ].map((stat, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
          >
            <div className="text-2xl sm:text-3xl font-black text-brand-600 dark:text-brand-400">
              {stat.value}
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">
              {stat.label}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">{stat.desc}</div>
          </div>
        ))}
      </section>

      {/* 3. Five Module Previews */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <Badge variant="accent" className="mb-2">Comprehensive Suite</Badge>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Five Specialized Core Modules
            </h2>
            <p className="text-sm text-slate-500 max-w-xl mt-1">
              Engineered specifically for Indian Sign Language linguistics, real-time video communication, and assistive learning.
            </p>
          </div>
          <Link href="/dashboard" className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1">
            Open Dashboard <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Module 1: AI Communication Center */}
          <Card className="hover:border-brand-300 dark:hover:border-brand-800 transition-all flex flex-col justify-between">
            <CardHeader>
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded-xl bg-brand-100 dark:bg-brand-950 flex items-center justify-center text-brand-600">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <Badge variant="default">Module 1</Badge>
              </div>
              <CardTitle>AI Communication Center</CardTitle>
              <CardDescription>
                Two-way translation pipeline: convert camera sign gestures into spoken English/Hindi, or parse text/speech into animated ISL glosses using native SOV grammar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/communication">
                <Button size="sm" variant="subtle" className="w-full justify-between">
                  <span>Enter Communication Hub</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Module 2: Live Connect */}
          <Card className="hover:border-teal-300 dark:hover:border-teal-800 transition-all flex flex-col justify-between">
            <CardHeader>
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded-xl bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-600">
                  <Video className="h-5 w-5" />
                </div>
                <Badge variant="accent">Module 2</Badge>
              </div>
              <CardTitle>Live Connect (WebRTC)</CardTitle>
              <CardDescription>
                Zero-latency inclusive video conferencing rooms. Displays synchronized live ISL sign captions on participant streams with screen sharing and speech-to-sign.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/live-connect">
                <Button size="sm" variant="subtle" className="w-full justify-between text-teal-700 dark:text-teal-300">
                  <span>Join Live Connect</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Module 3: Learning Academy */}
          <Card className="hover:border-emerald-300 dark:hover:border-emerald-800 transition-all flex flex-col justify-between">
            <CardHeader>
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <Badge variant="success">Module 3</Badge>
              </div>
              <CardTitle>Learning Academy</CardTitle>
              <CardDescription>
                Interactive curriculum covering alphabets, numbers, greetings, and daily conversation. Features real-time posture grading with 0-100% precision metrics and coach tips.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/academy">
                <Button size="sm" variant="subtle" className="w-full justify-between text-emerald-700 dark:text-emerald-300">
                  <span>Explore Curriculum</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Module 4: Gesture Recognition Lab */}
          <Card className="hover:border-purple-300 dark:hover:border-purple-800 transition-all flex flex-col justify-between">
            <CardHeader>
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded-xl bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-600">
                  <FlaskConical className="h-5 w-5" />
                </div>
                <Badge variant="secondary">Module 4</Badge>
              </div>
              <CardTitle>Gesture Recognition Lab</CardTitle>
              <CardDescription>
                Diagnostic studio for hand landmark inspection. Real-time visualization of 21 3D coordinates, Euclidean distance normalization, confidence thresholds, and model debugging.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/lab">
                <Button size="sm" variant="subtle" className="w-full justify-between text-purple-700 dark:text-purple-300">
                  <span>Launch Lab</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Module 5: ISL Dictionary & Lexicon */}
          <Card className="hover:border-amber-300 dark:hover:border-amber-800 transition-all flex flex-col justify-between">
            <CardHeader>
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600">
                  <BookOpen className="h-5 w-5" />
                </div>
                <Badge variant="warning">Module 5</Badge>
              </div>
              <CardTitle>ISL Dictionary & Lexicon</CardTitle>
              <CardDescription>
                Searchable repository of 60 standardized Indian Sign Language gestures with step-by-step hand posture guidelines, Hindi descriptions, and reference 3D landmarks.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dictionary">
                <Button size="sm" variant="subtle" className="w-full justify-between text-amber-700 dark:text-amber-300">
                  <span>Browse Dictionary</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Accessibility Settings Shortcut */}
          <Card className="hover:border-rose-300 dark:hover:border-rose-800 transition-all flex flex-col justify-between">
            <CardHeader>
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded-xl bg-rose-100 dark:bg-rose-950 flex items-center justify-center text-rose-600">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <Badge variant="destructive">Accessibility</Badge>
              </div>
              <CardTitle>Universal Accessibility</CardTitle>
              <CardDescription>
                Fine-tune high contrast themes, protanopia/deuteranopia vision presets, dynamic font scale (100%-150%), screen reader announcements, and reduced motion settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/settings">
                <Button size="sm" variant="subtle" className="w-full justify-between text-rose-700 dark:text-rose-300">
                  <span>Configure Settings</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 4. How the Platform Works */}
      <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 sm:p-12 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="default">Under the Hood</Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            How SignConnect AI Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            A real-time hybrid architecture combining MediaPipe computer vision, PyTorch deep neural networks, and ISL linguistic syntax.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          <div className="space-y-3 relative">
            <div className="h-12 w-12 rounded-2xl bg-brand-50 dark:bg-brand-950 border border-brand-200 dark:border-brand-800 flex items-center justify-center font-black text-brand-600">
              01
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Landmark Extraction
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Camera feeds capture hand gestures at 30 FPS. MediaPipe tracks 21 3D landmarks per hand with wrist-relative Euclidean normalization.
            </p>
          </div>

          <div className="space-y-3 relative">
            <div className="h-12 w-12 rounded-2xl bg-teal-50 dark:bg-teal-950 border border-teal-200 dark:border-teal-800 flex items-center justify-center font-black text-teal-600">
              02
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Neural Classification
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              PyTorch deep neural network processes the 140-dimensional feature vector, delivering sub-15ms predictions with probability distribution metrics.
            </p>
          </div>

          <div className="space-y-3 relative">
            <div className="h-12 w-12 rounded-2xl bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 flex items-center justify-center font-black text-purple-600">
              03
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              SOV Linguistic Grammar
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              ISL grammar engine transforms English SVO structures into Subject-Object-Verb glosses with interrogative markers placed at sentence ends.
            </p>
          </div>

          <div className="space-y-3 relative">
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center font-black text-emerald-600">
              04
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Multimodal Output
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Recognized gestures trigger text-to-speech voice playback, live WebRTC video subtitle overlays, and posture grading tips in real time.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Bottom Call to Action */}
      <section className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Ready to experience accessible communication?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Open the SignConnect AI dashboard now or create your free account to access personalized ISL learning.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <Link href="/register">
            <Button size="lg" className="bg-brand-500 hover:bg-brand-600 font-bold">
              Create Account
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="lg" variant="outline" className="border-slate-700 text-slate-200 hover:bg-slate-800">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
