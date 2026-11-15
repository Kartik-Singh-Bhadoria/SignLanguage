import React from "react";
import Link from "next/link";
import { Heart, ShieldCheck, Accessibility, HandMetal } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 py-10 text-sm text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-7 w-7 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <HandMetal className="h-4 w-4" />
            </div>
            <span className="font-extrabold text-base text-slate-900 dark:text-white">SignConnect AI</span>
          </div>
          <p className="max-w-md text-xs leading-relaxed text-slate-600 dark:text-slate-400 mb-4">
            An advanced AI-powered accessibility platform advancing Indian Sign Language (ISL) communication,
            two-way translation, interactive posture learning, and inclusive WebRTC video meetings.
          </p>
          <div className="flex items-center gap-4 text-xs">
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded">
              <ShieldCheck className="h-3.5 w-3.5" /> WCAG 2.1 AAA Compliant
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 px-2 py-1 rounded">
              <Accessibility className="h-3.5 w-3.5" /> Screen Reader Optimized
            </span>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-slate-900 dark:text-white mb-3 text-xs uppercase tracking-wider">Features</h3>
          <ul className="space-y-2 text-xs">
            <li><Link href="/studio" className="hover:text-brand-600 transition-colors">Sign-to-Text Studio</Link></li>
            <li><Link href="/translate" className="hover:text-brand-600 transition-colors">Text-to-Sign (SOV Grammar)</Link></li>
            <li><Link href="/learn" className="hover:text-brand-600 transition-colors">Interactive Practice Hub</Link></li>
            <li><Link href="/meet" className="hover:text-brand-600 transition-colors">Accessible Video Rooms</Link></li>
            <li><Link href="/dictionary" className="hover:text-brand-600 transition-colors">60-Sign ISL Dictionary</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-slate-900 dark:text-white mb-3 text-xs uppercase tracking-wider">Accessibility</h3>
          <ul className="space-y-2 text-xs">
            <li>High Contrast Support</li>
            <li>Dynamic Font Scaling</li>
            <li>Speech Synthesis (TTS)</li>
            <li>Color Vision Safe Presets</li>
            <li>Motion Reduction Options</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs">
        <p>© 2026 SignConnect AI. Built for accessibility and inclusive communication.</p>
        <p className="flex items-center gap-1 mt-2 sm:mt-0">
          Empowering the Deaf and Hard-of-Hearing community across India.
        </p>
      </div>
    </footer>
  );
}

