"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Button as AntButton,
  Card as AntCard,
  Avatar as AntAvatar,
  Statistic,
  Space,
  Row,
  Col,
} from "antd";
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
import { TransactionCard } from "@/components/transaction-card";
import { useAuth, useExchangeRate } from "@/lib/store";
import { useLocale } from "@/hooks/use-locale";
import { mockTransactions, mockReceivers, mockUser } from "@/lib/mock";
import type { Transaction, Receiver } from "@/types";

export default function HomePage() {
  const { user } = useAuth();
  const { currentRate, refreshRate } = useExchangeRate();
  const { t } = useLocale();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [receivers, setReceivers] = useState<Receiver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
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

  const rate = currentRate;

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20 pb-12">
      <div className="space-y-8 py-8">
        {/* Header & Exchange Rate */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
            <div>
              <h1 className="text-3xl font-black text-foreground md:text-4xl tracking-tight">
                {t("home.welcomeBack")}, {user?.firstName}!
              </h1>
              <p className="text-muted-foreground font-medium">
                {t("home.subtitle")}
              </p>
            </div>
          </div>

          <AntCard
            className="shadow-md rounded-4xl border-border bg-background/95 backdrop-blur-sm overflow-hidden group"
            styles={{
              header: {
                borderBottom: "1px solid var(--border)",
                opacity: 0.6,
                padding: "1.5rem 2rem",
              },
              body: { padding: "2rem", background: "transparent" },
            }}
            title={
              <Space className="group">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 transition-transform group-hover:scale-110">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xl font-black tracking-tight text-foreground">
                  {t("home.exchangeRates")}
                </span>
              </Space>
            }
            extra={
              <Space>
                <Link href="/rates">
                  <AntButton
                    type="default"
                    className="h-10 rounded-xl border-border/40 hover:border-primary/50 text-xs font-bold uppercase tracking-wider"
                  >
                    {t("home.viewHistory")}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </AntButton>
                </Link>
                <AntButton
                  type="text"
                  icon={
                    <RefreshCw
                      className={`h-5 w-5 text-muted-foreground ${isRefreshing ? "animate-spin text-primary" : ""}`}
                    />
                  }
                  className="h-10 w-10 rounded-xl hover:bg-muted"
                  onClick={handleRefreshRate}
                  disabled={isRefreshing}
                />
              </Space>
            }
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-1">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                  {"Today's Live Rate"}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-bold text-muted-foreground">
                    1 USD =
                  </span>
                  {rate && (
                    <Statistic
                      value={rate.effectiveRate}
                      precision={2}
                      suffix="ETB"
                      valueStyle={{
                        color: "var(--primary)",
                        fontWeight: "900",
                        fontSize: "3rem",
                        letterSpacing: "-0.05em",
                        lineHeight: "1",
                      }}
                    />
                  )}
                </div>
              </div>
              {rate && rate.bonusRate && rate.bonusRate > 0 && (
                <div className="flex items-center gap-3 font-black bg-success/10 text-success px-6 py-3 rounded-2xl border border-success/20 shadow-lg shadow-success/5 animate-in slide-in-from-right-4 duration-500">
                  <div className="relative">
                    <TrendingUp className="h-5 w-5" />
                    <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  </div>
                  <span className="uppercase text-xs tracking-widest">
                    +{rate.bonusRate.toFixed(2)} Bonus Rate Applied
                  </span>
                </div>
              )}
            </div>
          </AntCard>
        </div>

        {/* Quick Actions Grid */}
        <div className="mt-20 grid grid-cols-2 gap-4 sm:grid-cols-4 md:gap-6">
          <Link href="/send" className="group">
            <AntCard
              hoverable
              className="h-full rounded-4xl border-border/40 bg-background/40 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20"
              styles={{ body: { padding: "2rem" } }}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-primary/80 shadow-xl shadow-primary/30 group-hover:scale-110 transition-transform duration-500">
                  <ArrowUpRight className="h-8 w-8 text-primary-foreground" />
                </div>
                <span className="text-sm font-black uppercase tracking-widest text-foreground/80">
                  {t("home.sendMoney")}
                </span>
              </div>
            </AntCard>
          </Link>
          <Link href="/wallet" className="group">
            <AntCard
              hoverable
              className="h-full rounded-4xl border-border/40 bg-background/40 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-secondary/20"
              styles={{ body: { padding: "2rem" } }}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-secondary to-secondary/80 shadow-xl shadow-secondary/30 group-hover:scale-110 transition-transform duration-500">
                  <Wallet className="h-8 w-8 text-secondary-foreground" />
                </div>
                <span className="text-sm font-black uppercase tracking-widest text-foreground/80">
                  {t("home.wallet")}
                </span>
              </div>
            </AntCard>
          </Link>
          <Link href="/gifts" className="group">
            <AntCard
              hoverable
              className="h-full rounded-4xl border-border/40 bg-background/40 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-pink-500/20"
              styles={{ body: { padding: "2rem" } }}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-pink-500 to-pink-600 shadow-xl shadow-pink-500/30 group-hover:scale-110 transition-transform duration-500">
                  <Gift className="h-8 w-8 text-white" />
                </div>
                <span className="text-sm font-black uppercase tracking-widest text-foreground/80">
                  {t("home.gifts")}
                </span>
              </div>
            </AntCard>
          </Link>
          <Link href="/transactions" className="group">
            <AntCard
              hoverable
              className="h-full rounded-4xl border-border/40 bg-background/40 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-muted/30"
              styles={{ body: { padding: "2rem" } }}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-muted to-muted/80 shadow-xl group-hover:scale-110 transition-transform duration-500">
                  <History className="h-8 w-8 text-muted-foreground" />
                </div>
                <span className="text-sm font-black uppercase tracking-widest text-foreground/80">
                  {t("home.history")}
                </span>
              </div>
            </AntCard>
          </Link>
        </div>

        {/* Dual Column Layout for Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Receivers (Ant Design) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-black tracking-tight text-foreground">
                {t("home.recentReceivers")}
              </h2>
              <Link href="/receivers">
                <AntButton
                  type="link"
                  className="font-bold uppercase tracking-widest text-xs h-8"
                >
                  {t("common.viewAll")}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </AntButton>
              </Link>
            </div>

            <AntCard
              className="border-border/40 bg-background/40 backdrop-blur-xl rounded-[2.5rem] shadow-xl overflow-hidden"
              styles={{ body: { padding: "2rem" } }}
            >
              <div className="flex gap-8 overflow-x-auto pb-4 scrollbar-hide">
                <Link
                  href="/receivers/new"
                  className="group shrink-0 text-center space-y-3"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-primary/30 bg-primary/5 transition-all group-hover:border-primary group-hover:bg-primary/10 shadow-inner group-hover:scale-110 duration-500">
                    <Plus className="h-8 w-8 text-primary/60 group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary">
                    {t("common.addNew")}
                  </p>
                </Link>
                {receivers.map((receiver) => (
                  <Link
                    key={receiver.id}
                    href={`/send?receiver=${receiver.id}`}
                    className="group shrink-0 text-center space-y-3"
                  >
                    <div className="relative">
                      <AntAvatar
                        size={64}
                        className="border-2 border-border/40 bg-background shadow-md transition-all group-hover:border-primary group-hover:shadow-primary/20 group-hover:scale-110 duration-500"
                      >
                        {getInitials(receiver.fullName)}
                      </AntAvatar>
                      <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-lg bg-background border border-border/40 flex items-center justify-center shadow-lg">
                        <ArrowUpRight className="h-3 w-3 text-primary" />
                      </div>
                    </div>
                    <p className="max-w-[72px] truncate text-xs font-bold text-muted-foreground group-hover:text-foreground">
                      {receiver.fullName.split(" ")[0]}
                    </p>
                  </Link>
                ))}
              </div>
            </AntCard>
          </div>

          {/* Featured Sections / More Features */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-black tracking-tight text-foreground">
                Features
              </h2>
            </div>
            <div className="space-y-4">
              <Link href="/referrals" className="block group">
                <AntCard
                  hoverable
                  className="rounded-3xl border-border/40 bg-linear-to-r from-blue-500/10 dark:from-blue-500/20 to-transparent backdrop-blur-sm overflow-hidden"
                  styles={{ body: { padding: "1.25rem" } }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20 dark:bg-blue-500/30 text-blue-500 group-hover:scale-110 transition-transform">
                      <Users className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-black text-foreground uppercase tracking-wider text-xs">
                        {t("home.referrals")}
                      </p>
                      <p className="text-xs font-medium text-muted-foreground">
                        Earn $5 per friend
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground/40 group-hover:text-blue-500" />
                  </div>
                </AntCard>
              </Link>
              <Link href="/donate" className="block group">
                <AntCard
                  hoverable
                  className="rounded-3xl border-border/40 bg-linear-to-r from-rose-500/10 dark:from-rose-500/20 to-transparent backdrop-blur-sm overflow-hidden"
                  styles={{ body: { padding: "1.25rem" } }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/20 dark:bg-rose-500/30 text-rose-500 group-hover:scale-110 transition-transform">
                      <Heart className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-black text-foreground uppercase tracking-wider text-xs">
                        {t("home.donate")}
                      </p>
                      <p className="text-xs font-medium text-muted-foreground">
                        Support causes back home
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground/40 group-hover:text-rose-500" />
                  </div>
                </AntCard>
              </Link>
              <Link href="/crowdfunding" className="block group">
                <AntCard
                  hoverable
                  className="rounded-3xl border-border/40 bg-linear-to-r from-purple-500/10 dark:from-purple-500/20 to-transparent backdrop-blur-sm overflow-hidden"
                  styles={{ body: { padding: "1.25rem" } }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/20 dark:bg-purple-500/30 text-purple-500 group-hover:scale-110 transition-transform">
                      <TrendingUp className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-black text-foreground uppercase tracking-wider text-xs">
                        {t("home.crowdfunding")}
                      </p>
                      <p className="text-xs font-medium text-muted-foreground">
                        Invest in local projects
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground/40 group-hover:text-purple-500" />
                  </div>
                </AntCard>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Transactions (Ant Design Full Section) */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-black tracking-tight text-foreground">
              {t("home.recentTransactions")}
            </h2>
            <Link href="/transactions">
              <AntButton
                type="link"
                className="font-bold uppercase tracking-widest text-xs h-8"
              >
                {t("common.viewAll")}
                <ChevronRight className="h-4 w-4 ml-1" />
              </AntButton>
            </Link>
          </div>

          <AntCard
            className="border-border/40 bg-background/40 backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden"
            styles={{ body: { padding: "1.5rem" } }}
          >
            {transactions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {transactions.map((tx) => (
                  <Link
                    key={tx.id}
                    href={`/transactions/${tx.id}`}
                    className="block hover:-translate-y-1 transition-transform"
                  >
                    <TransactionCard
                      transaction={tx}
                      className="border-none bg-transparent hover:bg-muted/30 shadow-none"
                    />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-6 py-16 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-muted/40 shadow-inner">
                  <History className="h-10 w-10 text-muted-foreground/30" />
                </div>
                <div className="space-y-2 max-w-xs">
                  <p className="text-xl font-black text-foreground tracking-tight">
                    {t("home.noTransactions")}
                  </p>
                  <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                    {t("home.startSending")}
                  </p>
                </div>
                <Link href="/send" className="pt-2">
                  <AntButton
                    type="primary"
                    size="large"
                    className="h-14 px-10 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20"
                  >
                    {t("home.sendFirstTransaction")}
                  </AntButton>
                </Link>
              </div>
            )}
          </AntCard>
        </div>
      </div>
    </div>
  );
}
