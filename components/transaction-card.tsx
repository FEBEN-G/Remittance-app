"use client";

import { ArrowUpRight, User } from "lucide-react";
import { Card as AntCard } from "antd";
import { StatusBadge } from "@/components/status-badge";
import { cn } from "@/lib/utils";
import type { Transaction } from "@/types";

interface TransactionCardProps {
  transaction: Transaction;
  onClick?: () => void;
  className?: string;
}

export function TransactionCard({
  transaction,
  onClick,
  className,
}: TransactionCardProps) {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(transaction.createdAt));

  return (
    <AntCard
      hoverable
      className={cn(
        "overflow-hidden rounded-2xl border-border/40 bg-background/40 backdrop-blur-sm transition-all hover:bg-muted/50 hover:border-primary/20",
        className,
      )}
      styles={{ body: { padding: "1rem" } }}
      onClick={onClick}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <User className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-foreground truncate leading-tight">
              {transaction.receiver.fullName}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {transaction.receiver.bankName}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 shrink-0">
          <div className="flex items-center gap-1 text-primary font-bold">
            <ArrowUpRight className="h-4 w-4" />
            <span>${transaction.amountUSD.toFixed(2)}</span>
          </div>
          <StatusBadge status={transaction.status} size="sm" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-[10px] font-medium text-muted-foreground/60 border-t border-border/40 pt-3">
        <span className="uppercase tracking-wider">{formattedDate}</span>
        <span className="font-mono bg-muted/50 px-2 py-0.5 rounded-md">
          {transaction.referenceNumber}
        </span>
      </div>
    </AntCard>
  );
}
