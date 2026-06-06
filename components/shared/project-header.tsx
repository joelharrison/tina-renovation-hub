"use client";

import React, { useState } from "react";
import { Menu, Bell } from "lucide-react";
import { useRole } from "@/lib/role-context";
import { useHubData } from "@/lib/data-store";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "./sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function ProjectHeader() {
  const { role, setRole } = useRole();
  const { notifications, addNotification, notify } = useHubData();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const roleLabel = {
    core_team: "Core Team",
    volunteer: "Volunteer",
    donor: "Donor",
  }[role];

  // Restore dark mode preference
  React.useEffect(() => {
    const saved = localStorage.getItem("the-hub-theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const unreadCount = notifications.length; // simple for demo

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur lg:pl-64">
        <div className="flex h-14 items-center justify-between px-4">
          {/* Mobile: Hamburger + Logo */}
          <div className="flex items-center gap-3 lg:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72 bg-[var(--surface)]">
                <Sidebar isMobile onClose={() => setMobileOpen(false)} />
              </SheetContent>
            </Sheet>

            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--primary)] text-white">
                <span className="text-xs font-bold">H</span>
              </div>
              <span className="font-semibold tracking-tight">The Hub</span>
            </div>
          </div>

          {/* Desktop: Spacer for sidebar */}
          <div className="hidden lg:block" />

          {/* Right side controls */}
          <div className="flex items-center gap-3">
            {/* Global Search */}
            <div className="relative hidden md:block w-64">
              <input 
                type="text" 
                placeholder="Search actions, materials, volunteers..." 
                className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-lg px-3 py-1.5 text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)]"
                onChange={(e) => {
                  const q = e.target.value.toLowerCase().trim();
                  if (q.length > 2) {
                    // Simple global search - in real would use a command menu
                    console.log('Global search:', q);
                    // For demo, navigate or toast
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const q = (e.target as HTMLInputElement).value;
                    if (q) {
                      window.location.href = `/reports?search=${encodeURIComponent(q)}`; // or better routing
                    }
                  }
                }}
              />
            </div>

            {/* Notifications Bell */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs relative"
                onClick={() => setNotifOpen(!notifOpen)}
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] rounded-full px-1 min-w-[14px] text-center">{unreadCount}</span>
                )}
              </Button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-lg z-50 p-2 text-sm max-h-80 overflow-auto">
                  <div className="flex justify-between items-center px-2 py-1">
                    <div className="font-medium text-xs">Notifications</div>
                    <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={() => { setNotifOpen(false); }}>Close</Button>
                  </div>
                  {notifications.length === 0 && (
                    <div className="p-3 text-xs text-[var(--text-muted)]">No recent notifications. Actions like adding items or exporting will create them.</div>
                  )}
                  {notifications.slice(0, 8).map((n: any, i: number) => (
                    <div key={i} className="px-2 py-1.5 text-xs border-b border-[var(--border)] last:border-none">
                      <div className="font-medium">{n.message}</div>
                      <div className="text-[10px] text-[var(--text-muted)]">{new Date(n.time).toLocaleTimeString()}</div>
                    </div>
                  ))}
                  <div className="pt-2 px-2 flex gap-2">
                    <Button size="sm" variant="outline" className="text-xs flex-1" onClick={() => {
                      notify("Team email notification sent (demo mode - would use Resend/Supabase in prod)", "email");
                      setNotifOpen(false);
                    }}>Mock Email Team</Button>
                    <Button size="sm" variant="ghost" className="text-xs" onClick={() => { /* clear would go here */ setNotifOpen(false); }}>Clear</Button>
                  </div>
                </div>
              )}
            </div>

            {/* Role switcher */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-[var(--text-muted)] text-xs hidden sm:inline">Role</span>
              <Select value={role} onValueChange={(v) => setRole(v as any)}>
                <SelectTrigger className="h-8 w-[128px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="core_team">Core Team</SelectItem>
                  <SelectItem value="volunteer">Volunteer</SelectItem>
                  <SelectItem value="donor">Donor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Badge className={cn(
              "hidden md:inline-flex text-xs",
              role === "core_team" && "role-core",
              role === "volunteer" && "role-volunteer",
              role === "donor" && "role-donor"
            )}>
              {roleLabel}
            </Badge>

            {/* Dark mode toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs"
              onClick={() => {
                const html = document.documentElement;
                const isDark = html.classList.toggle("dark");
                localStorage.setItem("the-hub-theme", isDark ? "dark" : "light");
              }}
              aria-label="Toggle dark mode"
            >
              🌙
            </Button>
          </div>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile overlay when sidebar open via sheet (handled by Sheet) */}
    </>
  );
}
