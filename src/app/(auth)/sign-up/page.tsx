"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LabelledField, Input, Select, Checkbox } from "@/components/ui/Field";
import { useAuth } from "@/stores/auth";
import { useToasts } from "@/stores/ui";
import { roleMeta } from "@/config/navigation";
import type { SignUpRole } from "@/types";

const signUpRoles: { value: SignUpRole; label: string }[] = [
  { value: "school-manager", label: "School Manager" },
  { value: "teacher", label: "Teacher" },
  { value: "student", label: "Student" },
  { value: "parent", label: "Parent" },
];

const schema = z
  .object({
    fullName: z.string().min(2, "Enter your full name"),
    email: z.string().email("Enter a valid email"),
    phone: z.string().min(6, "Enter a valid phone number"),
    role: z.enum(["school-manager", "teacher", "student", "parent"]),
    school: z.string().min(2, "Enter your school name or invitation code"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm: z.string(),
    terms: z.literal(true, { errorMap: () => ({ message: "You must accept the Terms" }) }),
    privacy: z.literal(true, { errorMap: () => ({ message: "You must accept the Privacy Policy" }) }),
  })
  .refine((d) => d.password === d.confirm, {
    path: ["confirm"],
    message: "Passwords do not match",
  });

type FormValues = z.infer<typeof schema>;

export default function SignUpPage() {
  const router = useRouter();
  const loginAsRole = useAuth((s) => s.loginAsRole);
  const updateUser = useAuth((s) => s.updateUser);
  const notify = useToasts((s) => s.notify);
  const [verifying, setVerifying] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: "teacher" },
  });

  const onSubmit = (values: FormValues) => {
    // Simulate an email-verification step then sign the demo user in.
    setVerifying(true);
    const first = values.fullName.trim().split(" ")[0];
    window.setTimeout(() => {
      loginAsRole(values.role);
      updateUser({
        name: values.fullName,
        firstName: first,
        email: values.email,
        phone: values.phone,
        schoolName: values.school,
      });
      notify({ variant: "success", title: "Account created", description: "Welcome to MathQuest!" });
      router.push(roleMeta[values.role].home);
    }, 1400);
  };

  if (verifying) {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-50">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-teal-500 border-t-transparent" />
        </div>
        <h1 className="mt-5 font-display text-xl font-bold text-navy-900">Verifying your email…</h1>
        <p className="mt-2 text-sm text-navy-500">
          In production we&apos;d send a verification link. For this demo we&apos;ll sign you in
          automatically.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-navy-900">Create your account</h1>
      <p className="mt-1 text-sm text-navy-500">Start your MathQuest in a couple of minutes.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4" noValidate>
        <LabelledField label="Full name" htmlFor="fullName" error={errors.fullName?.message} required>
          <Input id="fullName" placeholder="Jane Doe" {...register("fullName")} />
        </LabelledField>
        <div className="grid gap-4 sm:grid-cols-2">
          <LabelledField label="Email address" htmlFor="email" error={errors.email?.message} required>
            <Input id="email" type="email" placeholder="you@school.edu" {...register("email")} />
          </LabelledField>
          <LabelledField label="Phone number" htmlFor="phone" error={errors.phone?.message} required>
            <Input id="phone" type="tel" placeholder="+62 811 …" {...register("phone")} />
          </LabelledField>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <LabelledField label="I am a…" htmlFor="role" error={errors.role?.message} required>
            <Select id="role" {...register("role")}>
              {signUpRoles.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </Select>
          </LabelledField>
          <LabelledField
            label="School name or invite code"
            htmlFor="school"
            error={errors.school?.message}
            required
          >
            <Input id="school" placeholder="e.g. Bright Horizons / BH-2026" {...register("school")} />
          </LabelledField>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <LabelledField label="Password" htmlFor="password" error={errors.password?.message} hint="Min. 8 characters" required>
            <Input id="password" type="password" placeholder="••••••••" {...register("password")} />
          </LabelledField>
          <LabelledField label="Confirm password" htmlFor="confirm" error={errors.confirm?.message} required>
            <Input id="confirm" type="password" placeholder="••••••••" {...register("confirm")} />
          </LabelledField>
        </div>

        <div className="space-y-2 rounded-xl bg-surface-soft p-3">
          <Checkbox
            {...register("terms")}
            label={<>I agree to the <Link href="/terms" className="font-medium text-teal-700 underline">Terms of Service</Link></>}
          />
          {errors.terms && <p className="text-xs font-medium text-red-600">{errors.terms.message}</p>}
          <Checkbox
            {...register("privacy")}
            label={<>I agree to the <Link href="/privacy" className="font-medium text-teal-700 underline">Privacy Policy</Link></>}
          />
          {errors.privacy && <p className="text-xs font-medium text-red-600">{errors.privacy.message}</p>}
        </div>

        <p className="text-xs text-navy-400">
          Administrator accounts are provisioned by Eduversal and are not available via public sign-up.
        </p>

        <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
          <UserPlus className="h-4 w-4" /> Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-navy-500">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-teal-700 hover:text-teal-800">Log in</Link>
      </p>
    </div>
  );
}
