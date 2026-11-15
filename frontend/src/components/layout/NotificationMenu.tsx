"use client";

import * as React from "react";
import { Bell, CheckCheck, Clock, ShieldCheck, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: "info" | "success" | "feature";
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    title: "Posture Accuracy High",
    message: "Your 'NAMASTE' sign achieved 96% landmark precision in practice session.",
    timestamp: "12m ago",
    read: false,
    type: "success",
  },
  {
    id: "2",
    title: "Live Room Scheduled",
    message: "Inclusive ISL live conference room 'Deaf-Hearing Sync' starting at 3:00 PM.",
    timestamp: "1h ago",
    read: false,
    type: "info",
  },
  {
    id: "3",
    title: "New Signs Added",
    message: "ISL Dictionary updated with 12 new emergency and healthcare signs.",
    timestamp: "3h ago",
    read: true,
    type: "feature",
  },
];

export function NotificationMenu() {
  const [open, setOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

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

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={`Notifications, ${unreadCount} unread`}
        className={cn(
          "relative p-2 rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500",
          open
            ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300"
            : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
        )}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-4 py-3 bg-slate-50/50 dark:bg-slate-950/40">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-900 dark:text-white">Notifications</span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 px-2 py-0.5 text-[11px] font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-[11px] font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 flex items-center gap-1"
              >
                <CheckCheck className="h-3.5 w-3.5" /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No notifications to display
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "p-3.5 transition-colors flex items-start gap-3 text-left relative group",
                    !item.read ? "bg-brand-50/40 dark:bg-brand-950/20" : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  )}
                >
                  <div
                    className={cn(
                      "mt-0.5 rounded-lg p-1.5 flex-shrink-0",
                      item.type === "success" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
                      item.type === "info" && "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
                      item.type === "feature" && "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                    )}
                  >
                    {item.type === "success" && <ShieldCheck className="h-3.5 w-3.5" />}
                    {item.type === "info" && <Clock className="h-3.5 w-3.5" />}
                    {item.type === "feature" && <Sparkles className="h-3.5 w-3.5" />}
                  </div>

                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {item.title}
                      </p>
                      <span className="text-[10px] text-slate-400">{item.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug mt-0.5">
                      {item.message}
                    </p>
                  </div>

                  <button
                    onClick={() => removeNotification(item.id)}
                    aria-label="Dismiss notification"
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

