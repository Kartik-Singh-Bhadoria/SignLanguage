"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HandMetal, Lock, Mail, User, ShieldCheck, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("learner");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!agree) {
      setError("Please accept the accessibility terms of use.");
      return;
    }
    setError("");
    setIsLoading(true);

    // Simulated registration redirect for Phase 2 UI preview
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 600);
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
            Create your account
          </h1>
          <p className="text-xs text-slate-500">
            Join the inclusive Indian Sign Language accessibility community.
          </p>
        </div>

        <Card className="border-slate-200 dark:border-slate-800 shadow-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Registration</CardTitle>
              <Badge variant="secondary">Phase 2 Demo</Badge>
            </div>
            <CardDescription>
              Set up your profile and primary communication preferences.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full name"
                type="text"
                placeholder="Rajesh Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                icon={<User className="h-4 w-4" />}
                required
              />

              <Input
                label="Email address"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="h-4 w-4" />}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="h-4 w-4" />}
                required
              />

              <Select
                label="Primary role / interest"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                options={[
                  { value: "learner", label: "ISL Student / Learner" },
                  { value: "deaf_individual", label: "Deaf or Hard of Hearing Individual" },
                  { value: "interpreter", label: "Professional Sign Language Interpreter" },
                  { value: "educator", label: "Educator / Special Teacher" },
                  { value: "healthcare", label: "Healthcare & Emergency Worker" },
                ]}
              />

              {error && (
                <div className="rounded-lg bg-red-50 p-2.5 text-xs text-red-600 dark:bg-red-950/40 dark:text-red-300">
                  {error}
                </div>
              )}

              <div className="text-xs">
                <label className="flex items-start gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span>
                    I agree to the accessibility code of conduct and consent to on-device camera processing for gesture recognition.
                  </span>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full font-bold"
                isLoading={isLoading}
              >
                Create Account
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center border-t border-slate-100 dark:border-slate-800 pt-4">
            <p className="text-xs text-slate-500 text-center">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-brand-600 hover:text-brand-500">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>

        <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <HeartHandshake className="h-3.5 w-3.5 text-brand-500" />
          <span>Designed with and for the Indian Deaf Community</span>
        </div>
      </div>
    </div>
  );
}

