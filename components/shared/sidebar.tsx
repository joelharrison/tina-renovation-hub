"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ClipboardList,
  Package,
  Heart,
  Users,
  DollarSign,
  FileText,
  BarChart3,
  Calendar,
  X,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRole } from "@/lib/role-context";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/action-items", label: "Action Items", icon: ClipboardList },
  { href: "/materials", label: "Materials", icon: Package },
  { href: "/donations", label: "Donations", icon: Heart },
  { href: "/volunteers", label: "Volunteers", icon: Users },
  { href: "/budget", label: "Budget", icon: DollarSign },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/timeline", label: "Timeline", icon: Calendar },
  { href: "/whatsapp", label: "WhatsApp Live", icon: MessageCircle },
  { href: "/reports", label: "Reports", icon: BarChart3 },
];

export function Sidebar({ isOpen = true, onClose, isMobile = false }: { isOpen?: boolean; onClose?: () => void; isMobile?: boolean }) {
  const pathname = usePathname();
  const { role } = useRole();

  const roleLabel = {
    core_team: "Core Team",
    volunteer: "Volunteer",
    donor: "Donor",
  }[role];

  const navContent = (
    <div className="flex h-full flex-col">
      {/* Logo / Header */}
      <div className="flex h-16 items-center justify-between border-b border-[var(--border)] px-4">
        <Link href="/" className="flex items-center gap-2" onClick={onClose}>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--primary)] text-white">
            <Home className="h-4 w-4" />
          </div>
          <div>
            <div className="font-semibold tracking-tight text-lg">The Hub</div>
            <div className="text-[10px] text-[var(--text-muted)] -mt-1">Hands On • Cayman</div>
          </div>
        </Link>
        {isMobile && onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Role indicator */}
      <div className="px-4 py-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--text-muted)]">Signed in as</span>
          <Badge variant="outline" className={cn(
            "text-xs",
            role === "core_team" && "role-core",
            role === "volunteer" && "role-volunteer",
            role === "donor" && "role-donor"
          )}>
            {roleLabel}
          </Badge>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all",
                active
                  ? "bg-[var(--primary)] text-white shadow-sm"
                  : "text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer info */}
      <div className="p-4 border-t border-[var(--border)] text-[10px] text-[var(--text-muted)]">
        <div>Demo • Local + Supabase</div>
        <div>Demolition target: July 27, 2025</div>
        <div className="mt-1 text-[var(--primary)]">P0 Safety first</div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-[var(--surface)] border-r border-[var(--border)] transform transition-transform duration-200 ease-out lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {navContent}
      </div>
    );
  }

  // Desktop fixed sidebar
  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-64 lg:flex lg:flex-col bg-[var(--surface)] border-r border-[var(--border)]">
      {navContent}
    </div>
  );
}
