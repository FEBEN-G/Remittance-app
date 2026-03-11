"use client";

import { useState, useEffect, use, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Copy,
  Check,
  Download,
  Share2,
  HelpCircle,
  Printer,
} from "lucide-react";
import {
  Button as AntButton,
  Card as AntCard,
  Avatar as AntAvatar,
  Divider,
  Typography,
  Space,
} from "antd";
import { StatusBadge } from "@/components/status-badge";
import { useLocale } from "@/hooks/use-locale";
import { mockTransactions } from "@/lib/mock";
import type { Transaction } from "@/types";
import { toast } from "sonner";

const { Text, Title, Paragraph } = Typography;

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
    if (!transaction) return;

    // Professional text-based receipt (since we don't have jspdf)
    const receiptContent = `
========================================
       REMITPAY TRANSACTION RECEIPT
========================================

Reference No:    ${transaction.referenceNumber}
Date:            ${formatDate(transaction.createdAt)}
Status:          ${transaction.status.toUpperCase()}

----------------------------------------
SENDER DETAILS
----------------------------------------
Amount Sent:     $${transaction.amountUSD.toFixed(2)}
Fees:            $${transaction.fee.toFixed(2)}
Total Paid:      $${transaction.totalAmount.toFixed(2)}

----------------------------------------
RECEIVER DETAILS
----------------------------------------
Receiver Name:   ${transaction.receiverName}
Bank Name:       ${transaction.receiver.bankName}
Account Number:  ${transaction.receiver.accountNumber}
Amount ETB:      ${transaction.amountETB.toLocaleString()} ETB

----------------------------------------
EXCHANGE RATE INFO
----------------------------------------
Standard Rate:   1 USD = ${transaction.exchangeRate.toFixed(2)} ETB
Bonus Added:     ${transaction.bonusRate ? `+${transaction.bonusRate.toFixed(2)} ETB` : "None"}

----------------------------------------
========================================
   Thank you for using RemitPay!
   For support: support@remitpay.com
========================================
    `.trim();

    const blob = new Blob([receiptContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `RemitPay_Receipt_${transaction.referenceNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(t("transactions.receiptDownloaded"));
  };

  const shareReceipt = async () => {
    if (!transaction) return;

    const shareData = {
      title: "RemitPay Transaction Receipt",
      text: `I sent $${transaction.amountUSD} to ${transaction.receiverName} via RemitPay. Reference: ${transaction.referenceNumber}`,
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
        <Title level={4}>{t("transactions.notFound")}</Title>
        <Paragraph className="mt-2 text-muted-foreground">
          {t("transactions.notFoundDesc")}
        </Paragraph>
        <Link href="/transactions">
          <AntButton type="primary" className="mt-4">
            {t("transactions.backToList")}
          </AntButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4 print:hidden">
        <Link href="/transactions">
          <AntButton
            type="text"
            icon={<ArrowLeft className="h-5 w-5" />}
            className="flex items-center justify-center"
          />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-foreground">
            {t("transactions.details")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {transaction.referenceNumber}
          </p>
        </div>
      </div>

      {/* Receipt Content */}
      <div ref={receiptRef}>
        {/* Status Card */}
        <AntCard className="mb-6 overflow-hidden">
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 print:hidden">
              <span className="text-2xl font-bold text-primary">RP</span>
            </div>
            <p className="hidden text-center text-lg font-bold print:block">
              RemitPay
            </p>
            <StatusBadge status={transaction.status} size="lg" />
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">
                ${transaction.amountUSD.toFixed(2)}
              </p>
              <p className="text-muted-foreground">
                {transaction.amountETB.toLocaleString()} ETB
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              {formatDate(transaction.createdAt)}
            </p>
          </div>
        </AntCard>

        {/* Receiver Info */}
        <AntCard
          className="mb-6"
          title={
            <span className="text-base">{t("transactions.receiverInfo")}</span>
          }
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <AntAvatar
                size={48}
                className="border border-border bg-muted flex items-center justify-center"
              >
                <Text className="text-muted-foreground font-bold">
                  {getInitials(transaction.receiverName)}
                </Text>
              </AntAvatar>
              <div>
                <p className="font-medium text-foreground">
                  {transaction.receiverName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {transaction.receiver.bankName}
                </p>
              </div>
            </div>
            <div className="space-y-2 rounded-xl bg-muted/50 p-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("transactions.accountNumber")}
                </span>
                <span className="font-mono text-sm text-foreground">
                  {transaction.receiver.accountNumber}
                </span>
              </div>
              {transaction.receiver.phone && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t("common.phone")}
                  </span>
                  <span className="font-mono text-sm text-foreground">
                    {transaction.receiver.phone}
                  </span>
                </div>
              )}
            </div>
          </div>
        </AntCard>

        {/* Transaction Details */}
        <AntCard
          className="mb-6"
          title={
            <span className="text-base">
              {t("transactions.transactionInfo")}
            </span>
          }
        >
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {t("transactions.referenceNumber")}
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-foreground">
                  {transaction.referenceNumber}
                </span>
                <AntButton
                  type="text"
                  size="small"
                  className="flex items-center justify-center h-6 w-6 print:hidden"
                  onClick={() => copyToClipboard(transaction.referenceNumber)}
                  icon={
                    copied ? (
                      <Check className="h-3 w-3 text-success" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )
                  }
                />
              </div>
            </div>
            {transaction.purpose && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {t("transactions.purpose")}
                </span>
                <span className="text-foreground">{transaction.purpose}</span>
              </div>
            )}
            <Divider className="my-2" />
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {t("transactions.amountSent")}
              </span>
              <span className="text-foreground font-medium">
                ${transaction.amountUSD.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {t("transactions.fees")}
              </span>
              <span className="text-foreground">
                ${transaction.fee.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {t("transactions.exchangeRate")}
              </span>
              <span className="text-foreground">
                1 USD = {transaction.exchangeRate.toFixed(2)} ETB
              </span>
            </div>
            {transaction.bonusRate && transaction.bonusRate > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {t("transactions.bonusRate")}
                </span>
                <span className="text-success font-medium">
                  +{transaction.bonusRate.toFixed(2)} ETB
                </span>
              </div>
            )}
            <Divider className="my-2" />
            <div className="flex justify-between">
              <span className="font-medium text-foreground">
                {t("transactions.totalPaid")}
              </span>
              <span className="font-bold text-foreground text-lg">
                ${transaction.totalAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">
                {t("transactions.amountReceived")}
              </span>
              <span className="font-bold text-primary text-xl">
                {transaction.amountETB.toLocaleString()} ETB
              </span>
            </div>
          </div>
        </AntCard>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-3 gap-3 print:hidden">
        <AntButton
          block
          size="large"
          className="flex items-center justify-center gap-2"
          onClick={downloadReceipt}
          icon={<Download className="h-4 w-4" />}
        >
          {t("transactions.download")}
        </AntButton>
        <AntButton
          block
          size="large"
          className="flex items-center justify-center gap-2"
          onClick={shareReceipt}
          icon={<Share2 className="h-4 w-4" />}
        >
          {t("transactions.share")}
        </AntButton>
        <AntButton
          block
          size="large"
          className="flex items-center justify-center gap-2"
          onClick={printReceipt}
          icon={<Printer className="h-4 w-4" />}
        >
          {t("transactions.print")}
        </AntButton>
      </div>

      {/* Help Card */}
      <AntCard className="mt-6 border-primary/20 bg-primary/5 print:hidden overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <HelpCircle className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              {t("transactions.needHelp")}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("transactions.contactSupport")}
            </p>
          </div>
          <Link href="/help">
            <AntButton
              type="text"
              size="small"
              className="text-primary font-medium"
            >
              {t("transactions.getHelp")}
            </AntButton>
          </Link>
        </div>
      </AntCard>
    </div>
  );
}
