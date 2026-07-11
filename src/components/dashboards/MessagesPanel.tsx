"use client";

import { useState } from "react";
import { PageHeading } from "@/components/ui/PageHeading";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Textarea } from "@/components/ui/Field";
import { useToasts } from "@/stores/ui";
import { cn } from "@/lib/utils";
import { Send } from "lucide-react";

interface Thread {
  id: string;
  name: string;
  role: string;
  avatar: string;
  preview: string;
  unread: boolean;
  messages: { from: "me" | "them"; text: string; time: string }[];
}

const seedThreads: Thread[] = [
  {
    id: "th-1", name: "Dewi Santoso", role: "Parent · Bimo", avatar: "🌷",
    preview: "Thank you for the update on Bimo's progress!", unread: true,
    messages: [
      { from: "them", text: "Hello, how is Bimo getting on with subtraction?", time: "09:12" },
      { from: "me", text: "He's doing really well — using the number line confidently now.", time: "09:20" },
      { from: "them", text: "Thank you for the update on Bimo's progress!", time: "09:22" },
    ],
  },
  {
    id: "th-2", name: "Rudi Prakoso", role: "School Manager", avatar: "🏫",
    preview: "Please share your Stage 2 coverage before Friday.", unread: false,
    messages: [
      { from: "them", text: "Please share your Stage 2 coverage before Friday.", time: "Yesterday" },
    ],
  },
  {
    id: "th-3", name: "Class 2A parents", role: "Group", avatar: "👨‍👩‍👧",
    preview: "Maths Week starts Monday — details attached.", unread: false,
    messages: [
      { from: "me", text: "Maths Week starts Monday — details attached.", time: "Mon" },
    ],
  },
];

export function MessagesPanel({ title = "Messages" }: { title?: string }) {
  const notify = useToasts((s) => s.notify);
  const [threads] = useState(seedThreads);
  const [activeId, setActiveId] = useState(seedThreads[0].id);
  const [draft, setDraft] = useState("");
  const active = threads.find((t) => t.id === activeId)!;

  return (
    <div className="space-y-6">
      <PageHeading title={title} description="Message parents, colleagues and school staff." />
      <div className="grid gap-4 overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card lg:grid-cols-[300px_1fr]">
        {/* Thread list */}
        <div className="border-b border-navy-100 lg:border-b-0 lg:border-r">
          {threads.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveId(t.id)}
              className={cn("flex w-full items-start gap-3 border-b border-navy-50 p-3 text-left transition-colors", t.id === activeId ? "bg-teal-50" : "hover:bg-surface-soft")}
            >
              <Avatar name={t.name} emoji={t.avatar} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="truncate text-sm font-semibold text-navy-900">{t.name}</p>
                  {t.unread && <span className="h-2 w-2 rounded-full bg-accent-500" />}
                </div>
                <p className="text-[11px] text-navy-400">{t.role}</p>
                <p className="mt-0.5 truncate text-xs text-navy-500">{t.preview}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Conversation */}
        <div className="flex min-h-[420px] flex-col">
          <div className="flex items-center gap-3 border-b border-navy-100 p-4">
            <Avatar name={active.name} emoji={active.avatar} />
            <div>
              <p className="text-sm font-semibold text-navy-900">{active.name}</p>
              <p className="text-xs text-navy-400">{active.role}</p>
            </div>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {active.messages.map((m, i) => (
              <div key={i} className={cn("flex", m.from === "me" ? "justify-end" : "justify-start")}>
                <div className={cn("max-w-[75%] rounded-2xl px-4 py-2 text-sm", m.from === "me" ? "bg-navy-900 text-white" : "bg-surface-muted text-navy-800")}>
                  {m.text}
                  <span className={cn("mt-1 block text-[10px]", m.from === "me" ? "text-white/50" : "text-navy-400")}>{m.time}</span>
                </div>
              </div>
            ))}
          </div>
          <form
            className="flex items-end gap-2 border-t border-navy-100 p-3"
            onSubmit={(e) => { e.preventDefault(); if (!draft.trim()) return; notify({ variant: "success", title: "Message sent" }); setDraft(""); }}
          >
            <Textarea value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Type a message…" className="min-h-[44px] flex-1" />
            <Button type="submit" size="icon" aria-label="Send"><Send className="h-4 w-4" /></Button>
          </form>
        </div>
      </div>
    </div>
  );
}
