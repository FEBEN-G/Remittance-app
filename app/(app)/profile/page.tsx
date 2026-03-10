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
  Settings,
} from "lucide-react";
import {
  Button as AntButton,
  Card as AntCard,
  Avatar as AntAvatar,
  Switch,
  Typography,
  Space,
  Modal,
  Input as AntInput,
  Divider,
} from "antd";
import { StatusBadge } from "@/components/status-badge";
import { useAuth } from "@/lib/store";
import { useLocale } from "@/hooks/use-locale";
import { toast } from "sonner";

const { Text, Title } = Typography;

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
      id: "settings",
      label: "Settings",
      icon: Settings,
      href: "/profile/settings",
      badge: user?.kycStatus,
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
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Link href="/home">
          <AntButton
            type="text"
            icon={<ArrowLeft className="h-5 w-5" />}
            className="flex items-center justify-center"
          />
        </Link>
        <h1 className="text-xl font-bold text-foreground">
          {t("profile.title")}
        </h1>
      </div>

      {/* Profile Card */}
      <AntCard className="mb-6 overflow-hidden">
        <div className="flex items-center gap-4 p-2">
          <div className="relative">
            <AntAvatar
              size={80}
              src={user?.avatarUrl}
              className="border-2 border-primary"
            >
              {user && getInitials(user.firstName, user.lastName)}
            </AntAvatar>
            <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-foreground">
                {user?.firstName} {user?.lastName}
              </h2>
              {user?.kycStatus && (
                <StatusBadge
                  status={
                    user.kycStatus === "approved"
                      ? "completed"
                      : user.kycStatus === "pending"
                        ? "pending"
                        : user.kycStatus === "rejected"
                          ? "failed"
                          : "pending"
                  }
                  size="sm"
                />
              )}
            </div>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <p className="text-sm text-muted-foreground">{user?.phoneNumber}</p>
            {user?.referralCode && (
              <p className="mt-1 text-xs text-primary font-medium">
                {t("profile.referralCode")}: {user.referralCode}
              </p>
            )}
          </div>
        </div>
      </AntCard>

      {/* Account Settings */}
      <AntCard
        className="mb-6"
        title={
          <span className="text-base font-bold">
            {t("profile.accountSettings")}
          </span>
        }
        bodyStyle={{ padding: 0 }}
      >
        <div className="divide-y divide-border/40">
          {accountItems.map((item) => (
            <Link key={item.id} href={item.href}>
              <div className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted/60">
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span className="text-foreground font-medium">
                    {item.label}
                  </span>
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
                  <ChevronRight className="h-5 w-5 text-muted-foreground/40" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </AntCard>

      {/* Features */}
      <AntCard
        className="mb-6"
        title={
          <span className="text-base font-bold">{t("profile.features")}</span>
        }
        bodyStyle={{ padding: 0 }}
      >
        <div className="divide-y divide-border/40">
          {featureItems.map((item) => (
            <Link key={item.id} href={item.href}>
              <div className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="text-foreground font-medium">
                      {item.label}
                    </span>
                    {item.description && (
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground/40" />
              </div>
            </Link>
          ))}
        </div>
      </AntCard>

      {/* Preferences */}
      <AntCard
        className="mb-6"
        title={
          <span className="text-base font-bold">
            {t("profile.preferences")}
          </span>
        }
        bodyStyle={{ padding: 0 }}
      >
        <div className="divide-y divide-border/40">
          {/* Language */}
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted/60">
                <Globe className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="text-foreground font-medium">
                {t("profile.language")}
              </span>
            </div>
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value as "en" | "am")}
              className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            >
              <option value="en">English</option>
              <option value="am">Amharic</option>
            </select>
          </div>

          {/* Dark Mode */}
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted/60">
                {isDarkMode ? (
                  <Moon className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Sun className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <span className="text-foreground font-medium">
                {t("profile.darkMode")}
              </span>
            </div>
            <Switch checked={isDarkMode} onChange={toggleDarkMode} />
          </div>
        </div>
      </AntCard>

      {/* Support */}
      <AntCard
        className="mb-6"
        title={
          <span className="text-base font-bold">{t("profile.support")}</span>
        }
        bodyStyle={{ padding: 0 }}
      >
        <div className="divide-y divide-border/40">
          {supportItems.map((item) => (
            <Link key={item.id} href={item.href}>
              <div className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted/60">
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span className="text-foreground font-medium">
                    {item.label}
                  </span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground/40" />
              </div>
            </Link>
          ))}
        </div>
      </AntCard>

      {/* Logout */}
      <AntButton
        block
        size="large"
        variant="outlined"
        danger
        className="mb-4 flex items-center justify-center gap-2 h-12 rounded-xl font-bold border-2"
        onClick={() => setShowLogout(true)}
      >
        <LogOut className="h-5 w-5" />
        {t("profile.logout")}
      </AntButton>

      {/* Delete Account */}
      <AntButton
        block
        type="text"
        danger
        className="flex items-center justify-center gap-2 h-12 rounded-xl font-medium"
        onClick={() => setShowDeleteAccount(true)}
      >
        <Trash2 className="h-5 w-5" />
        {t("profile.deleteAccount")}
      </AntButton>

      {/* App Version */}
      <Divider />
      <p className="text-center text-xs text-muted-foreground pb-8">
        RemitPay v1.0.0
      </p>

      {/* Logout Confirmation */}
      <Modal
        title={t("profile.logoutTitle")}
        open={showLogout}
        onOk={handleLogout}
        onCancel={() => setShowLogout(false)}
        okText={t("profile.logout")}
        cancelText={t("common.cancel")}
        okButtonProps={{
          danger: true,
          size: "large",
          className: "h-10 rounded-lg px-6",
        }}
        cancelButtonProps={{ size: "large", className: "h-10 rounded-lg px-6" }}
      >
        <p className="py-4 text-muted-foreground">
          {t("profile.logoutDescription")}
        </p>
      </Modal>

      {/* Delete Account Confirmation */}
      <Modal
        title={
          <span className="text-destructive font-bold">
            {t("profile.deleteAccountTitle")}
          </span>
        }
        open={showDeleteAccount}
        onOk={handleDeleteAccount}
        onCancel={() => {
          setShowDeleteAccount(false);
          setDeleteConfirmation("");
        }}
        okText={t("profile.deleteAccount")}
        cancelText={t("common.cancel")}
        okButtonProps={{
          danger: true,
          disabled: deleteConfirmation !== "DELETE",
          size: "large",
          className: "h-10 rounded-lg px-6",
        }}
        cancelButtonProps={{ size: "large", className: "h-10 rounded-lg px-6" }}
      >
        <div className="py-4 space-y-4">
          <p className="text-muted-foreground font-medium">
            {t("profile.deleteAccountDescription")}
          </p>
          <div className="space-y-2">
            <span className="text-sm font-medium">
              {t("profile.typeToConfirm")}
            </span>
            <AntInput
              placeholder="DELETE"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              className="h-12 rounded-xl border-destructive/20 focus:border-destructive"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
