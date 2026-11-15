"use client";

import * as React from "react";
import { Sidebar } from "./Sidebar";
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export function AppShell({
  children,
  breadcrumbs,
  title,
  description,
  actions,
  className,
  fullWidth = false,
}: AppShellProps) {
  return (
    <div className="flex w-full">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
        <div className={cn("mx-auto space-y-6", fullWidth ? "w-full" : "max-w-6xl", className)}>
          {/* Top Breadcrumb & Page Header */}
          {(breadcrumbs || title || actions) && (
            <div className="space-y-3 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
              {breadcrumbs && <Breadcrumb items={breadcrumbs} />}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {title && (
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                      {title}
                    </h1>
                    {description && (
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {description}
                      </p>
                    )}
                  </div>
                )}
                {actions && <div className="flex items-center gap-2">{actions}</div>}
              </div>
            </div>
          )}

          {/* Children Content */}
          {children}
        </div>
      </main>
    </div>
  );
}

