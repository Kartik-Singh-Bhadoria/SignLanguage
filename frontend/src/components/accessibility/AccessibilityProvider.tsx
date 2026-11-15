"use client";

import React, { useEffect, useState } from "react";
import { useAccessibilityStore } from "@/store/useAccessibilityStore";

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { highContrast, fontScale, reduceMotion, colorBlindMode } = useAccessibilityStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  const colorClass =
    colorBlindMode !== "none" ? `vision-${colorBlindMode}` : "";

  return (
    <div
      className={`${highContrast ? "high-contrast" : ""} ${colorClass} min-h-screen flex flex-col transition-colors duration-200`}
      style={{
        fontSize: `${fontScale}rem`,
      }}
    >
      {children}
    </div>
  );
}
