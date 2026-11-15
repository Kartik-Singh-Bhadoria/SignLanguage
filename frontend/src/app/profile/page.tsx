"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  ShieldCheck,
  Award,
  Flame,
  CheckCircle2,
  Calendar,
  Settings,
  Edit3,
  Bell,
  Heart,
  Save,
  HandMetal,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function ProfilePage() {
  const [name, setName] = useState("Rajesh Sharma");
  const [email, setEmail] = useState("rajesh@signconnect.ai");
  const [language, setLanguage] = useState("en");
  const [dialect, setDialect] = useState("standard_isl");
  const [hearingStatus, setHearingStatus] = useState("hard_of_hearing");
  const [savedNotification, setSavedNotification] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2500);
  };

  return (
    <AppShell
      breadcrumbs={[{ label: "User Profile", active: true }]}
      title="User Profile"
      description="Manage your personal details, accessibility communication preferences, and learning achievements."
      actions={
        <Link href="/settings">
          <Button size="sm" variant="outline" className="gap-1.5">
            <Settings className="h-3.5 w-3.5" />
            Accessibility Settings
          </Button>
        </Link>
      }
    >
      {/* Profile Overview Card */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-lg">
                RS
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    {name}
                  </h2>
                  <Badge variant="accent">Pro Member</Badge>
                </div>
                <p className="text-xs text-slate-500">{email}</p>
                <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Member since Nov 2026
                  </span>
                  <span>•</span>
                  <span>New Delhi, India</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="text-base font-black text-brand-600">25</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Signs Mastered</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="text-base font-black text-emerald-600">92%</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Avg. Accuracy</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="text-base font-black text-amber-500">5</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Day Streak</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid grid-cols-2 max-w-sm w-full">
          <TabsTrigger value="account">Personal Details</TabsTrigger>
          <TabsTrigger value="achievements">Badges & Progress</TabsTrigger>
        </TabsList>

        {/* Tab 1: Account Info */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Personal & Linguistic Preferences</CardTitle>
              <CardDescription>
                Customize your display name and sign language preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4 max-w-xl">
                <Input
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Preferred Language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    options={[
                      { value: "en", label: "English" },
                      { value: "hi", label: "Hindi (हिन्दी)" },
                    ]}
                  />

                  <Select
                    label="ISL Standard / Dialect"
                    value={dialect}
                    onChange={(e) => setDialect(e.target.value)}
                    options={[
                      { value: "standard_isl", label: "Standard ISLRTC Indian Sign Language" },
                      { value: "northern_isl", label: "Northern ISL Dialect" },
                      { value: "southern_isl", label: "Southern ISL Dialect" },
                    ]}
                  />
                </div>

                <Select
                  label="Hearing & Communication Identity"
                  value={hearingStatus}
                  onChange={(e) => setHearingStatus(e.target.value)}
                  options={[
                    { value: "hard_of_hearing", label: "Hard of Hearing" },
                    { value: "deaf", label: "Deaf (Primary Signer)" },
                    { value: "coda", label: "CODA (Child of Deaf Adults)" },
                    { value: "hearing_ally", label: "Hearing Learner / Ally" },
                  ]}
                />

                {savedNotification && (
                  <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" /> Profile preferences saved successfully!
                  </div>
                )}

                <div className="pt-2">
                  <Button type="submit" size="sm" className="font-bold gap-1.5">
                    <Save className="h-3.5 w-3.5" />
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Achievements */}
        <TabsContent value="achievements">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Achievements & Milestone Badges</CardTitle>
              <CardDescription>
                Earned through lesson completion and camera posture practice.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    title: "First Steps",
                    desc: "Mastered first 5 ISL alphabets",
                    icon: HandMetal,
                    date: "Nov 10, 2026",
                    color: "text-brand-600 bg-brand-50 dark:bg-brand-950",
                  },
                  {
                    title: "Precision Posture",
                    desc: "Achieved 95%+ landmark accuracy",
                    icon: Award,
                    date: "Nov 12, 2026",
                    color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950",
                  },
                  {
                    title: "5-Day Streak",
                    desc: "Practiced 5 consecutive days",
                    icon: Flame,
                    date: "Today",
                    color: "text-amber-600 bg-amber-50 dark:bg-amber-950",
                  },
                  {
                    title: "Room Host",
                    desc: "Hosted first Live Connect room",
                    icon: ShieldCheck,
                    date: "Nov 14, 2026",
                    color: "text-purple-600 bg-purple-50 dark:bg-purple-950",
                  },
                ].map((badge, i) => {
                  const Icon = badge.icon;
                  return (
                    <div
                      key={i}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 flex flex-col items-center text-center space-y-2"
                    >
                      <div className={`h-12 w-12 rounded-2xl ${badge.color} flex items-center justify-center`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {badge.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-tight">
                        {badge.desc}
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {badge.date}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
