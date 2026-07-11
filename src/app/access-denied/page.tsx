import type { Metadata } from "next";
import { StatusScreen } from "@/components/layout/StatusScreen";

export const metadata: Metadata = { title: "Access Denied" };

export default function AccessDeniedPage() {
  return (
    <StatusScreen
      icon="ShieldX"
      tone="red"
      code="403 — Forbidden"
      title="Access denied"
      description="You don't have permission to view this page. It may belong to a different role. Please log in with an account that has access."
      primary={{ label: "Go to login", href: "/login" }}
      secondary={{ label: "Return home", href: "/" }}
    />
  );
}
