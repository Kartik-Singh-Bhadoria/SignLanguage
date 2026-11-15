"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FlaskConical,
  Activity,
  Sliders,
  Cpu,
  Layers,
  Sparkles,
  RefreshCw,
  Eye,
  CheckCircle2,
  Camera,
  Play,
  RotateCcw,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";

export default function LabPage() {
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.7);
  const [smoothingFrames, setSmoothingFrames] = useState(5);
  const [handMode, setHandMode] = useState("right");
  const [isSimulating, setIsSimulating] = useState(false);

  // Mock 21-landmark diagnostics
  const LANDMARK_SAMPLES = [
    { id: 0, name: "Wrist (Root)", x: "0.521", y: "0.814", z: "0.000" },
    { id: 4, name: "Thumb Tip", x: "0.384", y: "0.520", z: "-0.042" },
    { id: 8, name: "Index Tip", x: "0.485", y: "0.312", z: "-0.081" },
    { id: 12, name: "Middle Tip", x: "0.562", y: "0.294", z: "-0.078" },
    { id: 16, name: "Ring Tip", x: "0.628", y: "0.340", z: "-0.065" },
    { id: 20, name: "Pinky Tip", x: "0.681", y: "0.410", z: "-0.051" },
  ];

  return (
    <AppShell
      breadcrumbs={[{ label: "Gesture Recognition Lab", active: true }]}
      title="Gesture Recognition Lab"
      description="Computer vision diagnostic studio for 21-point MediaPipe hand landmark tracking, 140-d vector extraction, and neural network calibration."
      actions={
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1.5 py-1 px-2.5">
            <Cpu className="h-3 w-3 text-purple-500" />
            PyTorch MLP (140 → 60 Classes)
          </Badge>
          <Link href="/studio">
            <Button size="sm" className="gap-1 bg-brand-600">
              <Camera className="h-3.5 w-3.5" />
              Live Studio
            </Button>
          </Link>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Landmark Visualizer Viewport (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden border-slate-200 dark:border-slate-800">
            <div className="relative aspect-video bg-slate-950 flex flex-col items-center justify-center p-6 text-white text-center">
              {/* Landmark Diagram Mock */}
              <div className="relative w-64 h-64 border border-slate-800 rounded-2xl flex items-center justify-center bg-slate-900/60 p-4">
                <svg className="w-full h-full text-brand-400" viewBox="0 0 200 200">
                  {/* Skeletal bones */}
                  <line x1="100" y1="170" x2="60" y2="130" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
                  <line x1="100" y1="170" x2="80" y2="100" stroke="currentColor" strokeWidth="2" />
                  <line x1="100" y1="170" x2="100" y2="90" stroke="currentColor" strokeWidth="2" />
                  <line x1="100" y1="170" x2="120" y2="100" stroke="currentColor" strokeWidth="2" />
                  <line x1="100" y1="170" x2="140" y2="120" stroke="currentColor" strokeWidth="2" />

                  {/* Finger digits */}
                  <line x1="80" y1="100" x2="75" y2="50" stroke="currentColor" strokeWidth="2" />
                  <line x1="100" y1="90" x2="100" y2="40" stroke="currentColor" strokeWidth="2" />
                  <line x1="120" y1="100" x2="125" y2="50" stroke="currentColor" strokeWidth="2" />
                  <line x1="140" y1="120" x2="150" y2="70" stroke="currentColor" strokeWidth="2" />

                  {/* Landmark Joint Dots */}
                  <circle cx="100" cy="170" r="5" fill="#f43f5e" /> {/* Wrist */}
                  <circle cx="75" cy="50" r="4" fill="#6366f1" /> {/* Index Tip */}
                  <circle cx="100" cy="40" r="4" fill="#6366f1" /> {/* Middle Tip */}
                  <circle cx="125" cy="50" r="4" fill="#6366f1" /> {/* Ring Tip */}
                  <circle cx="150" cy="70" r="4" fill="#6366f1" /> {/* Pinky Tip */}
                  <circle cx="45" cy="100" r="4" fill="#6366f1" /> {/* Thumb Tip */}
                </svg>

                <div className="absolute top-2 left-3 text-[10px] text-slate-400 font-mono">
                  Wrist Origin (0,0,0)
                </div>
                <div className="absolute bottom-2 right-3 text-[10px] text-emerald-400 font-mono">
                  Scale: Normalized
                </div>
              </div>

              <div className="mt-4 space-y-1">
                <p className="text-xs font-bold text-white">MediaPipe Hand Landmark Mesh</p>
                <p className="text-[11px] text-slate-400">
                  Scale-invariant Euclidean normalization relative to wrist point 0.
                </p>
              </div>

              <div className="absolute top-4 left-4">
                <Badge variant="accent">Diagnostic Mode</Badge>
              </div>
              <div className="absolute top-4 right-4 text-[10px] text-slate-400 font-mono">
                Latency: 12.8ms
              </div>
            </div>

            <CardContent className="p-4 bg-slate-50/50 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    Calculated Feature Vector
                  </span>
                  <p className="text-[11px] text-slate-500">
                    42 raw coords + 42 Euclidean dists + 20 angles + 16 finger curl ratios + 20 pairwise dists = 140 floats.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsSimulating(!isSimulating)}
                  className="gap-1.5 text-xs"
                >
                  <RefreshCw className="h-3 w-3 text-brand-600" />
                  {isSimulating ? "Stop Live Stream" : "Simulate Test Stream"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Keypoint Coordinate Table */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm">Sample Landmark Coordinates</CardTitle>
                  <CardDescription>Wrist-relative normalized 3D coordinates (x, y, z).</CardDescription>
                </div>
                <Badge variant="secondary">6 of 21 Points Displayed</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono">
                    <tr>
                      <th className="pb-2">Point ID</th>
                      <th className="pb-2">Joint Description</th>
                      <th className="pb-2">Normalized X</th>
                      <th className="pb-2">Normalized Y</th>
                      <th className="pb-2">Normalized Z</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                    {LANDMARK_SAMPLES.map((pt) => (
                      <tr key={pt.id} className="text-slate-700 dark:text-slate-300">
                        <td className="py-2 text-brand-600 font-bold">#{pt.id}</td>
                        <td className="py-2 font-sans font-medium text-slate-900 dark:text-white">
                          {pt.name}
                        </td>
                        <td className="py-2">{pt.x}</td>
                        <td className="py-2">{pt.y}</td>
                        <td className="py-2">{pt.z}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Model Calibration Parameters (1 col) */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Sliders className="h-4 w-4 text-brand-600" />
                Inference Calibration
              </CardTitle>
              <CardDescription>
                Tune real-time sensitivity and temporal smoothing.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-slate-700 dark:text-slate-300">Confidence Threshold</span>
                  <span className="text-brand-600 font-mono">{(confidenceThreshold * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.4"
                  max="0.95"
                  step="0.05"
                  value={confidenceThreshold}
                  onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                  className="w-full accent-brand-600"
                />
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Predictions below this confidence are filtered out.
                </p>
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-slate-700 dark:text-slate-300">Temporal Smoothing</span>
                  <span className="text-brand-600 font-mono">{smoothingFrames} Frames</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={smoothingFrames}
                  onChange={(e) => setSmoothingFrames(parseInt(e.target.value))}
                  className="w-full accent-brand-600"
                />
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Sliding window buffer to avoid gesture flickering.
                </p>
              </div>

              <Select
                label="Dominant Hand Mode"
                value={handMode}
                onChange={(e) => setHandMode(e.target.value)}
                options={[
                  { value: "right", label: "Right Hand Dominant" },
                  { value: "left", label: "Left Hand Dominant" },
                  { value: "bimanual", label: "Dual Hands (Two-handed signs)" },
                ]}
              />

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setConfidenceThreshold(0.7);
                    setSmoothingFrames(5);
                    setHandMode("right");
                  }}
                  className="w-full text-xs gap-1.5"
                >
                  <RotateCcw className="h-3 w-3" /> Reset to Defaults
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Model Information</CardTitle>
              <CardDescription>Active neural architecture specs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span>Architecture</span>
                <span className="font-bold text-slate-900 dark:text-white">PyTorch MLP (3-layer)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span>Hidden Dimension</span>
                <span className="font-mono text-slate-900 dark:text-white">128 → 64 → 60</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span>Total Parameters</span>
                <span className="font-mono text-slate-900 dark:text-white">28,476</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Inference Device</span>
                <span className="font-bold text-emerald-600">CPU / WebAssembly</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

