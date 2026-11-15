"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Camera,
  Languages,
  Volume2,
  Copy,
  ArrowRight,
  Sparkles,
  Settings,
  Layers,
  ArrowRightLeft,
  CheckCircle2,
  Play,
  RotateCcw,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function CommunicationPage() {
  const [activeTab, setActiveTab] = useState("sign-to-text");
  const [sampleText, setSampleText] = useState("Where is the hospital?");
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AppShell
      breadcrumbs={[{ label: "AI Communication Center", active: true }]}
      title="AI Communication Center"
      description="Two-way assistive bridge: Real-time ISL camera recognition to speech/text, and authentic Subject-Object-Verb (SOV) text-to-sign translation."
      actions={
        <div className="flex items-center gap-2">
          <Link href="/studio">
            <Button size="sm" className="gap-1.5 bg-brand-600">
              <Camera className="h-3.5 w-3.5" />
              Launch Live Studio
            </Button>
          </Link>
          <Link href="/translate">
            <Button size="sm" variant="outline" className="gap-1.5">
              <Languages className="h-3.5 w-3.5 text-teal-600" />
              SOV Translator
            </Button>
          </Link>
        </div>
      }
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 max-w-md w-full">
          <TabsTrigger value="sign-to-text" className="gap-2">
            <Camera className="h-3.5 w-3.5" />
            <span>Sign to Text (Camera)</span>
          </TabsTrigger>
          <TabsTrigger value="text-to-sign" className="gap-2">
            <Languages className="h-3.5 w-3.5" />
            <span>Text to Sign (SOV)</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Sign to Text */}
        <TabsContent value="sign-to-text" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Camera Viewport Placeholder */}
            <Card className="lg:col-span-2 overflow-hidden border-slate-200 dark:border-slate-800">
              <div className="relative aspect-video bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-white">
                <div className="h-16 w-16 rounded-2xl bg-brand-600/30 border border-brand-500/40 flex items-center justify-center text-brand-400 mb-3 animate-pulse">
                  <Camera className="h-8 w-8" />
                </div>
                <h3 className="text-base font-bold text-white">
                  Camera Feed Preview
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mt-1">
                  Connect your webcam to detect 21 hand landmarks in real time with the PyTorch neural classifier.
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <Link href="/studio">
                    <Button size="sm" className="bg-brand-600 hover:bg-brand-500 gap-1.5 font-bold">
                      <Camera className="h-4 w-4" />
                      Open Full Sign Studio
                    </Button>
                  </Link>
                  <Link href="/lab">
                    <Button size="sm" variant="outline" className="border-slate-700 text-slate-200 hover:bg-slate-800 text-xs">
                      Inspect Landmarks
                    </Button>
                  </Link>
                </div>

                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <Badge variant="success">Camera Ready</Badge>
                  <span className="text-[10px] text-slate-400">MediaPipe 0.10</span>
                </div>
                <div className="absolute bottom-4 right-4 text-[10px] text-slate-400 font-mono">
                  Target FPS: 30 | Inactive (Preview)
                </div>
              </div>

              <CardContent className="p-4 bg-slate-50/50 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Predicted ISL Sign</span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black text-slate-900 dark:text-white">NAMASTE (नमस्ते)</span>
                      <Badge variant="accent">96.8% Confidence</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="gap-1 text-xs">
                      <Volume2 className="h-3.5 w-3.5 text-brand-600" />
                      Speak Audio
                    </Button>
                    <Button size="sm" variant="ghost" className="text-xs">
                      <RotateCcw className="h-3.5 w-3.5 mr-1" />
                      Clear Buffer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sentence Builder Sidebar */}
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Constructed Sentence</CardTitle>
                  <CardDescription>Cumulative words recognized from hand gestures.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="min-h-24 p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-sm font-semibold text-slate-800 dark:text-slate-100">
                    &quot;HELLO I NEED HELP WHERE HOSPITAL&quot;
                  </div>
                  <div className="flex items-center justify-between">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs gap-1"
                      onClick={() => handleCopy("HELLO I NEED HELP WHERE HOSPITAL")}
                    >
                      <Copy className="h-3 w-3" />
                      {copied ? "Copied!" : "Copy Sentence"}
                    </Button>
                    <Badge variant="secondary">4 Words Accumulated</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">ISL Features</CardTitle>
                  <CardDescription>Recognition engine capabilities.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span>Active Vocabulary</span>
                    <span className="font-bold text-slate-900 dark:text-white">60 Standard Signs</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span>Fingerspelling Fallback</span>
                    <span className="font-bold text-emerald-600">Enabled (A-Z)</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span>Speech Synthesis</span>
                    <span className="font-bold text-brand-600">Web Speech API</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Text to Sign */}
        <TabsContent value="text-to-sign" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Subject-Object-Verb (SOV) Translator</CardTitle>
              <CardDescription>
                Converts English/Hindi grammatical syntax into authentic Indian Sign Language sign orders.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Type English or Hindi sentence:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={sampleText}
                    onChange={(e) => setSampleText(e.target.value)}
                    placeholder="Enter sentence e.g., 'What is your name?'"
                    className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <Button size="sm" className="font-bold bg-teal-600 hover:bg-teal-700">
                    Translate to SOV
                  </Button>
                </div>
              </div>

              {/* Translation Output Card */}
              <div className="rounded-2xl border border-teal-200 dark:border-teal-900/60 bg-teal-50/50 dark:bg-teal-950/20 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
                    ISL Linguistic Gloss Breakdown
                  </span>
                  <Badge variant="accent">SOV Grammar Reordered</Badge>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-teal-300 dark:border-teal-800 font-mono font-bold text-sm text-teal-900 dark:text-teal-100 shadow-sm">
                    [HOSPITAL]
                  </span>
                  <ArrowRight className="h-4 w-4 text-teal-500" />
                  <span className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-teal-300 dark:border-teal-800 font-mono font-bold text-sm text-teal-900 dark:text-teal-100 shadow-sm">
                    [WHERE]
                  </span>
                  <span className="text-xs text-teal-700 dark:text-teal-400 font-medium ml-2">
                    (Question marker moved to terminal position per ISL syntax)
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <Link href="/translate">
                    <Button size="sm" variant="outline" className="border-teal-300 text-teal-800 hover:bg-teal-100 dark:border-teal-800 dark:text-teal-300">
                      Open Dedicated Translator <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </Link>
                  <span className="text-slate-400 text-[11px]">2 signs sequenced</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}

