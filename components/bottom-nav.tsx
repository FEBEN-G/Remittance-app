"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Send, History, User, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/transactions", label: "History", icon: History },
  { href: "/send", label: "Send", icon: Plus, isMain: true },
  { href: "/wallet", label: "Wallet", icon: Send },
  { href: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  // Hide bottom nav on landing page and auth pages
  const hiddenPaths = ["/", "/login", "/register"];
  if (hiddenPaths.includes(pathname)) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden safe-area-inset-bottom">
      <div className="mx-2 mb-2 rounded-2xl border border-border/50 bg-card/95 shadow-lg backdrop-blur-xl">
        <div className="flex items-center justify-around px-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            if (item.isMain) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center py-2"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/25 transition-transform active:scale-95">
                    <Icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                </Link>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-1 flex-col items-center gap-0.5 py-3 transition-all",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-xl transition-colors",
                    isActive && "bg-primary/10",
                  )}
                >
                  <Icon className={cn("h-5 w-5", isActive && "stroke-[2.5]")} />
                </div>
                <span
                  className={cn(
                    "text-[10px] font-medium",
                    isActive && "font-semibold",
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
