"use client";

import { useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { DollarSign, ArrowDown, Delete } from "lucide-react";
import { Card as AntCard, Button as AntButton } from "antd";
import type { ExchangeRate } from "@/types";

interface AmountInputProps {
  exchangeRate: ExchangeRate | null;
  sendAmount: string;
  receiveAmount: string;
  onAmountChange: (send: string, receive: string) => void;
  maxAmount?: number;
  minAmount?: number;
  className?: string;
}

export function AmountInput({
  exchangeRate,
  sendAmount,
  receiveAmount,
  onAmountChange,
  maxAmount = 10000,
  minAmount = 1,
  className,
}: AmountInputProps) {
  const [activeCurrency, setActiveCurrency] = useState<"USD" | "ETB">("USD");
  const [displayValue, setDisplayValue] = useState(sendAmount);

  const effectiveRate = exchangeRate
    ? exchangeRate.rate + (exchangeRate.bonusRate || 0)
    : 0;

  const calculateReceiveAmount = useCallback(
    (usdAmount: string): string => {
      const amount = parseFloat(usdAmount) || 0;
      if (amount === 0 || !effectiveRate) return "";
      return (amount * effectiveRate).toFixed(2);
    },
    [effectiveRate],
  );

  const calculateSendAmount = useCallback(
    (etbAmount: string): string => {
      const amount = parseFloat(etbAmount) || 0;
      if (amount === 0 || !effectiveRate) return "";
      return (amount / effectiveRate).toFixed(2);
    },
    [effectiveRate],
  );

  useEffect(() => {
    setDisplayValue(activeCurrency === "USD" ? sendAmount : receiveAmount);
  }, [sendAmount, receiveAmount, activeCurrency]);

  const handleKeyPress = (key: string) => {
    let newValue = displayValue;

    if (key === "delete") {
      newValue = displayValue.slice(0, -1);
    } else if (key === "." && !displayValue.includes(".")) {
      newValue = displayValue + ".";
    } else if (key !== ".") {
      // Limit decimal places to 2
      const parts = displayValue.split(".");
      if (parts[1] && parts[1].length >= 2) {
        return;
      }
      // If pressing a number and value is 0, replace the 0 unless it's "0."
      if (newValue.length === 1 && newValue === "0" && key !== ".") {
        newValue = key;
      } else {
        newValue = displayValue + key;
      }
    }

    setDisplayValue(newValue);

    if (activeCurrency === "USD") {
      const numValue = parseFloat(newValue) || 0;
      if (numValue <= maxAmount) {
        onAmountChange(newValue, calculateReceiveAmount(newValue));
      } else {
        onAmountChange(newValue, "0"); // still update but triggers error below
      }
    } else {
      const sendVal = calculateSendAmount(newValue);
      const numValue = parseFloat(sendVal) || 0;
      if (numValue <= maxAmount) {
        onAmountChange(sendVal, newValue);
      } else {
        onAmountChange(sendVal, newValue);
      }
    }
  };

  const handleQuickAmount = (amount: number) => {
    const amountStr = amount.toString();
    setDisplayValue(amountStr);
    setActiveCurrency("USD");
    onAmountChange(amountStr, calculateReceiveAmount(amountStr));
  };

  const keys = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    [".", "0", "delete"],
  ];

  const sendValue = parseFloat(sendAmount) || 0;
  // We determine over limit based on the typed value
  const activeValue = parseFloat(displayValue) || 0;
  const isOverLimit =
    activeCurrency === "USD" ? activeValue > maxAmount : sendValue > maxAmount;
  const isUnderLimit = sendValue > 0 && sendValue < minAmount;

  return (
    <div className={cn("space-y-6", className)}>
      <div className="space-y-3 relative z-10">
        {/* Send Amount */}
        <AntCard
          className={cn(
            "cursor-pointer transition-all duration-300 rounded-[1.5rem] border-border/40 bg-background/60 backdrop-blur-md shadow-lg",
            activeCurrency === "USD"
              ? "ring-2 ring-primary scale-[1.02] shadow-primary/20"
              : "hover:bg-muted/30 opacity-80 scale-100",
          )}
          onClick={() => setActiveCurrency("USD")}
          styles={{ body: { padding: "1rem 1.25rem" } }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                You send
              </p>
              <div className="flex items-center gap-1">
                <DollarSign className="h-5 w-5 text-primary opacity-80" />
                <span
                  className={cn(
                    "text-3xl font-black tracking-tight",
                    isOverLimit ? "text-destructive" : "text-foreground",
                  )}
                >
                  {activeCurrency === "USD"
                    ? displayValue || "0"
                    : sendAmount || "0"}
                </span>
                <span className="text-lg font-bold text-muted-foreground ml-1">
                  USD
                </span>
              </div>
            </div>
          </div>
        </AntCard>

        {/* Arrow (Floating overlay) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background border border-border shadow-md">
            <ArrowDown className="h-4 w-4 text-primary" />
          </div>
        </div>

        {/* Receive Amount */}
        <AntCard
          className={cn(
            "cursor-pointer transition-all duration-300 rounded-[1.5rem] border-border/40 bg-background/60 backdrop-blur-md shadow-lg",
            activeCurrency === "ETB"
              ? "ring-2 ring-secondary scale-[1.02] shadow-secondary/20"
              : "hover:bg-muted/30 opacity-80 scale-100",
          )}
          onClick={() => setActiveCurrency("ETB")}
          styles={{ body: { padding: "1rem 1.25rem" } }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                They receive
              </p>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-black tracking-tight text-foreground">
                  {activeCurrency === "ETB"
                    ? displayValue || "0"
                    : receiveAmount
                      ? parseFloat(receiveAmount).toLocaleString()
                      : "0"}
                </span>
                <span className="text-lg font-bold text-muted-foreground ml-1">
                  ETB
                </span>
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10">
              <span className="text-xl font-bold text-secondary">ብ</span>
            </div>
          </div>
        </AntCard>
      </div>

      {/* Exchange Rate Info */}
      {exchangeRate && (
        <div className="rounded-xl flex items-center justify-center gap-2 bg-primary/5 border border-primary/10 p-3 text-sm">
          <span className="text-muted-foreground font-medium">
            Exchange Rate:
          </span>
          <span className="font-bold text-primary">
            1 USD = {effectiveRate.toFixed(2)} ETB
          </span>
        </div>
      )}

      {/* Error Messages */}
      {isOverLimit && (
        <p className="text-center text-sm font-semibold text-destructive animate-in slide-in-from-top-2">
          Maximum amount is ${maxAmount.toLocaleString()}
        </p>
      )}
      {isUnderLimit && (
        <p className="text-center text-sm font-semibold text-destructive animate-in slide-in-from-top-2">
          Minimum amount is ${minAmount}
        </p>
      )}

      <div className="flex flex-col gap-4">
        {/* Quick Amount Pills */}
        <div className="flex justify-center gap-3">
          {[50, 100, 200, 500].map((amount) => (
            <AntButton
              key={amount}
              type="default"
              shape="round"
              size="middle"
              onClick={() => handleQuickAmount(amount)}
              className="font-bold text-muted-foreground hover:text-primary hover:border-primary transition-colors bg-background"
            >
              ${amount}
            </AntButton>
          ))}
        </div>

        {/* Custom Dial Pad */}
        <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto w-full px-4">
          {keys.flat().map((key) => (
            <div key={key} className="flex justify-center">
              <button
                type="button"
                className={cn(
                  "flex items-center justify-center w-[72px] h-[72px] rounded-full text-2xl font-semibold transition-all duration-200 select-none",
                  "bg-background border border-border/40 shadow-sm",
                  "hover:bg-primary/5 hover:border-primary/30",
                  "active:bg-primary/20 active:scale-90",
                )}
                onClick={() => handleKeyPress(key)}
              >
                {key === "delete" ? (
                  <Delete className="h-6 w-6 text-foreground/80" />
                ) : (
                  <span className="text-foreground">{key}</span>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
