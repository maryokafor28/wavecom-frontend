"use client";

import { useTheme } from "next-themes";
import { Menu, Moon, Sun, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/layout/sidebar-context";

export function Navbar() {
  const { openMobile } = useSidebar();
  const { theme, setTheme } = useTheme();

  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-4">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={openMobile}
          className="md:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="relative flex flex-col leading-none">
          <span className="font-logo text-2xl text-foreground">
            <span className="text-primary">W</span>aveCom
          </span>

          <span className="mt-1 text-[9px] font-medium tracking-[0.12em] text-muted-foreground">
            Notification Platform
          </span>
          <span className="absolute -bottom-1 left-0 h-px w-7 -rotate-3 bg-primary/70" />
        </div>{" "}
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="hidden gap-2 text-muted-foreground sm:flex"
          aria-label="Open command palette"
        >
          <Search className="h-4 w-4" />
          <span className="text-xs">Search</span>
          <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
            ⌘K
          </kbd>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          <Sun className="h-4 w-4 dark:hidden" />
          <Moon className="hidden h-4 w-4 dark:block" />
        </Button>
      </div>
    </header>
  );
}
