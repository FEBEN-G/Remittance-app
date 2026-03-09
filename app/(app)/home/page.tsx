"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card as AntCard, Statistic } from "antd";
import {
  ArrowUpRight,
  Plus,
  History,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  Gift,
  Heart,
  Users,
  Wallet,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TransactionCard } from "@/components/transaction-card";
import { useAuth, useExchangeRate } from "@/lib/store";
import { useLocale } from "@/hooks/use-locale";
import {
  mockTransactions,
  mockReceivers,
  mockExchangeRate,
} from "@/lib/mock-data";
import type { Transaction, Receiver } from "@/types";

export default function HomePage() {
  const { user } = useAuth();
  const { currentRate, refreshRate } = useExchangeRate();
  const { t } = useLocale();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [receivers, setReceivers] = useState<Receiver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      // Check if this is the first time the user has logged in
      const hasLogged = localStorage.getItem("has_logged_in");
      setIsFirstLogin(!hasLogged);
      if (!hasLogged) {
        localStorage.setItem("has_logged_in", "true");
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
      setTransactions(mockTransactions.slice(0, 3));
      setReceivers(mockReceivers.slice(0, 4));
      setIsLoading(false);
    };
    loadData();
  }, []);

  const handleRefreshRate = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    refreshRate();
    setIsRefreshing(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const rate = currentRate || mockExchangeRate;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto max-w-7xl space-y-6 px-4 py-6 md:px-6 lg:px-8">
        {/* Dynamic Top Section: Welcome Card for first time, Exchange Rate (Ant Design) for returning */}
        {isFirstLogin ? (
          <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-4 md:p-6">
            <div className="space-y-1">
              <span className="text-sm font-medium text-primary">
                {t("home.welcomeBack")}
              </span>
              <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-sm text-muted-foreground md:text-base">
                {t("home.subtitle")}
              </p>
            </div>
            <Avatar className="h-14 w-14 border-4 border-background shadow-lg ring-2 ring-primary/20 md:h-16 md:w-16">
              <AvatarImage src={user?.avatarUrl} alt={user?.firstName} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-lg font-bold text-primary-foreground">
                {getInitials(
                  user ? `${user.firstName} ${user.lastName}` : "User",
                )}
              </AvatarFallback>
            </Avatar>
          </div>
        ) : (
          <AntCard
            title={
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span className="text-lg font-semibold">
                  {t("home.exchangeRates")}
                </span>
              </div>
            }
            extra={
              <div className="flex items-center gap-2">
                <Link href="/rates">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs h-8"
                  >
                    {t("home.viewHistory")}
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleRefreshRate}
                  disabled={isRefreshing}
                >
                  <RefreshCw
                    className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                </Button>
              </div>
            }
            className="shadow-sm rounded-2xl border border-border bg-card overflow-hidden"
            styles={{
              header: {
                borderBottom: "1px solid rgba(0,0,0,0.05)",
                background: "transparent",
              },
              body: { padding: "20px 24px", background: "transparent" },
            }}
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {"Today's Rate"}
                </p>
                <Statistic
                  valueStyle={{
                    color: "oklch(0.55 0.18 260)",
                    fontWeight: "bold",
                    fontSize: "1.75rem",
                  }}
                  value={rate.effectiveRate.toFixed(2)}
                  suffix="ETB"
                  prefix="1 USD ="
                />
              </div>
              {rate.bonusRate && rate.bonusRate > 0 && (
                <div className="flex items-center gap-2 font-medium bg-green-500/10 text-green-600 px-4 py-2 rounded-full border border-green-500/20">
                  <TrendingUp className="h-4 w-4" />
                  <span>+{rate.bonusRate.toFixed(2)} Bonus Active!</span>
                </div>
              )}
            </div>
          </AntCard>
        )}

        {/* KYC Alert */}
        {user?.kycStatus !== "approved" && (
          <Card className="border-2 border-warning/30 bg-gradient-to-r from-warning/10 to-warning/5 shadow-sm">
            <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center md:p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-warning/20">
                <AlertCircle className="h-6 w-6 text-warning-foreground" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="font-semibold text-foreground">
                  {t("home.kycRequired")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("home.kycDescription")}
                </p>
              </div>
              <Link href="/kyc">
                <Button className="w-full sm:w-auto">
                  {t("home.completeKyc")}
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4 pt-2 md:pt-4">
          <Link href="/send" className="block">
            <Card className="group h-full cursor-pointer border-2 border-transparent bg-gradient-to-br from-card to-card transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/10">
              <CardContent className="flex flex-col items-center gap-3 p-5 md:p-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25 transition-transform group-hover:scale-110">
                  <ArrowUpRight className="h-7 w-7 text-primary-foreground" />
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {t("home.sendMoney")}
                </span>
              </CardContent>
            </Card>
          </Link>
          <Link href="/wallet" className="block">
            <Card className="group h-full cursor-pointer border-2 border-transparent transition-all duration-300 hover:border-secondary hover:shadow-lg hover:shadow-secondary/10">
              <CardContent className="flex flex-col items-center gap-3 p-5 md:p-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary to-secondary/80 shadow-lg shadow-secondary/25 transition-transform group-hover:scale-110">
                  <Wallet className="h-7 w-7 text-secondary-foreground" />
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {t("home.wallet")}
                </span>
              </CardContent>
            </Card>
          </Link>
          <Link href="/gifts" className="block">
            <Card className="group h-full cursor-pointer border-2 border-transparent transition-all duration-300 hover:border-pink-500 hover:shadow-lg hover:shadow-pink-500/10">
              <CardContent className="flex flex-col items-center gap-3 p-5 md:p-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 shadow-lg shadow-pink-500/25 transition-transform group-hover:scale-110">
                  <Gift className="h-7 w-7 text-white" />
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {t("home.gifts")}
                </span>
              </CardContent>
            </Card>
          </Link>
          <Link href="/transactions" className="block">
            <Card className="group h-full cursor-pointer border-2 border-transparent transition-all duration-300 hover:border-accent hover:shadow-lg">
              <CardContent className="flex flex-col items-center gap-3 p-5 md:p-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-muted to-muted/80 shadow-lg transition-transform group-hover:scale-110">
                  <History className="h-7 w-7 text-muted-foreground" />
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {t("home.history")}
                </span>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* More Features */}
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          <Link href="/referrals" className="block">
            <Card className="group h-full cursor-pointer border border-transparent transition-all duration-300 hover:border-blue-500/50 hover:shadow-md">
              <CardContent className="flex flex-col items-center gap-2 p-4 md:gap-3 md:p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 transition-all group-hover:bg-blue-500/20 group-hover:scale-110 md:h-12 md:w-12">
                  <Users className="h-5 w-5 text-blue-500 md:h-6 md:w-6" />
                </div>
                <span className="text-xs font-medium text-foreground md:text-sm">
                  {t("home.referrals")}
                </span>
              </CardContent>
            </Card>
          </Link>
          <Link href="/donate" className="block">
            <Card className="group h-full cursor-pointer border border-transparent transition-all duration-300 hover:border-red-500/50 hover:shadow-md">
              <CardContent className="flex flex-col items-center gap-2 p-4 md:gap-3 md:p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 transition-all group-hover:bg-red-500/20 group-hover:scale-110 md:h-12 md:w-12">
                  <Heart className="h-5 w-5 text-red-500 md:h-6 md:w-6" />
                </div>
                <span className="text-xs font-medium text-foreground md:text-sm">
                  {t("home.donate")}
                </span>
              </CardContent>
            </Card>
          </Link>
          <Link href="/crowdfunding" className="block">
            <Card className="group h-full cursor-pointer border border-transparent transition-all duration-300 hover:border-purple-500/50 hover:shadow-md">
              <CardContent className="flex flex-col items-center gap-2 p-4 md:gap-3 md:p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 transition-all group-hover:bg-purple-500/20 group-hover:scale-110 md:h-12 md:w-12">
                  <TrendingUp className="h-5 w-5 text-purple-500 md:h-6 md:w-6" />
                </div>
                <span className="text-xs font-medium text-foreground md:text-sm">
                  {t("home.crowdfunding")}
                </span>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Receivers */}
        {receivers.length > 0 && (
          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg md:text-xl">
                {t("home.recentReceivers")}
              </CardTitle>
              <Link href="/receivers">
                <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                  {t("common.viewAll")}
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin md:gap-6">
                {receivers.map((receiver) => (
                  <Link
                    key={receiver.id}
                    href={`/send?receiver=${receiver.id}`}
                    className="group flex flex-col items-center gap-2"
                  >
                    <Avatar className="h-14 w-14 border-2 border-border shadow-sm transition-all group-hover:border-primary group-hover:shadow-md md:h-16 md:w-16">
                      <AvatarFallback className="bg-gradient-to-br from-muted to-muted/60 text-muted-foreground">
                        {getInitials(receiver.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="w-16 truncate text-center text-xs text-muted-foreground group-hover:text-foreground md:w-20">
                      {receiver.fullName.split(" ")[0]}
                    </span>
                  </Link>
                ))}
                <Link
                  href="/receivers/new"
                  className="group flex flex-col items-center gap-2"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-border bg-muted/30 transition-all group-hover:border-primary group-hover:bg-primary/5 md:h-16 md:w-16">
                    <Plus className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-primary" />
                  </div>
                  <span className="w-16 truncate text-center text-xs text-muted-foreground group-hover:text-foreground md:w-20">
                    {t("common.addNew")}
                  </span>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Transactions */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg md:text-xl">
              {t("home.recentTransactions")}
            </CardTitle>
            <Link href="/transactions">
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                {t("common.viewAll")}
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3 pb-6">
            {transactions.length > 0 ? (
              transactions.map((tx) => (
                <Link
                  key={tx.id}
                  href={`/transactions/${tx.id}`}
                  className="block"
                >
                  <div className="rounded-xl p-1 transition-colors hover:bg-muted/50">
                    <TransactionCard transaction={tx} />
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex flex-col items-center gap-4 py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                  <History className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-foreground">
                    {t("home.noTransactions")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("home.startSending")}
                  </p>
                </div>
                <Link href="/send">
                  <Button className="mt-2">
                    {t("home.sendFirstTransaction")}
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
