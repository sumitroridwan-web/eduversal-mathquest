"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Bell, LogOut, ChevronDown, Search, RefreshCw } from "lucide-react";
import type { Role } from "@/types";
import { useAuth } from "@/stores/auth";
import { roleNav, roleMeta } from "@/config/navigation";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { SearchField } from "@/components/ui/Field";
import { ConfirmDialog } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";

const roleAccent: Record<Role, string> = {
  admin: "bg-navy-900",
  "school-manager": "bg-teal-700",
  teacher: "bg-navy-900",
  student: "bg-accent-500",
  parent: "bg-teal-700",
};

export function DashboardShell({ role, children }: { role: Role; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loginAsRole } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [switchOpen, setSwitchOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const nav = roleNav[role];
  const meta = roleMeta[role];
  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

  const isActive = (href: string) =>
    pathname === href || (href !== meta.home && pathname.startsWith(href));

  const switchRole = (r: Role) => {
    loginAsRole(r);
    setSwitchOpen(false);
    setMenuOpen(false);
    router.push(roleMeta[r].home);
  };

  const NavList = () => (
    <nav className="flex-1 space-y-0.5 overflow-y-auto p-3" aria-label={`${meta.label} navigation`}>
      {nav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setMobileOpen(false)}
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
            isActive(item.href)
              ? "bg-navy-900 text-white shadow-sm"
              : "text-navy-600 hover:bg-navy-50 hover:text-navy-900",
          )}
          aria-current={isActive(item.href) ? "page" : undefined}
        >
          <Icon name={item.icon} className="h-[18px] w-[18px] shrink-0" />
          {item.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-surface-soft">
      {/* Sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-navy-100 bg-white lg:flex">
        <div className="flex h-16 items-center border-b border-navy-100 px-5">
          <Logo variant="compact" />
          <div className="ml-2.5">
            <p className="font-display text-sm font-bold text-navy-900">MathQuest</p>
            <p className="text-[11px] font-medium text-navy-400">{meta.label}</p>
          </div>
        </div>
        <NavList />
        <div className="border-t border-navy-100 p-3">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-navy-500 hover:bg-navy-50"
          >
            <Icon name="Globe" className="h-[18px] w-[18px]" /> Public site
          </Link>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-navy-950/40" onClick={() => setMobileOpen(false)} aria-hidden />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col bg-white shadow-xl">
            <div className="flex h-16 items-center justify-between border-b border-navy-100 px-5">
              <Logo variant="compact" />
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="p-1.5 text-navy-500">
                <X className="h-5 w-5" />
              </button>
            </div>
            <NavList />
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-navy-100 bg-white/85 px-4 backdrop-blur-md sm:px-6">
          <button
            className="rounded-lg p-2 text-navy-600 lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden max-w-sm flex-1 md:block">
            <SearchField placeholder="Search resources, students…" aria-label="Search" />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button className="relative rounded-lg p-2 text-navy-600 hover:bg-navy-50" aria-label="Notifications">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent-500 ring-2 ring-white" />
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-xl py-1 pl-1 pr-2 hover:bg-navy-50"
                aria-expanded={menuOpen}
                aria-haspopup="menu"
              >
                <Avatar name={user?.name ?? "User"} emoji={user?.avatar} size="sm" />
                <span className="hidden text-left sm:block">
                  <span className="block text-sm font-semibold leading-tight text-navy-900">{user?.firstName}</span>
                  <span className="block text-[11px] leading-tight text-navy-400">{meta.label}</span>
                </span>
                <ChevronDown className="h-4 w-4 text-navy-400" />
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} aria-hidden />
                  <div className="absolute right-0 z-20 mt-2 w-60 rounded-xl border border-navy-100 bg-white p-1.5 shadow-card-hover" role="menu">
                    <div className="border-b border-navy-50 px-3 py-2.5">
                      <p className="text-sm font-semibold text-navy-900">{user?.name}</p>
                      <p className="truncate text-xs text-navy-400">{user?.email}</p>
                    </div>
                    <Link href={`/${role}/${role === "school-manager" || role === "teacher" || role === "admin" ? "settings" : role === "student" ? "profile" : "settings"}`} onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-navy-700 hover:bg-navy-50" role="menuitem">
                      <Icon name="Settings" className="h-4 w-4" /> Settings
                    </Link>
                    {demoMode && (
                      <button onClick={() => setSwitchOpen((v) => !v)} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-navy-700 hover:bg-navy-50" role="menuitem">
                        <RefreshCw className="h-4 w-4" /> Switch demo role
                      </button>
                    )}
                    {demoMode && switchOpen && (
                      <div className="mb-1 ml-2 border-l border-navy-100 pl-2">
                        {(Object.keys(roleMeta) as Role[]).map((r) => (
                          <button
                            key={r}
                            onClick={() => switchRole(r)}
                            className={cn(
                              "flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs hover:bg-navy-50",
                              r === role ? "font-semibold text-teal-700" : "text-navy-600",
                            )}
                          >
                            <span className={cn("h-2 w-2 rounded-full", roleAccent[r])} />
                            {roleMeta[r].label}
                          </button>
                        ))}
                      </div>
                    )}
                    <button
                      onClick={() => { setMenuOpen(false); setConfirmLogout(true); }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                      role="menuitem"
                    >
                      <LogOut className="h-4 w-4" /> Log out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {demoMode && (
          <div className="flex items-center justify-center gap-2 bg-accent-50 px-4 py-1.5 text-center text-xs font-medium text-accent-800">
            <Badge tone="accent" className="bg-accent-100">Demo</Badge>
            You&apos;re exploring MathQuest in demo mode with sample data. Switch roles from the profile menu.
          </div>
        )}

        <main id="main" className="container-page py-6 lg:py-8">
          {children}
        </main>
      </div>

      <ConfirmDialog
        open={confirmLogout}
        onClose={() => setConfirmLogout(false)}
        onConfirm={() => { logout(); router.push("/login"); }}
        title="Log out of MathQuest?"
        description="You'll need to log in again to continue. Your demo progress is saved locally."
        confirmLabel="Log out"
        danger
      />
    </div>
  );
}
