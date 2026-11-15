"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  MessageSquare,
  Users,
  Copy,
  Check,
  Send,
  Sparkles,
  PhoneOff,
  ShieldCheck,
} from "lucide-react";
import { api, VideoRoomResult } from "@/lib/api";
import { useAccessibilityStore } from "@/store/useAccessibilityStore";
import { cn } from "@/lib/utils";

export default function MeetPage() {
  const [roomCode, setRoomCode] = useState("");
  const [activeRoom, setActiveRoom] = useState<VideoRoomResult | null>(null);
  const [isInCall, setIsInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [copied, setCopied] = useState(false);
  const [liveCaption, setLiveCaption] = useState<string | null>(
    "SignConnect AI live captioning is active."
  );
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string; time: string }[]>([
    { sender: "System", text: "Welcome to SignConnect Meet. Live ISL recognition is enabled.", time: "Now" }
  ]);
  const [inputChat, setInputChat] = useState("");

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const { speakText } = useAccessibilityStore();

  const handleCreateRoom = async () => {
    try {
      const room = await api.createRoom("Inclusive Community Room", 8, true);
      setActiveRoom(room);
      setRoomCode(room.room_code);
      joinCall(room.room_code);
    } catch (err) {
      console.error("Room creation error:", err);
    }
  };

  const handleJoinRoom = async () => {
    if (!roomCode.trim()) return;
    try {
      const room = await api.getRoom(roomCode.trim());
      setActiveRoom(room);
      joinCall(room.room_code);
    } catch (err) {
      console.error("Failed to join room:", err);
      alert("Room not found. Check the room code.");
    }
  };

  const joinCall = async (code: string) => {
    setIsInCall(true);

    // Initialize local camera
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.play();
      }
    } catch (err) {
      console.warn("Camera/Mic access unavailable:", err);
    }

    // Connect signaling WebSocket
    const wsUrl = `ws://127.0.0.1:8000/api/v1/ws/video/rooms/${code}/signal`;
    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === "caption" && msg.payload?.text) {
            setLiveCaption(msg.payload.text);
            speakText(msg.payload.text);
          } else if (msg.type === "chat") {
            setChatMessages((prev) => [
              ...prev,
              { sender: msg.sender || "Peer", text: msg.text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
            ]);
          }
        } catch (e) {
          console.error("Signal parse error:", e);
        }
      };
    } catch (wsErr) {
      console.warn("WebSocket signaling unavailable in offline sandbox:", wsErr);
    }
  };

  const leaveCall = () => {
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
    if (wsRef.current) {
      wsRef.current.close();
    }
    setIsInCall(false);
    setActiveRoom(null);
  };

  const broadcastSignSubtitle = (signText: string) => {
    setLiveCaption(`Sign: ${signText}`);
    speakText(signText);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && activeRoom) {
      wsRef.current.send(
        JSON.stringify({
          type: "caption",
          payload: { text: `[ISL Sign] ${signText}` },
        })
      );
    }
  };

  const handleSendChat = () => {
    if (!inputChat.trim()) return;
    const msg = {
      sender: "You",
      text: inputChat.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages((prev) => [...prev, msg]);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && activeRoom) {
      wsRef.current.send(JSON.stringify({ type: "chat", text: inputChat.trim(), sender: "You" }));
    }
    setInputChat("");
  };

  const copyRoomCode = () => {
    if (!roomCode) return;
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600">
              <Video className="h-6 w-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              SignConnect Meet
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Inclusive WebRTC video rooms with real-time Indian Sign Language (ISL) captions and two-way chat.
          </p>
        </div>

        {isInCall && activeRoom && (
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs font-mono font-bold text-purple-900 dark:text-purple-200 flex items-center gap-2">
              <span>Room: {activeRoom.room_code}</span>
              <button onClick={copyRoomCode} title="Copy room code">
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
              </button>
            </div>
            <button
              onClick={leaveCall}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shadow"
            >
              <PhoneOff className="h-4 w-4" /> Leave Room
            </button>
          </div>
        )}
      </div>

      {!isInCall ? (
        /* Join / Create Room Card */
        <div className="max-w-xl mx-auto p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl space-y-6 text-center">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-600 shadow-md">
            <Video className="h-8 w-8" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Start or Join an Inclusive Meeting</h2>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Meet peer-to-peer with live sign recognition caption overlays for deaf and hearing participants.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <button
              onClick={handleCreateRoom}
              className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md transition-transform active:scale-95"
            >
              Create New Meeting Room
            </button>

            <div className="flex items-center gap-2 my-4">
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
              <span className="text-xs font-bold text-slate-400 uppercase">Or Join Existing</span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Room Code (e.g. SIGN-A1B2)"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                className="flex-1 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs font-mono font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none uppercase"
              />
              <button
                onClick={handleJoinRoom}
                disabled={!roomCode.trim()}
                className="px-6 py-3 rounded-xl bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs disabled:opacity-40"
              >
                Join
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* In-Call Meeting Stage */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Main Video Stream & Captions (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="relative aspect-video rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl flex items-center justify-center">
              {/* Local Video Stream */}
              <video
                ref={localVideoRef}
                playsInline
                muted
                className={cn(
                  "w-full h-full object-cover transform -scale-x-100",
                  !videoEnabled && "hidden"
                )}
              />

              {!videoEnabled && (
                <div className="text-center text-slate-500 space-y-2">
                  <VideoOff className="h-12 w-12 mx-auto text-slate-700" />
                  <p className="text-xs font-medium">Camera is disabled</p>
                </div>
              )}

              {/* Live ISL Caption Banner (Overlaid over video bottom) */}
              {liveCaption && (
                <div className="absolute bottom-6 left-6 right-6 z-20">
                  <div className="p-3.5 rounded-2xl bg-black/85 backdrop-blur-md border border-white/20 text-center shadow-2xl">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-purple-400 mb-0.5 flex items-center justify-center gap-1">
                      <Sparkles className="h-3 w-3" /> Live ISL Caption Overlay
                    </div>
                    <div className="text-lg font-black text-white tracking-wide">
                      {liveCaption}
                    </div>
                  </div>
                </div>
              )}

              {/* Call Controls Floating Bar */}
              <div className="absolute top-4 right-4 z-20 flex gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={cn(
                    "p-2.5 rounded-xl backdrop-blur shadow",
                    isMuted ? "bg-rose-600 text-white" : "bg-slate-900/80 text-white hover:bg-slate-800"
                  )}
                  title={isMuted ? "Unmute Mic" : "Mute Mic"}
                >
                  {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => setVideoEnabled(!videoEnabled)}
                  className={cn(
                    "p-2.5 rounded-xl backdrop-blur shadow",
                    !videoEnabled ? "bg-rose-600 text-white" : "bg-slate-900/80 text-white hover:bg-slate-800"
                  )}
                  title={videoEnabled ? "Stop Video" : "Start Video"}
                >
                  {videoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Quick In-Call ISL Sign Trigger Buttons */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-500 mr-2 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-purple-600" /> Sign Quick Trigger:
              </span>
              {[
                "NAMASTE",
                "THANK_YOU",
                "PLEASE",
                "HELP",
                "WATER",
                "DOCTOR",
                "YES",
                "NO",
              ].map((sign) => (
                <button
                  key={sign}
                  onClick={() => broadcastSignSubtitle(sign)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  {sign}
                </button>
              ))}
            </div>
          </div>

          {/* In-Call Accessible Chat (1 col) */}
          <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md flex flex-col h-[480px]">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4 text-purple-600" /> Meeting Chat
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">Accessible</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "p-3 rounded-2xl space-y-1",
                    msg.sender === "You"
                      ? "bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 ml-4"
                      : "bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 mr-4"
                  )}
                >
                  <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300 text-[10px]">
                    <span>{msg.sender}</span>
                    <span className="text-slate-400 font-normal">{msg.time}</span>
                  </div>
                  <p className="text-slate-800 dark:text-slate-200">{msg.text}</p>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <input
                type="text"
                placeholder="Type message..."
                value={inputChat}
                onChange={(e) => setInputChat(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                className="flex-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
              <button
                onClick={handleSendChat}
                disabled={!inputChat.trim()}
                className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-40"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
