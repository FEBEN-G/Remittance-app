"use client";

import { Card as AntCard, Tag } from "antd";
import { cn } from "@/lib/utils";
import type {
  TransactionDetails,
  TransactionSummary as TransactionSummaryType,
  Receiver,
} from "@/types";
import { Building2, ArrowRight, Receipt, ShieldCheck } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface TransactionSummaryProps {
  details: TransactionDetails;
  className?: string;
}

export function TransactionSummary({
  details,
  className,
}: TransactionSummaryProps) {
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className={cn("space-y-6", className)}>
      <AntCard
        className="overflow-hidden rounded-[2.5rem] border-none bg-linear-to-br from-background via-background to-primary/5 shadow-2xl relative"
        styles={{ body: { padding: 0 } }}
      >
        {/* Receipt Header Decor */}
        <div className="absolute top-0 inset-x-0 h-2 bg-linear-to-r from-primary via-primary/80 to-primary" />

        <div className="p-8 space-y-8">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px]">
                <Receipt className="h-3.5 w-3.5" />
                <span>Transaction Receipt</span>
              </div>
              <h3 className="text-2xl font-black text-foreground tracking-tight">
                Review Details
              </h3>
            </div>
            <Tag
              color="blue"
              className="rounded-full px-3 py-1 font-bold uppercase text-[10px] border-none bg-primary/10 text-primary m-0"
            >
              Draft
            </Tag>
          </div>

          {/* Recipient Details Card */}
          <div className="rounded-3xl bg-muted/30 p-6 border border-border/40 relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 blur-xl" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-4">
              Recipient Details
            </p>
            <div className="flex items-center gap-4 relative z-10">
              <Avatar className="h-14 w-14 border-2 border-primary/20 shadow-sm">
                <AvatarFallback className="bg-primary text-primary-foreground font-black">
                  {getInitials(details.receiver.fullName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-lg font-black text-foreground truncate">
                  {details.receiver.fullName}
                </p>
                <div className="flex items-center gap-2 text-muted-foreground/70 font-medium text-sm mt-0.5">
                  <Building2 className="h-3.5 w-3.5" />
                  <span>{details.receiver.bankName}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Amount Breakdown */}
          <div className="space-y-5">
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-bold text-muted-foreground/70 uppercase tracking-widest">
                You Send
              </span>
              <div className="text-right">
                <span className="text-3xl font-black text-foreground tracking-tight">
                  ${details.sendAmount.toFixed(2)}
                </span>
                <span className="ml-2 text-sm font-black text-muted-foreground/40">
                  USD
                </span>
              </div>
            </div>

            <div className="h-px bg-linear-to-r from-transparent via-border/60 to-transparent" />

            <div className="space-y-3">
              <div className="flex justify-between text-sm items-center">
                <span className="font-bold text-muted-foreground/60 uppercase tracking-wider text-[10px]">
                  Exchange Rate
                </span>
                <span className="font-black text-foreground">
                  1 USD = {details.exchangeRate.toFixed(2)} ETB
                </span>
              </div>
              <div className="flex justify-between text-sm items-center">
                <span className="font-bold text-muted-foreground/60 uppercase tracking-wider text-[10px]">
                  Transfer Fee
                </span>
                <span className="font-black text-emerald-500">
                  ${details.fees.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm items-center">
                <span className="font-bold text-muted-foreground/60 uppercase tracking-wider text-[10px]">
                  Purpose
                </span>
                <span className="font-black text-foreground capitalize">
                  {details.purpose.replace(/_/g, " ")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Receipt Footer */}
        <div className="relative group">
          <div className="absolute inset-0 bg-primary h-full opacity-[0.03]" />
          <div className="p-8 space-y-6 relative z-10 border-t border-dashed border-border/60">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground font-bold uppercase tracking-widest text-xs">
                Total to pay
              </span>
              <span className="text-2xl font-black text-foreground tracking-tight">
                ${details.total.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-center relative py-2">
              <div className="absolute inset-x-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent" />
              <div className="bg-background px-4 relative z-10">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                  <ArrowRight className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>

            <div className="text-center space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">
                Recipient Receives
              </p>
              <div className="flex items-baseline justify-center gap-2">
                <h4 className="text-4xl font-black text-primary tracking-tighter">
                  {details.receiveAmount.toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                  })}
                </h4>
                <span className="text-xl font-black text-primary/60">ETB</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between h-3 w-full absolute -bottom-1">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-full bg-background mt-1"
              />
            ))}
          </div>
        </div>
      </AntCard>

      <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
        <ShieldCheck className="h-4 w-4" />
        <span>Instantly verified via bank network</span>
      </div>
    </div>
  );
}

interface TransactionSummaryCardProps {
  summary: TransactionSummaryType;
  receiver?: Receiver;
  showReceiver?: boolean;
  className?: string;
}

export function TransactionSummaryCard({
  summary,
  receiver,
  showReceiver = true,
  className,
}: TransactionSummaryCardProps) {
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <AntCard
      className={cn(
        "overflow-hidden rounded-3xl border-border/40 shadow-xl",
        className,
      )}
      styles={{ body: { padding: 0 } }}
    >
      <div className="bg-primary/5 p-4 border-b border-border/40">
        <h4 className="font-black uppercase tracking-widest text-[10px] text-primary/60">
          Transaction Summary
        </h4>
      </div>
      <div className="p-6 space-y-6">
        {showReceiver && receiver && (
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-border/20">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="font-bold text-xs">
                {getInitials(receiver.fullName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold text-sm">{receiver.fullName}</p>
              <p className="text-[10px] text-muted-foreground uppercase font-medium">
                {receiver.bankName}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-3 px-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground font-medium">You send</span>
            <span className="font-black">${summary.amountUSD.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground font-medium">
              Exchange rate
            </span>
            <span className="font-black text-[10px] uppercase">
              1 USD = {summary.exchangeRate.toFixed(2)} ETB
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground font-medium">Fee</span>
            <span className="font-black text-emerald-500">
              ${summary.fee.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-dashed border-border/60">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-muted-foreground uppercase opacity-60">
              Total to pay
            </span>
            <span className="font-black text-lg">
              ${summary.totalDebit.toFixed(2)}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 text-center">
            <p className="text-[10px] font-black uppercase text-primary/40 mb-1">
              Recipient gets
            </p>
            <p className="text-2xl font-black text-primary">
              {summary.receiverGets.toLocaleString()}{" "}
              <span className="text-xs">ETB</span>
            </p>
          </div>
        </div>
      </div>
    </AntCard>
  );
}
