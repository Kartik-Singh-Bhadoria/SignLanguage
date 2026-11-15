"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HandMetal, Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }
    setError("");
    setIsLoading(true);

    // Simulated login redirect for Phase 2 UI preview
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 600);
  };

  const fillDemoCredentials = () => {
    setEmail("rajesh@signconnect.ai");
    setPassword("DemoPassword123!");
    setError("");
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-brand-600 dark:text-brand-400 font-extrabold text-2xl"
          >
            <div className="h-10 w-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md">
              <HandMetal className="h-6 w-6" />
            </div>
            <span>SignConnect AI</span>
          </Link>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">
            Sign in to your account
          </h1>
          <p className="text-xs text-slate-500">
            Access Indian Sign Language recognition and accessible communication tools.
          </p>
        </div>

        <Card className="border-slate-200 dark:border-slate-800 shadow-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Sign In</CardTitle>
              <Badge variant="secondary">Phase 2 Demo</Badge>
            </div>
            <CardDescription>
              Enter your credentials or use the quick demo filler below.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email address"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="h-4 w-4" />}
                required
                autoComplete="email"
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="h-4 w-4" />}
                required
                autoComplete="current-password"
              />

              {error && (
                <div className="rounded-lg bg-red-50 p-2.5 text-xs text-red-600 dark:bg-red-950/40 dark:text-red-300">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span>Remember me</span>
                </label>
                <a href="#" className="font-semibold text-brand-600 hover:text-brand-500">
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                className="w-full font-bold"
                isLoading={isLoading}
              >
                Sign In
              </Button>
            </form>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={fillDemoCredentials}
                className="w-full text-xs font-semibold gap-1.5"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-brand-600" />
                Fill Demo Credentials (Rajesh S.)
              </Button>
            </div>
          </CardContent>

          <CardFooter className="justify-center border-t border-slate-100 dark:border-slate-800 pt-4">
            <p className="text-xs text-slate-500 text-center">
              Don&apos;t have an account yet?{" "}
              <Link href="/register" className="font-bold text-brand-600 hover:text-brand-500">
                Register here
              </Link>
            </p>
          </CardFooter>
        </Card>

        <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          <span>Protected with PBKDF2-SHA256 & RFC 7519 HS256 tokens</span>
        </div>
      </div>
    </div>
  );
}

