import Link from "next/link";
import { WifiOff } from "lucide-react";

export const metadata = { title: "Offline" };

export default function OfflinePage() {
  return (
    <main id="main" className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface-soft p-8 text-center">
      <WifiOff className="h-12 w-12 text-navy-400" />
      <h1 className="font-display text-2xl font-bold text-navy-900">You&apos;re offline</h1>
      <p className="max-w-sm text-navy-500">No internet right now. Pages and activities you&apos;ve already opened still work — head back and keep exploring.</p>
      <Link href="/" className="rounded-xl bg-navy-900 px-4 py-2 font-semibold text-white">Back to home</Link>
    </main>
  );
}
