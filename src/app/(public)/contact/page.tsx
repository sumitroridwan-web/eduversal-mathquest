"use client";

import { useState } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { MarketingHero } from "@/components/layout/MarketingHero";
import { Button } from "@/components/ui/Button";
import { LabelledField, Input, Textarea, Select } from "@/components/ui/Field";
import { useToasts } from "@/stores/ui";
import { brand } from "@/config/brand";

export default function ContactPage() {
  const notify = useToasts((s) => s.notify);
  const [sent, setSent] = useState(false);

  return (
    <>
      <MarketingHero
        eyebrow="Contact"
        title="Talk to the Eduversal team"
        subtitle="Questions about the platform, school access or curriculum alignment? We'd love to help."
      />
      <section className="container-page grid gap-10 py-16 lg:grid-cols-3">
        <div className="space-y-4">
          {[
            { icon: Mail, label: "Email", value: brand.email },
            { icon: Phone, label: "Phone", value: "+62 21 0000 0000" },
            { icon: MapPin, label: "Office", value: "Eduversal Indonesia, Jakarta" },
          ].map((c) => (
            <div key={c.label} className="flex items-center gap-4 rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                <c.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-navy-400">{c.label}</p>
                <p className="font-semibold text-navy-900">{c.value}</p>
              </div>
            </div>
          ))}
        </div>

        <form
          className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card lg:col-span-2"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
            notify({ variant: "success", title: "Message sent", description: "We'll be in touch within two working days." });
          }}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <LabelledField label="Full name" htmlFor="c-name" required>
              <Input id="c-name" required placeholder="Jane Doe" />
            </LabelledField>
            <LabelledField label="Email" htmlFor="c-email" required>
              <Input id="c-email" type="email" required placeholder="jane@school.edu" />
            </LabelledField>
            <LabelledField label="Organisation" htmlFor="c-org">
              <Input id="c-org" placeholder="School or company" />
            </LabelledField>
            <LabelledField label="I am a…" htmlFor="c-role">
              <Select id="c-role" defaultValue="School leader">
                {["School leader", "Teacher", "Parent", "Other"].map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </Select>
            </LabelledField>
          </div>
          <LabelledField label="Message" htmlFor="c-msg" required className="mt-5">
            <Textarea id="c-msg" required placeholder="How can we help?" className="min-h-[120px]" />
          </LabelledField>
          <div className="mt-5 flex items-center gap-3">
            <Button type="submit">
              <Send className="h-4 w-4" /> Send message
            </Button>
            {sent && <p className="text-sm font-medium text-teal-700">Thanks — your message has been received.</p>}
          </div>
        </form>
      </section>
    </>
  );
}
