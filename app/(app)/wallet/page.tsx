"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Wallet as WalletIcon,
  TrendingUp,
  ChevronRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocale } from "@/hooks/use-locale";
import { mockWallets, mockPaymentMethods } from "@/lib/mock-data";
import type { Wallet, PaymentMethod } from "@/types";

export default function WalletPage() {
  const { t } = useLocale();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setWallets(mockWallets);
      setPaymentMethods(mockPaymentMethods);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency === "ETB" ? "ETB" : "USD",
    }).format(amount);
  };

  const getCardIcon = (type: string) => {
    if (type === "mastercard") {
      return (
        <div className="flex h-8 w-12 items-center justify-center rounded bg-gradient-to-r from-red-500 to-yellow-500">
          <span className="text-xs font-bold text-white">MC</span>
        </div>
      );
    }
    if (type === "visa") {
      return (
        <div className="flex h-8 w-12 items-center justify-center rounded bg-gradient-to-r from-blue-600 to-blue-800">
          <span className="text-xs font-bold text-white">VISA</span>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const totalBalance = wallets.reduce((sum, w) => {
    if (w.currency === "USD") return sum + w.balance;
    return sum + w.balance / 126.5; // Convert ETB to USD
  }, 0);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Link href="/home">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-foreground">{t("wallet.title")}</h1>
      </div>

      {/* Total Balance Card */}
      <Card className="mb-6 overflow-hidden bg-gradient-to-br from-primary to-secondary text-primary-foreground">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm opacity-90">{t("wallet.totalBalance")}</span>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="rounded-full p-1 transition-colors hover:bg-white/20"
            >
              {showBalance ? (
                <Eye className="h-5 w-5" />
              ) : (
                <EyeOff className="h-5 w-5" />
              )}
            </button>
          </div>
          <div className="mb-6">
            <h2 className="text-3xl font-bold">
              {showBalance ? formatCurrency(totalBalance, "USD") : "****"}
            </h2>
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1 gap-2 bg-white/20 text-white hover:bg-white/30"
            >
              <Plus className="h-4 w-4" />
              {t("wallet.addMoney")}
            </Button>
            <Link href="/send" className="flex-1">
              <Button
                variant="secondary"
                className="w-full gap-2 bg-white/20 text-white hover:bg-white/30"
              >
                <ArrowUpRight className="h-4 w-4" />
                {t("wallet.send")}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Wallet Accounts */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{t("wallet.accounts")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {wallets.map((wallet) => (
            <div
              key={wallet.id}
              className="flex items-center justify-between rounded-lg border border-border p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <WalletIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {wallet.currency} {t("wallet.wallet")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("wallet.available")}: {showBalance ? formatCurrency(wallet.availableBalance, wallet.currency) : "****"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-foreground">
                  {showBalance ? formatCurrency(wallet.balance, wallet.currency) : "****"}
                </p>
                {wallet.pendingBalance > 0 && (
                  <p className="text-xs text-warning-foreground">
                    +{formatCurrency(wallet.pendingBalance, wallet.currency)} {t("wallet.pending")}
                  </p>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="mb-6 grid grid-cols-4 gap-3">
        <Link href="/wallet/deposit" className="block">
          <Card className="group cursor-pointer transition-all hover:border-primary">
            <CardContent className="flex flex-col items-center gap-2 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10 transition-colors group-hover:bg-success/20">
                <ArrowDownLeft className="h-5 w-5 text-success" />
              </div>
              <span className="text-xs text-foreground">{t("wallet.deposit")}</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/send" className="block">
          <Card className="group cursor-pointer transition-all hover:border-primary">
            <CardContent className="flex flex-col items-center gap-2 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                <ArrowUpRight className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs text-foreground">{t("wallet.send")}</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/wallet/exchange" className="block">
          <Card className="group cursor-pointer transition-all hover:border-primary">
            <CardContent className="flex flex-col items-center gap-2 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10 transition-colors group-hover:bg-secondary/20">
                <TrendingUp className="h-5 w-5 text-secondary" />
              </div>
              <span className="text-xs text-foreground">{t("wallet.exchange")}</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/wallet/cards" className="block">
          <Card className="group cursor-pointer transition-all hover:border-primary">
            <CardContent className="flex flex-col items-center gap-2 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent transition-colors group-hover:bg-accent/80">
                <CreditCard className="h-5 w-5 text-accent-foreground" />
              </div>
              <span className="text-xs text-foreground">{t("wallet.cards")}</span>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Payment Methods */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base">{t("wallet.paymentMethods")}</CardTitle>
          <Link href="/wallet/cards/add">
            <Button variant="ghost" size="sm" className="gap-1 text-xs">
              <Plus className="h-3 w-3" />
              {t("wallet.addCard")}
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-3">
          {paymentMethods.length > 0 ? (
            paymentMethods.map((method) => (
              <Link key={method.id} href={`/wallet/cards/${method.id}`}>
                <div className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    {getCardIcon(method.type)}
                    <div>
                      <p className="font-medium text-foreground">
                        {method.type === "mastercard" ? "Mastercard" : "Visa"} ****{method.lastFourDigits}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t("wallet.expires")} {method.expiryMonth}/{method.expiryYear}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {method.isDefault && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                        {t("wallet.default")}
                      </span>
                    )}
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <CreditCard className="h-12 w-12 text-muted-foreground/50" />
              <div>
                <p className="font-medium text-foreground">{t("wallet.noCards")}</p>
                <p className="text-sm text-muted-foreground">{t("wallet.addCardDescription")}</p>
              </div>
              <Link href="/wallet/cards/add">
                <Button size="sm">{t("wallet.addCard")}</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
