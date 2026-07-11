"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Role } from "@/types";
import { useAuth } from "@/stores/auth";
import { roleMeta } from "@/config/navigation";
import { LoadingState } from "@/components/ui/States";

/**
 * Demo route protection. In production this logic would run in middleware
 * against a verified session. Here it reads the persisted demo auth store.
 */
export function RoleGuard({ role, children }: { role: Role; children: React.ReactNode }) {
  const router = useRouter();
  const { user, status, hydrated } = useAuth();

  useEffect(() => {
    if (!hydrated) return;
    if (status !== "authenticated" || !user) {
      router.replace("/login");
    } else if (user.role !== role) {
      // Signed in as a different role → send to their own home, not an error.
      router.replace(roleMeta[user.role].home);
    }
  }, [hydrated, status, user, role, router]);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingState label="Loading your MathQuest…" />
      </div>
    );
  }

  if (status !== "authenticated" || !user || user.role !== role) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingState label="Redirecting…" />
      </div>
    );
  }

  return <>{children}</>;
}
