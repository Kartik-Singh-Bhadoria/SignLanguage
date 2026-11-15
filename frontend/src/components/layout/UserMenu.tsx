"use client";

import * as React from "react";
import Link from "next/link";
import { User, Settings, LogOut, Shield, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function UserMenu() {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="User Account Menu"
        className={cn(
          "flex items-center gap-2 p-1.5 rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500",
          open
            ? "border-brand-500 bg-brand-50 dark:bg-brand-950/60"
            : "border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
        )}
      >
        <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
          RS
        </div>
        <div className="hidden sm:block text-left text-xs">
          <p className="font-bold text-slate-800 dark:text-slate-200 leading-tight">
            Rajesh S.
          </p>
          <p className="text-[10px] text-slate-400">Pro Member</p>
        </div>
        <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl z-50 p-1.5 animate-in fade-in zoom-in-95">
          <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
            <p className="text-xs font-bold text-slate-900 dark:text-white">
              Rajesh Sharma
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              rajesh@signconnect.ai
            </p>
          </div>

          <div className="py-1">
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <User className="h-4 w-4 text-slate-400" />
              <span>User Profile</span>
            </Link>

            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Settings className="h-4 w-4 text-slate-400" />
              <span>Accessibility & Settings</span>
            </Link>

            <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

