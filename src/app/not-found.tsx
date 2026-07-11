import type { Metadata } from "next";
import { StatusScreen } from "@/components/layout/StatusScreen";

export const metadata: Metadata = { title: "Page Not Found" };

export default function NotFound() {
  return (
    <StatusScreen
      icon="Compass"
      tone="navy"
      code="404"
      title="This quest doesn't exist"
      description="The page you're looking for may have moved or never existed. Let's get you back on track."
      primary={{ label: "Return home", href: "/" }}
      secondary={{ label: "Explore the library", href: "/explore" }}
    />
  );
}
