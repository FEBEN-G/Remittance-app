"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  X,
  Globe,
  LogOut,
  User,
  Settings,
  Home,
  Send,
  History,
  Shield,
  TrendingUp,
  ArrowLeft,
} from "lucide-react";
import { useState } from "react";
import {
  Button as AntButton,
  Dropdown,
  Avatar as AntAvatar,
  Badge as AntBadge,
  Drawer,
  Space,
  Menu as AntMenu,
} from "antd";
import type { MenuProps } from "antd";
import { cn } from "@/lib/utils";
import { useAuth, useNotifications } from "@/lib/store";
import { useLocale } from "@/hooks/use-locale";

const navLinks = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/send", label: "Send Money", icon: Send },
  { href: "/transactions", label: "Transactions", icon: History },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const { locale, setLocale, t } = useLocale();

  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : "U";

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const userMenuItems: MenuProps["items"] = [
    {
      key: "user-info",
      label: (
        <div className="flex flex-col px-1 py-1">
          <span className="font-bold text-foreground">
            {user?.firstName} {user?.lastName}
          </span>
          <span className="text-xs font-normal text-muted-foreground">
            {user?.email}
          </span>
        </div>
      ),
      disabled: true,
    },
    { type: "divider" },
    {
      key: "profile",
      icon: <User className="h-4 w-4" />,
      label: <Link href="/profile">{t("nav.profile")}</Link>,
    },
    {
      key: "settings",
      icon: <Settings className="h-4 w-4" />,
      label: <Link href="/profile/settings">{t("nav.settings")}</Link>,
    },
    { type: "divider" },
    {
      key: "logout",
      icon: <LogOut className="h-4 w-4 text-destructive" />,
      label: (
        <span className="text-destructive font-medium">{t("nav.logout")}</span>
      ),
      onClick: handleLogout,
    },
  ];

  const languageItems: MenuProps["items"] = [
    {
      key: "lang-title",
      label: <span className="font-bold">{t("common.language")}</span>,
      disabled: true,
    },
    { type: "divider" },
    {
      key: "en",
      label: "English",
      onClick: () => setLocale("en"),
      className: locale === "en" ? "bg-muted" : "",
    },
    {
      key: "am",
      label: "Amharic",
      onClick: () => setLocale("am"),
      className: locale === "am" ? "bg-muted" : "",
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo and Back */}
        <div className="flex items-center gap-4">
          <Link href="/home" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/20">
              <span className="text-lg font-bold text-primary-foreground">
                W
              </span>
            </div>
            <div className="hidden flex-col sm:flex">
              <span className="text-lg font-bold leading-tight text-foreground">
                White Label Pay
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Send Money Globally
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <AntButton
                type="text"
                className={cn(
                  "gap-2 h-10 px-4 rounded-xl flex items-center font-medium",
                  pathname === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </AntButton>
            </Link>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <Link href="/notifications">
            <AntButton
              type="text"
              icon={
                <AntBadge
                  count={unreadCount > 9 ? "9+" : unreadCount}
                  size="small"
                  offset={[2, 0]}
                  className="notification-badge"
                >
                  <Bell className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                </AntBadge>
              }
              className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-muted"
            />
          </Link>

          {/* Language Selector */}
          <Dropdown
            menu={{ items: languageItems }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <AntButton
              type="text"
              icon={
                <Globe className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              }
              className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-muted"
            />
          </Dropdown>

          {/* User Menu - Desktop */}
          <div className="hidden md:block">
            <Dropdown
              menu={{ items: userMenuItems }}
              trigger={["click"]}
              placement="bottomRight"
              arrow
            >
              <AntButton
                type="text"
                className="h-10 px-2 rounded-xl hover:bg-muted"
              >
                <Space>
                  <AntAvatar
                    size="small"
                    className="bg-primary text-[10px] font-bold text-primary-foreground"
                  >
                    {initials}
                  </AntAvatar>
                  <span className="text-sm font-semibold truncate max-w-[100px]">
                    {user?.firstName}
                  </span>
                </Space>
              </AntButton>
            </Dropdown>
          </div>
        </div>
      </div>
    </header>
  );
}
