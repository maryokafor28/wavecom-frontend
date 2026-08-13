"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Activity,
  ListOrdered,
  BarChart3,
  ScrollText,
  Settings,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { clearStoredRecipientId } from "@/lib/recipient-storage";
import { useSidebar } from "@/components/layout/sidebar-context";

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/", icon: LayoutDashboard },
      { label: "Recipients", href: "/recipients", icon: Users },
    ],
  },
  {
    label: "Monitoring",
    items: [
      { label: "Notification Feed", href: "/feed", icon: Activity },
      { label: "Queue Monitor", href: "/queue", icon: ListOrdered },
      { label: "Analytics", href: "/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Event Log", href: "/events", icon: ScrollText },
      { label: "Configuration", href: "/configuration", icon: Settings },
    ],
  },
];

function getInitial(email: string | null) {
  if (!email) return "?";
  return email.trim().charAt(0).toUpperCase();
}

export function Sidebar({ recipientEmail }: { recipientEmail: string | null }) {
  const [collapsed, setCollapsed] = useState(false);
  const { mobileOpen, closeMobile } = useSidebar();
  const pathname = usePathname();

  function handleReset() {
    clearStoredRecipientId();
    window.location.reload();
  }

  function handleNavigation() {
    closeMobile();
  }

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <button
          aria-label="Close navigation"
          onClick={closeMobile}
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-200",
          "md:static md:z-auto",
          collapsed ? "md:w-16" : "md:w-60",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          "w-60",
        )}
      >
        {/* Avatar / recipient */}
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sidebar-accent text-sm font-medium text-sidebar-accent-foreground">
              {getInitial(recipientEmail)}
            </div>

            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-sidebar-foreground">
                  {recipientEmail ?? "Guest"}
                </p>
              </div>
            )}
          </div>

          {/* Mobile close button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={closeMobile}
            className="md:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="border-t border-sidebar-border" />

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3">
          {NAV_GROUPS.map((group, i) => (
            <div key={group.label}>
              {i > 0 && <div className="my-2 border-t border-sidebar-border" />}

              <div className="px-3">
                {!collapsed && (
                  <p className="px-2 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {group.label}
                  </p>
                )}

                <ul className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                      <li key={item.href}>
                        <Button
                          asChild
                          variant="ghost"
                          onClick={handleNavigation}
                          className={cn(
                            "h-auto w-full justify-start gap-3 px-2 py-2 text-sm font-normal",
                            isActive &&
                              "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground",
                          )}
                        >
                          <Link
                            href={item.href}
                            title={collapsed ? item.label : undefined}
                          >
                            <Icon className="h-4 w-4 shrink-0" />

                            {!collapsed && <span>{item.label}</span>}
                          </Link>
                        </Button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-sidebar-border" />

        {/* Footer */}
        <div className="flex flex-col gap-1 p-3">
          <Button
            variant="ghost"
            onClick={handleReset}
            title={collapsed ? "Not you? Reset" : undefined}
            className="h-auto w-full justify-start gap-3 px-2 py-2 text-sm font-normal text-muted-foreground"
          >
            <RotateCcw className="h-4 w-4 shrink-0" />

            {!collapsed && <span>Not you? Reset</span>}
          </Button>

          {/* Desktop collapse button */}
          <Button
            variant="ghost"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden h-auto w-full justify-start gap-3 px-2 py-2 text-sm font-normal text-muted-foreground md:flex"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4 shrink-0" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 shrink-0" />
                <span>Collapse</span>
              </>
            )}
          </Button>
        </div>
      </aside>
    </>
  );
}
