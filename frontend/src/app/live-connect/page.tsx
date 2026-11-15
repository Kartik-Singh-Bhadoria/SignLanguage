"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Video,
  Users,
  Plus,
  ArrowRight,
  ShieldCheck,
  Radio,
  Sparkles,
  Lock,
  Globe,
  Settings,
  Subtitles,
  Mic,
  HandMetal,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const DEMO_ROOMS = [
  {
    id: "isl-sync-101",
    name: "Accessibility Daily Standup",
    host: "Ananya Iyer",
    participants: 4,
    captionsActive: true,
    status: "Active Now",
  },
  {
    id: "clinic-assist-204",
    name: "Healthcare Sign Interpretation",
    host: "Dr. K. Verma",
    participants: 2,
    captionsActive: true,
    status: "In Progress",
  },
  {
    id: "learn-circle-305",
    name: "ISL Beginners Practice Circle",
    host: "Pooja Patel",
    participants: 6,
    captionsActive: true,
    status: "Starting in 15m",
  },
];

export default function LiveConnectPage() {
  const [roomId, setRoomId] = useState("");
  const [newRoomName, setNewRoomName] = useState("");

  return (
    <AppShell
      breadcrumbs={[{ label: "Live Connect", active: true }]}
      title="Live Connect (WebRTC)"
      description="Inclusive real-time video conferencing designed for deaf, hard-of-hearing, and hearing participants with live ISL gesture caption overlays."
      actions={
        <div className="flex items-center gap-2">
          <Badge variant="success" className="gap-1 py-1 px-2.5">
            <Radio className="h-3 w-3 text-emerald-500 animate-pulse" />
            Signaling Server Online
          </Badge>
          <Link href="/meet">
            <Button size="sm" className="gap-1.5 bg-brand-600">
              <Video className="h-3.5 w-3.5" />
              Direct Meet Room
            </Button>
          </Link>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create / Join Cards (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Create Room */}
            <Card>
              <CardHeader>
                <div className="h-10 w-10 rounded-xl bg-brand-100 dark:bg-brand-950 flex items-center justify-center text-brand-600 mb-2">
                  <Plus className="h-5 w-5" />
                </div>
                <CardTitle className="text-base">Start New Room</CardTitle>
                <CardDescription>
                  Instant WebRTC video room with automatic AI sign captioning.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  label="Room Title"
                  placeholder="e.g., Weekly Team Sync"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                />
                <Link href={`/meet?room=${encodeURIComponent(newRoomName || "instant-room")}`}>
                  <Button className="w-full gap-1.5 font-bold mt-2">
                    <Video className="h-4 w-4" />
                    Create & Join Room
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Join Room */}
            <Card>
              <CardHeader>
                <div className="h-10 w-10 rounded-xl bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-600 mb-2">
                  <Users className="h-5 w-5" />
                </div>
                <CardTitle className="text-base">Join by Code</CardTitle>
                <CardDescription>
                  Enter a room code or invite link provided by the meeting host.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  label="Room ID or Link"
                  placeholder="e.g., room-491-alpha"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                />
                <Link href={`/meet?room=${encodeURIComponent(roomId || "general")}`}>
                  <Button variant="outline" className="w-full gap-1.5 font-bold mt-2">
                    <ArrowRight className="h-4 w-4" />
                    Join Existing Room
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Active Rooms List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Active Community Rooms</CardTitle>
                  <CardDescription>
                    Public and practice rooms currently operating on the network.
                  </CardDescription>
                </div>
                <Badge variant="secondary">Demo Directory</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {DEMO_ROOMS.map((room) => (
                  <div
                    key={room.id}
                    className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {room.name}
                        </span>
                        <Badge variant="success">{room.status}</Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span>Host: {room.host}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" /> {room.participants} online
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-brand-600 font-semibold">
                          <Subtitles className="h-3 w-3" /> Live ISL Captions
                        </span>
                      </div>
                    </div>

                    <Link href={`/meet?room=${room.id}`}>
                      <Button size="sm" variant="subtle" className="text-xs gap-1">
                        <span>Join</span>
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Connect Feature Highlights (1 col) */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-brand-600" />
                Assistive Video Features
              </CardTitle>
              <CardDescription>
                Built-in accessibility tools for seamless interaction.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                  <Subtitles className="h-3.5 w-3.5 text-teal-600" />
                  Live ISL Video Overlay
                </div>
                <p className="text-[11px] leading-relaxed">
                  Signs performed on camera appear as real-time subtitles right on your video stream.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                  <Mic className="h-3.5 w-3.5 text-brand-600" />
                  Speech-to-Sign Feed
                </div>
                <p className="text-[11px] leading-relaxed">
                  Hearing participants&apos; spoken words are converted into SOV sign glosses for deaf attendees.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  Peer-to-Peer Privacy
                </div>
                <p className="text-[11px] leading-relaxed">
                  WebRTC peer connection ensures media streams travel directly between clients without recording.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

