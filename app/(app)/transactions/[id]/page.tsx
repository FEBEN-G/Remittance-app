"use client";

import { useState, useEffect, use, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, Check, Download, Share2, HelpCircle, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/status-badge";
import { useLocale } from "@/hooks/use-locale";
import { mockTransactions, mockBanks } from "@/lib/mock-data";
import type { Transaction } from "@/types";
import { toast } from "sonner";

export default function TransactionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { t } = useLocale();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadTransaction = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300));
      const tx = mockTransactions.find((tx) => tx.id === id);
      setTransaction(tx || null);
      setIsLoading(false);
    };
    loadTransaction();
  }, [id]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success(t("common.copied"));
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const downloadReceipt = () => {
    // Generate PDF receipt
    const receiptContent = `
REMITPAY TRANSACTION RECEIPT
============================

Reference: ${transaction?.referenceNumber}
Date: ${transaction ? formatDate(transaction.createdAt) : ""}
Status: ${transaction?.status.toUpperCase()}

SENDER DETAILS
--------------
Amount Sent: $${transaction?.amountUSD.toFixed(2)}
Fee: $${transaction?.fee.toFixed(2)}
Total Paid: $${transaction?.totalAmount.toFixed(2)}

RECEIVER DETAILS
----------------
Name: ${transaction?.receiverName}
Bank: ${transaction?.receiver.bankName}
Account: ${transaction?.receiver.accountNumber}
Amount Received: ${transaction?.amountETB.toLocaleString()} ETB

EXCHANGE RATE
-------------
Rate: 1 USD = ${transaction?.exchangeRate.toFixed(2)} ETB
${transaction?.bonusRate ? `Bonus: +${transaction.bonusRate.toFixed(2)} ETB` : ""}

============================
Thank you for using White Label Pay!
For support: support@whitelabelpay.com
    `.trim();

    const blob = new Blob([receiptContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt-${transaction?.referenceNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(t("transactions.receiptDownloaded"));
  };

  const shareReceipt = async () => {
    if (!transaction) return;
    
    const shareData = {
      title: "White Label Pay Transaction Receipt",
      text: `I sent $${transaction.amountUSD} to ${transaction.receiverName} via White Label Pay. Reference: ${transaction.referenceNumber}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        await navigator.clipboard.writeText(shareData.text);
        toast.success(t("common.copied"));
      }
    } else {
      await navigator.clipboard.writeText(shareData.text);
      toast.success(t("common.copied"));
    }
  };

  const printReceipt = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-12 text-center">
        <h2 className="text-xl font-bold text-foreground">{t("transactions.notFound")}</h2>
        <p className="mt-2 text-muted-foreground">{t("transactions.notFoundDesc")}</p>
        <Link href="/transactions">
          <Button className="mt-4">{t("transactions.backToList")}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4 print:hidden">
        <Link href="/transactions">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-foreground">{t("transactions.details")}</h1>
          <p className="text-sm text-muted-foreground">{transaction.referenceNumber}</p>
        </div>
      </div>

      {/* Receipt Content */}
      <div ref={receiptRef}>
        {/* Status Card */}
        <Card className="mb-6">
          <CardContent className="flex flex-col items-center gap-4 py-8">
            <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 print:hidden">
              <span className="text-2xl font-bold text-primary">WLP</span>
            </div>
            <p className="hidden text-center text-lg font-bold print:block">White Label Pay</p>
            <StatusBadge status={transaction.status} size="lg" />
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">
                ${transaction.amountUSD.toFixed(2)}
              </p>
              <p className="text-muted-foreground">
                {transaction.amountETB.toLocaleString()} ETB
              </p>
            </div>
            <p className="text-sm text-muted-foreground">{formatDate(transaction.createdAt)}</p>
          </CardContent>
        </Card>

        {/* Receiver Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">{t("transactions.receiverInfo")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 border border-border">
                <AvatarFallback className="bg-muted text-muted-foreground">
                  {getInitials(transaction.receiverName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-foreground">{transaction.receiverName}</p>
                <p className="text-sm text-muted-foreground">{transaction.receiver.bankName}</p>
              </div>
            </div>
            <div className="space-y-2 rounded-lg bg-muted p-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">{t("transactions.accountNumber")}</span>
                <span className="font-mono text-sm text-foreground">
                  {transaction.receiver.accountNumber}
                </span>
              </div>
              {transaction.receiver.phone && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t("common.phone")}</span>
                  <span className="font-mono text-sm text-foreground">
                    {transaction.receiver.phone}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Transaction Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">{t("transactions.transactionInfo")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("transactions.referenceNumber")}</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-foreground">
                  {transaction.referenceNumber}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 print:hidden"
                  onClick={() => copyToClipboard(transaction.referenceNumber)}
                >
                  {copied ? (
                    <Check className="h-3 w-3 text-success" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
            {transaction.purpose && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("transactions.purpose")}</span>
                <span className="text-foreground">{transaction.purpose}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("transactions.amountSent")}</span>
              <span className="text-foreground">${transaction.amountUSD.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("transactions.fees")}</span>
              <span className="text-foreground">${transaction.fee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("transactions.exchangeRate")}</span>
              <span className="text-foreground">1 USD = {transaction.exchangeRate.toFixed(2)} ETB</span>
            </div>
            {transaction.bonusRate && transaction.bonusRate > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("transactions.bonusRate")}</span>
                <span className="text-success">+{transaction.bonusRate.toFixed(2)} ETB</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between">
              <span className="font-medium text-foreground">{t("transactions.totalPaid")}</span>
              <span className="font-bold text-foreground">
                ${transaction.totalAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("transactions.amountReceived")}</span>
              <span className="font-semibold text-primary">
                {transaction.amountETB.toLocaleString()} ETB
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-3 gap-3 print:hidden">
        <Button variant="outline" className="gap-2" onClick={downloadReceipt}>
          <Download className="h-4 w-4" />
          {t("transactions.download")}
        </Button>
        <Button variant="outline" className="gap-2" onClick={shareReceipt}>
          <Share2 className="h-4 w-4" />
          {t("transactions.share")}
        </Button>
        <Button variant="outline" className="gap-2" onClick={printReceipt}>
          <Printer className="h-4 w-4" />
          {t("transactions.print")}
        </Button>
      </div>

      {/* Help */}
      <Card className="mt-6 border-primary/20 bg-primary/5 print:hidden">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <HelpCircle className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">{t("transactions.needHelp")}</p>
            <p className="text-xs text-muted-foreground">{t("transactions.contactSupport")}</p>
          </div>
          <Link href="/help">
            <Button variant="ghost" size="sm">
              {t("transactions.getHelp")}
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
