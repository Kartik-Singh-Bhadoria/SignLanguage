"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Video,
  GraduationCap,
  FlaskConical,
  BookOpen,
  User,
  Settings,
  Sparkles,
  ChevronRight,
  Shield,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeVariant?: "accent" | "default" | "success";
  description: string;
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview & metrics",
  },
  {
    label: "AI Communication",
    href: "/communication",
    icon: MessageSquare,
    badge: "Active",
    badgeVariant: "accent",
    description: "Sign-to-Text & Text-to-Sign",
  },
  {
    label: "Live Connect",
    href: "/live-connect",
    icon: Video,
    badge: "WebRTC",
    badgeVariant: "default",
    description: "Video rooms & captions",
  },
  {
    label: "Learning Academy",
    href: "/academy",
    icon: GraduationCap,
    badge: "ISL",
    badgeVariant: "success",
    description: "Interactive lessons & drills",
  },
  {
    label: "Gesture Lab",
    href: "/lab",
    icon: FlaskConical,
    description: "Landmark tester & calibration",
  },
  {
    label: "ISL Dictionary",
    href: "/dictionary",
    icon: BookOpen,
    description: "60+ signs reference",
  },
];

export const SECONDARY_NAV_ITEMS: NavItem[] = [
  {
    label: "User Profile",
    href: "/profile",
    icon: User,
    description: "Account & preferences",
  },
  {
    label: "Accessibility Settings",
    href: "/settings",
    icon: Settings,
    description: "Contrast, fonts, motion",
  },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col w-64 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md p-4 min-h-[calc(100vh-4rem)]",
        className
      )}
    >
      <div className="space-y-6 flex-1">
        {/* Navigation Section */}
        <div>
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Core Modules
          </div>
          <nav className="space-y-1">
            {MAIN_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-brand-500",
                    isActive
                      ? "bg-brand-600 text-white shadow-md shadow-brand-500/20"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={cn(
                        "h-4 w-4 flex-shrink-0 transition-colors",
                        isActive
                          ? "text-white"
                          : "text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200"
                      )}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={cn(
                        "text-[10px] font-bold px-1.5 py-0.5 rounded-md",
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Preferences Section */}
        <div>
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Account & System
          </div>
          <nav className="space-y-1">
            {SECONDARY_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500",
                    isActive
                      ? "bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0 text-slate-400" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Accessibility Status Card */}
      <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 mt-auto">
        <div className="flex items-center gap-2 mb-1">
          <Shield className="h-4 w-4 text-emerald-500" />
          <span className="text-xs font-bold text-slate-900 dark:text-white">
            WCAG 2.2 AAA
          </span>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
          High-contrast mode, SOV grammar parsing, and screen reader labels active.
        </p>
      </div>
    </aside>
  );
}

