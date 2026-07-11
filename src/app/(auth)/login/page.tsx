"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, LogIn, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LabelledField, Input, Checkbox } from "@/components/ui/Field";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/stores/auth";
import { useToasts } from "@/stores/ui";
import { demoAccounts } from "@/data/users";
import { roleMeta } from "@/config/navigation";
import type { Role } from "@/types";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});
type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const login = useAuth((s) => s.login);
  const notify = useToasts((s) => s.notify);
  const [showPw, setShowPw] = useState(false);
  const [formError, setFormError] = useState("");

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (values: FormValues) => {
    const result = login(values.email, values.password);
    if (!result.ok || !result.user) {
      setFormError(result.error ?? "Login failed");
      return;
    }
    setFormError("");
    notify({ variant: "success", title: `Welcome back, ${result.user.firstName}!` });
    router.push(roleMeta[result.user.role].home);
  };

  const quickFill = (email: string) => {
    setValue("email", email);
    setValue("password", "demo1234");
    setFormError("");
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-navy-900">Welcome back</h1>
      <p className="mt-1 text-sm text-navy-500">Log in to continue your MathQuest.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" noValidate>
        {formError && (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {formError}
          </div>
        )}
        <LabelledField label="Email address" htmlFor="email" error={errors.email?.message} required>
          <Input id="email" type="email" autoComplete="email" placeholder="you@school.edu" {...register("email")} />
        </LabelledField>
        <LabelledField label="Password" htmlFor="password" error={errors.password?.message} required>
          <div className="relative">
            <Input
              id="password"
              type={showPw ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              className="pr-10"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-700"
              aria-label={showPw ? "Hide password" : "Show password"}
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </LabelledField>

        <div className="flex items-center justify-between">
          <Checkbox label="Remember me" defaultChecked />
          <Link href="/forgot-password" className="text-sm font-medium text-teal-700 hover:text-teal-800">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
          <LogIn className="h-4 w-4" /> Log in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-navy-500">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="font-semibold text-teal-700 hover:text-teal-800">
          Sign up
        </Link>
      </p>

      {/* Demo accounts */}
      <div className="mt-8 rounded-2xl border border-navy-100 bg-surface-soft p-4">
        <div className="mb-3 flex items-center gap-2">
          <Badge tone="accent">Demo mode</Badge>
          <p className="text-xs text-navy-500">Click a role to fill credentials, then log in.</p>
        </div>
        <div className="grid gap-2">
          {demoAccounts.map((a) => (
            <button
              key={a.user.id}
              onClick={() => quickFill(a.user.email)}
              className="group flex items-center gap-3 rounded-xl border border-navy-100 bg-white p-2.5 text-left transition-colors hover:border-teal-300"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-50 text-lg" aria-hidden>
                {a.user.avatar}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-navy-900">{roleMeta[a.user.role].label}</p>
                <p className="truncate text-xs text-navy-400">{a.user.email} · {a.password}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-navy-300 group-hover:text-teal-600" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
