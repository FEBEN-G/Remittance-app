"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Copy,
  Share2,
  Gift,
  Users,
  DollarSign,
  CheckCircle,
  Clock,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/lib/store";
import { useLocale } from "@/hooks/use-locale";
import { mockReferrals, mockReferralStats } from "@/lib/mock-data";
import type { Referral, ReferralStats } from "@/types";
import { toast } from "sonner";

export default function ReferralsPage() {
  const { user } = useAuth();
  const { t } = useLocale();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setReferrals(mockReferrals);
      setStats(mockReferralStats);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const copyReferralCode = async () => {
    if (user?.referralCode) {
      await navigator.clipboard.writeText(user.referralCode);
      toast.success(t("referral.codeCopied"));
    }
  };

  const shareReferralLink = async () => {
    const referralLink = `https://remitpay.com/register?ref=${user?.referralCode}`;
    if (navigator.share) {
      await navigator.share({
        title: "Join White Label Pay",
        text: `Use my referral code ${user?.referralCode} to sign up and get $5 bonus on your first transfer!`,
        url: referralLink,
      });
    } else {
      await navigator.clipboard.writeText(referralLink);
      toast.success(t("referral.linkCopied"));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "rewarded":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "active":
        return <Users className="h-4 w-4 text-primary" />;
      default:
        return <Clock className="h-4 w-4 text-warning-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "rewarded":
        return "bg-success/10 text-success";
      case "active":
        return "bg-primary/10 text-primary";
      default:
        return "bg-warning/10 text-warning-foreground";
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Link href="/home">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-foreground">{t("referral.title")}</h1>
      </div>

      {/* Referral Code Card */}
      <Card className="mb-6 overflow-hidden bg-gradient-to-br from-primary to-secondary text-primary-foreground">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
              <Gift className="h-8 w-8" />
            </div>
          </div>
          <h2 className="mb-2 text-center text-lg font-semibold">
            {t("referral.inviteFriends")}
          </h2>
          <p className="mb-6 text-center text-sm opacity-90">
            {t("referral.earnDescription")}
          </p>
          <div className="mb-4 rounded-lg bg-white/20 p-4">
            <p className="mb-1 text-center text-xs opacity-80">{t("referral.yourCode")}</p>
            <p className="text-center text-2xl font-bold tracking-wider">
              {user?.referralCode}
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1 gap-2 bg-white/20 text-white hover:bg-white/30"
              onClick={copyReferralCode}
            >
              <Copy className="h-4 w-4" />
              {t("referral.copy")}
            </Button>
            <Button
              variant="secondary"
              className="flex-1 gap-2 bg-white/20 text-white hover:bg-white/30"
              onClick={shareReferralLink}
            >
              <Share2 className="h-4 w-4" />
              {t("referral.share")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      {stats && (
        <div className="mb-6 grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="mx-auto mb-2 h-6 w-6 text-primary" />
              <p className="text-2xl font-bold text-foreground">{stats.totalReferrals}</p>
              <p className="text-xs text-muted-foreground">{t("referral.totalInvites")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle className="mx-auto mb-2 h-6 w-6 text-success" />
              <p className="text-2xl font-bold text-foreground">{stats.activeReferrals}</p>
              <p className="text-xs text-muted-foreground">{t("referral.active")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <DollarSign className="mx-auto mb-2 h-6 w-6 text-warning-foreground" />
              <p className="text-2xl font-bold text-foreground">${stats.totalEarnings}</p>
              <p className="text-xs text-muted-foreground">{t("referral.earned")}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* How It Works */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{t("referral.howItWorks")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              1
            </div>
            <div>
              <p className="font-medium text-foreground">{t("referral.step1Title")}</p>
              <p className="text-sm text-muted-foreground">{t("referral.step1Description")}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              2
            </div>
            <div>
              <p className="font-medium text-foreground">{t("referral.step2Title")}</p>
              <p className="text-sm text-muted-foreground">{t("referral.step2Description")}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              3
            </div>
            <div>
              <p className="font-medium text-foreground">{t("referral.step3Title")}</p>
              <p className="text-sm text-muted-foreground">{t("referral.step3Description")}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referral List */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{t("referral.yourReferrals")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {referrals.length > 0 ? (
            referrals.map((referral) => (
              <div
                key={referral.id}
                className="flex items-center justify-between rounded-lg border border-border p-4"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {referral.referredUserName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{referral.referredUserName}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(referral.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs ${getStatusColor(
                      referral.status
                    )}`}
                  >
                    {getStatusIcon(referral.status)}
                    {referral.status === "rewarded"
                      ? `+$${referral.rewardAmount}`
                      : referral.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <Users className="h-12 w-12 text-muted-foreground/50" />
              <div>
                <p className="font-medium text-foreground">{t("referral.noReferrals")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("referral.startInviting")}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
