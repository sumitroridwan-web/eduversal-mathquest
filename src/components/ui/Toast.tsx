"use client";

import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { useToasts } from "@/stores/ui";
import { cn } from "@/lib/utils";

const config = {
  success: { icon: CheckCircle2, ring: "ring-emerald-200", text: "text-emerald-600" },
  error: { icon: XCircle, ring: "ring-red-200", text: "text-red-600" },
  info: { icon: Info, ring: "ring-navy-200", text: "text-navy-600" },
};

export function ToastViewport() {
  const { toasts, dismiss } = useToasts();
  if (toasts.length === 0) return null;
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-full max-w-sm flex-col gap-2 px-4 sm:px-0">
      {toasts.map((t) => {
        const { icon: I, ring, text } = config[t.variant];
        return (
          <div
            key={t.id}
            role="status"
            className={cn(
              "pointer-events-auto flex animate-fade-in items-start gap-3 rounded-xl bg-white p-4 shadow-card-hover ring-1",
              ring,
            )}
          >
            <I className={cn("mt-0.5 h-5 w-5 shrink-0", text)} />
            <div className="flex-1">
              <p className="text-sm font-semibold text-navy-900">{t.title}</p>
              {t.description && <p className="mt-0.5 text-sm text-navy-500">{t.description}</p>}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="rounded p-0.5 text-navy-400 hover:text-navy-700"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
