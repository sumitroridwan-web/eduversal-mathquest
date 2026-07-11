"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LabelledField, Input } from "@/components/ui/Field";
import { useToasts } from "@/stores/ui";

export default function ResetPasswordPage() {
  const router = useRouter();
  const notify = useToasts((s) => s.notify);
  const [done, setDone] = useState(false);
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.length < 8) return setError("Password must be at least 8 characters.");
    if (pw !== confirm) return setError("Passwords do not match.");
    setError("");
    setDone(true);
    notify({ variant: "success", title: "Password updated", description: "You can now log in." });
  };

  if (done) {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h1 className="mt-5 font-display text-2xl font-bold text-navy-900">Password reset</h1>
        <p className="mt-2 text-sm text-navy-500">Your password has been updated successfully.</p>
        <Button className="mt-6 w-full" size="lg" onClick={() => router.push("/login")}>
          Continue to login
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-navy-900">Set a new password</h1>
      <p className="mt-1 text-sm text-navy-500">Choose a strong password you don&apos;t use elsewhere.</p>
      <form className="mt-8 space-y-5" onSubmit={submit}>
        {error && (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        <LabelledField label="New password" htmlFor="pw" hint="Min. 8 characters" required>
          <Input id="pw" type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="••••••••" />
        </LabelledField>
        <LabelledField label="Confirm new password" htmlFor="confirm" required>
          <Input id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" />
        </LabelledField>
        <Button type="submit" className="w-full" size="lg">
          <KeyRound className="h-4 w-4" /> Update password
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-navy-500">
        <Link href="/login" className="font-semibold text-teal-700 hover:text-teal-800">← Back to login</Link>
      </p>
    </div>
  );
}
