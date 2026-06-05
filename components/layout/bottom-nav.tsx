"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Home, Settings } from "lucide-react";
import { he } from "@/lib/i18n/he";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: he.nav.today, icon: Home },
  { href: "/history", label: he.nav.history, icon: CalendarDays },
  { href: "/settings", label: he.nav.settings, icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-lg">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2.5 text-xs transition-colors",
                active
                  ? "text-rose-600"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", active && "stroke-[2.5]")} />
              <span className="font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
