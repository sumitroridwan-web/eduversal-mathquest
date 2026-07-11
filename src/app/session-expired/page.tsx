import type { Metadata } from "next";
import { StatusScreen } from "@/components/layout/StatusScreen";

export const metadata: Metadata = { title: "Session Expired" };

export default function SessionExpiredPage() {
  return (
    <StatusScreen
      icon="Clock"
      tone="amber"
      code="Session timed out"
      title="Your session has expired"
      description="For your security you've been signed out after a period of inactivity. Please log in again to continue your MathQuest."
      primary={{ label: "Log in again", href: "/login" }}
      secondary={{ label: "Return home", href: "/" }}
    />
  );
}
