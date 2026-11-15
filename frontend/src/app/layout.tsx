import type { Metadata } from "next";
import "./globals.css";
import { AppHeader } from "@/components/layout/AppHeader";
import { Footer } from "@/components/layout/Footer";
import { AccessibilityToolbar } from "@/components/accessibility/AccessibilityToolbar";
import { AccessibilityProvider } from "@/components/accessibility/AccessibilityProvider";

export const metadata: Metadata = {
  title: "SignConnect AI - Indian Sign Language (ISL) Accessibility Platform",
  description:
    "AI-powered Indian Sign Language recognition, two-way speech/text translation, posture learning, and inclusive WebRTC video communication.",
  keywords: ["Indian Sign Language", "ISL", "Accessibility", "AI", "Sign-to-Text", "MediaPipe", "Deaf Accessibility"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col min-h-screen">
        <AccessibilityProvider>
          <AppHeader />
          <div className="flex-1 flex flex-col w-full">
            {children}
          </div>
          <Footer />
          <AccessibilityToolbar />
        </AccessibilityProvider>
      </body>
    </html>
  );
}
