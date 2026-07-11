"use client";

import { useState } from "react";
import Link from "next/link";
import { MailCheck, ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LabelledField, Input } from "@/components/ui/Field";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");

  if (sent) {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-teal-600">
          <MailCheck className="h-7 w-7" />
        </div>
        <h1 className="mt-5 font-display text-2xl font-bold text-navy-900">Check your email</h1>
        <p className="mt-2 text-sm text-navy-500">
          If an account exists for <strong>{email || "that address"}</strong>, we&apos;ve sent a link
          to reset your password.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <Button asChildHref="/reset-password" variant="outline">
            Continue to reset (demo)
          </Button>
          <Button asChildHref="/login" variant="ghost">
            <ArrowLeft className="h-4 w-4" /> Back to login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-navy-900">Forgot password?</h1>
      <p className="mt-1 text-sm text-navy-500">
        Enter your email and we&apos;ll send you a reset link.
      </p>
      <form
        className="mt-8 space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
      >
        <LabelledField label="Email address" htmlFor="email" required>
          <Input
            id="email"
            type="email"
            required
            placeholder="you@school.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </LabelledField>
        <Button type="submit" className="w-full" size="lg">
          <Send className="h-4 w-4" /> Send reset link
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-navy-500">
        <Link href="/login" className="font-semibold text-teal-700 hover:text-teal-800">
          ← Back to login
        </Link>
      </p>
    </div>
  );
}
