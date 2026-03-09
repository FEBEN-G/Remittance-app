"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Shield,
  Bell,
  Globe,
  HelpCircle,
  FileText,
  LogOut,
  ChevronRight,
  Camera,
  Moon,
  Sun,
  CreditCard,
  Gift,
  Users,
  Heart,
  Wallet,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { StatusBadge } from "@/components/status-badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/store";
import { useLocale } from "@/hooks/use-locale";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { t, locale, setLocale } = useLocale();
  const [showLogout, setShowLogout] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmation === "DELETE") {
      toast.success(t("profile.accountDeleted"));
      logout();
      router.push("/");
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const accountItems = [
    {
      id: "personal",
      label: t("profile.personalInfo"),
      icon: User,
      href: "/profile/edit",
    },
    {
      id: "kyc",
      label: t("profile.verification"),
      icon: Shield,
      href: "/kyc",
      badge: user?.kycStatus,
    },
    {
      id: "wallet",
      label: t("profile.wallet"),
      icon: Wallet,
      href: "/wallet",
    },
    {
      id: "cards",
      label: t("profile.paymentMethods"),
      icon: CreditCard,
      href: "/wallet",
    },
    {
      id: "security",
      label: t("profile.security"),
      icon: Shield,
      href: "/profile/security",
    },
    {
      id: "notifications",
      label: t("profile.notifications"),
      icon: Bell,
      href: "/profile/notifications",
    },
  ];

  const featureItems = [
    {
      id: "referrals",
      label: t("profile.referrals"),
      icon: Users,
      href: "/referrals",
      description: t("profile.earnRewards"),
    },
    {
      id: "gifts",
      label: t("profile.giftPackages"),
      icon: Gift,
      href: "/gifts",
      description: t("profile.sendGifts"),
    },
    {
      id: "donate",
      label: t("profile.donations"),
      icon: Heart,
      href: "/donate",
      description: t("profile.supportCauses"),
    },
    {
      id: "rates",
      label: t("profile.exchangeRates"),
      icon: TrendingUp,
      href: "/rates",
      description: t("profile.viewRateHistory"),
    },
  ];

  const supportItems = [
    {
      id: "help",
      label: t("profile.helpCenter"),
      icon: HelpCircle,
      href: "/help",
    },
    {
      id: "terms",
      label: t("profile.terms"),
      icon: FileText,
      href: "/terms",
    },
    {
      id: "privacy",
      label: t("profile.privacy"),
      icon: FileText,
      href: "/privacy",
    },
  ];

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Link href="/home">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-foreground">{t("profile.title")}</h1>
      </div>

      {/* Profile Card */}
      <Card className="mb-6">
        <CardContent className="flex items-center gap-4 p-6">
          <div className="relative">
            <Avatar className="h-20 w-20 border-2 border-primary">
              <AvatarImage src={user?.avatarUrl} />
              <AvatarFallback className="bg-primary text-lg text-primary-foreground">
                {user && getInitials(user.firstName, user.lastName)}
              </AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <p className="text-sm text-muted-foreground">{user?.phoneNumber}</p>
            {user?.referralCode && (
              <p className="mt-1 text-xs text-primary">
                {t("profile.referralCode")}: {user.referralCode}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{t("profile.accountSettings")}</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border p-0">
          {accountItems.map((item) => (
            <Link key={item.id} href={item.href}>
              <div className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span className="text-foreground">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.badge && (
                    <StatusBadge
                      status={
                        item.badge === "approved"
                          ? "completed"
                          : item.badge === "pending"
                          ? "pending"
                          : item.badge === "rejected"
                          ? "failed"
                          : "pending"
                      }
                      size="sm"
                    />
                  )}
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>

      {/* Features */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{t("profile.features")}</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border p-0">
          {featureItems.map((item) => (
            <Link key={item.id} href={item.href}>
              <div className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="text-foreground">{item.label}</span>
                    {item.description && (
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    )}
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{t("profile.preferences")}</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border p-0">
          {/* Language */}
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                <Globe className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="text-foreground">{t("profile.language")}</span>
            </div>
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value as "en" | "am")}
              className="rounded-md border border-input bg-background px-3 py-1 text-sm"
            >
              <option value="en">English</option>
              <option value="am">Amharic</option>
            </select>
          </div>

          {/* Dark Mode */}
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                {isDarkMode ? (
                  <Moon className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Sun className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <span className="text-foreground">{t("profile.darkMode")}</span>
            </div>
            <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
          </div>
        </CardContent>
      </Card>

      {/* Support */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{t("profile.support")}</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border p-0">
          {supportItems.map((item) => (
            <Link key={item.id} href={item.href}>
              <div className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span className="text-foreground">{item.label}</span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>

      {/* Logout */}
      <Button
        variant="outline"
        className="mb-4 w-full gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground"
        onClick={() => setShowLogout(true)}
      >
        <LogOut className="h-4 w-4" />
        {t("profile.logout")}
      </Button>

      {/* Delete Account */}
      <Button
        variant="ghost"
        className="w-full gap-2 text-destructive hover:bg-destructive/10"
        onClick={() => setShowDeleteAccount(true)}
      >
        <Trash2 className="h-4 w-4" />
        {t("profile.deleteAccount")}
      </Button>

      {/* App Version */}
      <p className="mt-6 text-center text-xs text-muted-foreground">
        White Label Pay v1.0.0
      </p>

      {/* Logout Confirmation */}
      <AlertDialog open={showLogout} onOpenChange={setShowLogout}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("profile.logoutTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("profile.logoutDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>
              {t("profile.logout")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Account Confirmation */}
      <AlertDialog open={showDeleteAccount} onOpenChange={setShowDeleteAccount}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">
              {t("profile.deleteAccountTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("profile.deleteAccountDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4 space-y-2">
            <Label htmlFor="delete-confirm">{t("profile.typeToConfirm")}</Label>
            <Input
              id="delete-confirm"
              placeholder="DELETE"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteConfirmation("")}>
              {t("common.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={deleteConfirmation !== "DELETE"}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("profile.deleteAccount")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
