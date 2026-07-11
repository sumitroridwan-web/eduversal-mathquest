"use client";

import { PageHeading } from "@/components/ui/PageHeading";
import { Button } from "@/components/ui/Button";
import { LabelledField, Input, Checkbox, Select } from "@/components/ui/Field";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/stores/auth";
import { useToasts } from "@/stores/ui";
import { roleMeta } from "@/config/navigation";

export function SettingsPanel({ title = "Settings" }: { title?: string }) {
  const user = useAuth((s) => s.user);
  const notify = useToasts((s) => s.notify);
  if (!user) return null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeading title={title} description="Manage your profile, notifications and preferences." />

      <section className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
        <div className="mb-5 flex items-center gap-4">
          <Avatar name={user.name} emoji={user.avatar} size="lg" />
          <div>
            <p className="font-display text-lg font-semibold text-navy-900">{user.name}</p>
            <p className="text-sm text-navy-500">{roleMeta[user.role].label}{user.schoolName ? ` · ${user.schoolName}` : ""}</p>
          </div>
        </div>
        <form
          className="grid gap-4 sm:grid-cols-2"
          onSubmit={(e) => { e.preventDefault(); notify({ variant: "success", title: "Profile updated" }); }}
        >
          <LabelledField label="Full name" htmlFor="name"><Input id="name" defaultValue={user.name} /></LabelledField>
          <LabelledField label="Email" htmlFor="email"><Input id="email" type="email" defaultValue={user.email} /></LabelledField>
          <LabelledField label="Phone" htmlFor="phone"><Input id="phone" defaultValue={user.phone ?? ""} /></LabelledField>
          <LabelledField label="Language" htmlFor="lang"><Select id="lang" defaultValue="en-GB"><option value="en-GB">English (UK)</option><option value="id">Bahasa Indonesia</option></Select></LabelledField>
          <div className="sm:col-span-2"><Button type="submit">Save changes</Button></div>
        </form>
      </section>

      <section className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
        <h2 className="mb-4 font-display font-semibold text-navy-900">Notifications</h2>
        <div className="space-y-3">
          <Checkbox defaultChecked label="Email me about new assignments and feedback" />
          <Checkbox defaultChecked label="Weekly progress summary" />
          <Checkbox label="Platform announcements and product updates" />
        </div>
      </section>

      <section className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
        <h2 className="mb-2 font-display font-semibold text-navy-900">Security</h2>
        <p className="mb-4 text-sm text-navy-500">Keep your account secure with a strong password.</p>
        <Button variant="outline" asChildHref="/reset-password">Change password</Button>
      </section>
    </div>
  );
}
