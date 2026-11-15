"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Camera,
  Languages,
  GraduationCap,
  Video,
  BookOpen,
  Settings,
  Menu,
  X,
  Eye,
  HandMetal,
} from "lucide-react";
import { useAccessibilityStore } from "@/store/useAccessibilityStore";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/studio", label: "Sign Studio", icon: Camera, desc: "Sign to Text" },
  { href: "/translate", label: "Translate", icon: Languages, desc: "Text to Sign" },
  { href: "/learn", label: "Learn & Practice", icon: GraduationCap, desc: "Interactive Lessons" },
  { href: "/meet", label: "Meet Room", icon: Video, desc: "WebRTC with Captions" },
  { href: "/dictionary", label: "Dictionary", icon: BookOpen, desc: "60 ISL Signs" },
  { href: "/settings", label: "Settings", icon: Settings, desc: "Accessibility" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { highContrast, setHighContrast } = useAccessibilityStore();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-accessibility-focus rounded-lg p-1"
        >
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <HandMetal className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                SignConnect
              </span>
              <span className="text-xs font-bold uppercase tracking-wider bg-brand-100 dark:bg-brand-900/50 text-brand-700 dark:text-brand-300 px-1.5 py-0.5 rounded">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium">Indian Sign Language Platform</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-accessibility-focus",
                  isActive
                    ? "bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-brand-600 dark:text-brand-400" : "text-slate-400")} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Quick Accessibility Button & Mobile Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setHighContrast(!highContrast)}
            aria-label="Toggle High Contrast Mode"
            title="Toggle High Contrast Mode"
            className={cn(
              "p-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-accessibility-focus",
              highContrast
                ? "bg-accessibility-focus text-black border-black font-bold"
                : "border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            )}
          >
            <Eye className="h-5 w-5" />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="md:hidden p-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-6 space-y-1">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-lg text-base font-semibold",
                  isActive
                    ? "bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
              >
                <Icon className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                <div>
                  <div className="text-sm font-bold">{link.label}</div>
                  <div className="text-xs text-slate-400 font-normal">{link.desc}</div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
