"use client";

import { useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { DollarSign, ArrowDown, Delete, TrendingUp } from "lucide-react";
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
            "group cursor-pointer transition-all duration-500 rounded-[2rem] border-border/40 bg-background/40 backdrop-blur-xl shadow-2xl",
            activeCurrency === "USD"
              ? "ring-2 ring-primary/40 scale-[1.03] shadow-primary/20 bg-primary/[0.03]"
              : "hover:bg-muted/30 opacity-70 scale-[0.98] grayscale-[0.2]",
          )}
          onClick={() => setActiveCurrency("USD")}
          styles={{ body: { padding: "1.25rem 1.5rem" } }}
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80">
                You send
              </p>
              <div className="flex items-baseline gap-2">
                <span
                  className={cn(
                    "text-4xl font-black tracking-tight transition-colors duration-300",
                    isOverLimit ? "text-destructive" : "text-foreground",
                  )}
                >
                  <span className="text-2xl font-bold opacity-40 mr-1">$</span>
                  {activeCurrency === "USD"
                    ? displayValue || "0"
                    : sendAmount || "0"}
                </span>
                <span className="text-sm font-black text-primary/60">USD</span>
              </div>
            </div>
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-500",
                activeCurrency === "USD"
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 rotate-0"
                  : "bg-muted text-muted-foreground rotate-12 opacity-50",
              )}
            >
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
        </AntCard>

        {/* Arrow (Floating overlay) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-background border-4 border-muted shadow-xl group-hover:scale-110 transition-transform duration-500">
            <ArrowDown className="h-5 w-5 text-primary animate-bounce-subtle" />
          </div>
        </div>

        {/* Receive Amount */}
        <AntCard
          className={cn(
            "group cursor-pointer transition-all duration-500 rounded-[2rem] border-border/40 bg-background/40 backdrop-blur-xl shadow-2xl",
            activeCurrency === "ETB"
              ? "ring-2 ring-secondary/40 scale-[1.03] shadow-secondary/20 bg-secondary/[0.03]"
              : "hover:bg-muted/30 opacity-70 scale-[0.98] grayscale-[0.2]",
          )}
          onClick={() => setActiveCurrency("ETB")}
          styles={{ body: { padding: "1.25rem 1.5rem" } }}
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80">
                They receive
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black tracking-tight text-foreground transition-colors duration-300">
                  {activeCurrency === "ETB"
                    ? displayValue || "0"
                    : receiveAmount
                      ? parseFloat(receiveAmount).toLocaleString()
                      : "0"}
                </span>
                <span className="text-sm font-black text-secondary/60">
                  ETB
                </span>
              </div>
            </div>
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-500",
                activeCurrency === "ETB"
                  ? "bg-secondary text-secondary-foreground shadow-lg shadow-secondary/30 rotate-0"
                  : "bg-muted text-muted-foreground -rotate-12 opacity-50",
              )}
            >
              <span className="text-2xl font-black">ብ</span>
            </div>
          </div>
        </AntCard>
      </div>

      {/* Exchange Rate Info */}
      {exchangeRate && (
        <div className="rounded-2xl flex items-center justify-center gap-3 bg-primary/5 border border-primary/10 p-4 text-sm backdrop-blur-sm animate-in fade-in zoom-in duration-500">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 leading-none mb-1">
              Guaranteed Rate
            </span>
            <span className="font-black text-foreground">
              1 USD ={" "}
              <span className="text-primary">{effectiveRate.toFixed(2)}</span>{" "}
              ETB
            </span>
          </div>
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
        <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto w-full px-4">
          {keys.flat().map((key) => (
            <div key={key} className="flex justify-center">
              <button
                type="button"
                className={cn(
                  "group relative flex items-center justify-center w-[76px] h-[76px] rounded-3xl text-2xl font-bold transition-all duration-300 select-none overflow-hidden",
                  "bg-background/40 backdrop-blur-xl border border-border/40 shadow-[0_4px_12px_rgba(0,0,0,0.05)]",
                  "hover:bg-primary/5 hover:border-primary/30 hover:shadow-primary/10 hover:-translate-y-1",
                  "active:bg-primary/20 active:scale-90 active:duration-75",
                  key === "delete" &&
                    "bg-destructive/[0.02] hover:bg-destructive/5 hover:border-destructive/20",
                )}
                onClick={() => handleKeyPress(key)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                {key === "delete" ? (
                  <Delete className="h-7 w-7 text-foreground/80 group-active:text-destructive transition-colors" />
                ) : (
                  <span className="text-foreground group-active:text-primary transition-colors">
                    {key}
                  </span>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
