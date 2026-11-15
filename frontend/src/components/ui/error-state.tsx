import * as React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-2xl border border-red-200 bg-red-50/70 p-6 text-red-900 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-200",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className="rounded-xl bg-red-100 p-2 text-red-600 dark:bg-red-900/50 dark:text-red-300">
          <AlertCircle className="h-6 w-6" />
        </div>
        <div className="flex-1 space-y-1">
          <h4 className="text-sm font-bold text-red-900 dark:text-red-200">
            {title}
          </h4>
          <p className="text-xs text-red-700 dark:text-red-300 leading-relaxed">
            {message}
          </p>
          {onRetry && (
            <div className="pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={onRetry}
                className="border-red-300 text-red-800 hover:bg-red-100 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900/50"
              >
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                Retry
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

