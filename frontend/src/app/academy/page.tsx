"use client";

import React from "react";
import Link from "next/link";
import {
  GraduationCap,
  CheckCircle2,
  Lock,
  ArrowRight,
  Play,
  Flame,
  Award,
  BookOpen,
  Sparkles,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const COURSES = [
  {
    id: "course-1",
    level: "Level 1",
    title: "ISL Alphabets & Numerals",
    description: "Master the 26 Indian Sign Language manual alphabets and digits 0 to 9.",
    signsCount: 36,
    progress: 100,
    status: "Completed",
    badgeVariant: "success" as const,
  },
  {
    id: "course-2",
    level: "Level 2",
    title: "Everyday Greetings & Essentials",
    description: "Core interaction signs: NAMASTE, THANK YOU, PLEASE, WATER, FOOD, and YES/NO.",
    signsCount: 14,
    progress: 60,
    status: "In Progress",
    badgeVariant: "accent" as const,
  },
  {
    id: "course-3",
    level: "Level 3",
    title: "Family, Feelings & Time",
    description: "Express family relations, emotions, days of the week, and temporal markers.",
    signsCount: 16,
    progress: 0,
    status: "Ready to Start",
    badgeVariant: "default" as const,
  },
  {
    id: "course-4",
    level: "Level 4",
    title: "Healthcare & Emergency Signs",
    description: "Critical emergency communication: DOCTOR, MEDICINE, PAIN, POLICE, and DANGER.",
    signsCount: 12,
    progress: 0,
    status: "Locked",
    badgeVariant: "secondary" as const,
  },
];

export default function AcademyPage() {
  return (
    <AppShell
      breadcrumbs={[{ label: "Learning Academy", active: true }]}
      title="Learning Academy"
      description="Interactive Indian Sign Language curriculum powered by real-time AI posture evaluation and coaching feedback."
      actions={
        <Link href="/learn">
          <Button size="sm" className="gap-1.5 bg-brand-600 font-bold">
            <GraduationCap className="h-4 w-4" />
            Open Practice Hub
          </Button>
        </Link>
      }
    >
      {/* Academy Stats Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Daily Streak</span>
            <Flame className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">5 Days</div>
          <p className="text-[11px] text-slate-400">Keep practicing daily</p>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Signs Mastered</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">25 / 60</div>
          <p className="text-[11px] text-emerald-600 font-semibold">41.6% Completed</p>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Avg. Posture Score</span>
            <Award className="h-4 w-4 text-brand-500" />
          </div>
          <div className="text-2xl font-black text-brand-600 dark:text-brand-400 mt-1">92.4%</div>
          <p className="text-[11px] text-slate-400">Euclidean landmark score</p>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Current Level</span>
            <Sparkles className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">Level 2</div>
          <p className="text-[11px] text-slate-400">Intermediate Signer</p>
        </div>
      </div>

      {/* Real-time Posture Evaluation Feature Card */}
      <Card className="border-brand-200 dark:border-brand-800 bg-brand-50/50 dark:bg-brand-950/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base text-brand-900 dark:text-brand-200">
              Interactive Posture Analyzer
            </CardTitle>
            <Badge variant="accent">Real-Time AI Feedback</Badge>
          </div>
          <CardDescription className="text-brand-700/80 dark:text-brand-300/80">
            Unlike static video tutorials, SignConnect AI inspects your camera feed in real time. It calculates Euclidean distance across 21 joint landmarks, detects finger curl ratios, and delivers instant coaching tips (e.g. &quot;Straighten index finger&quot; or &quot;Align wrist with shoulder&quot;).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/learn">
            <Button size="sm" className="bg-brand-600 hover:bg-brand-500 gap-1.5 font-bold">
              <Play className="h-3.5 w-3.5" />
              Launch Posture Practice Session
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Course Curriculum List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900 dark:text-white">
            Curriculum Modules
          </h2>
          <span className="text-xs text-slate-400">Standard Indian Sign Language (ISLRTC Aligned)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {COURSES.map((course) => (
            <Card key={course.id} className="hover:border-slate-300 dark:hover:border-slate-700 transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {course.level}
                  </span>
                  <Badge variant={course.badgeVariant}>{course.status}</Badge>
                </div>
                <CardTitle className="text-base">{course.title}</CardTitle>
                <CardDescription className="text-xs leading-relaxed">
                  {course.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3 pb-3">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-500">{course.signsCount} Signs in Course</span>
                    <span className="text-brand-600">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-brand-600 h-2 rounded-full transition-all"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-2">
                {course.status === "Locked" ? (
                  <Button size="sm" variant="outline" disabled className="w-full text-xs gap-1.5">
                    <Lock className="h-3.5 w-3.5" /> Complete Level 3 to Unlock
                  </Button>
                ) : (
                  <Link href={`/learn?course=${course.id}`} className="w-full">
                    <Button size="sm" variant="subtle" className="w-full justify-between text-xs">
                      <span>{course.progress === 100 ? "Review Course" : "Continue Lessons"}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

