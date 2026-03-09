'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { DollarSign, ArrowDown, Delete } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { ExchangeRate } from '@/types';

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
  const [activeCurrency, setActiveCurrency] = useState<'USD' | 'ETB'>('USD');
  const [displayValue, setDisplayValue] = useState(sendAmount);

  const effectiveRate = exchangeRate ? exchangeRate.rate + (exchangeRate.bonusRate || 0) : 0;

  const calculateReceiveAmount = useCallback((usdAmount: string): string => {
    const amount = parseFloat(usdAmount) || 0;
    if (amount === 0 || !effectiveRate) return '';
    return (amount * effectiveRate).toFixed(2);
  }, [effectiveRate]);

  const calculateSendAmount = useCallback((etbAmount: string): string => {
    const amount = parseFloat(etbAmount) || 0;
    if (amount === 0 || !effectiveRate) return '';
    return (amount / effectiveRate).toFixed(2);
  }, [effectiveRate]);

  useEffect(() => {
    setDisplayValue(activeCurrency === 'USD' ? sendAmount : receiveAmount);
  }, [sendAmount, receiveAmount, activeCurrency]);

  const handleKeyPress = (key: string) => {
    let newValue = displayValue;

    if (key === 'delete') {
      newValue = displayValue.slice(0, -1);
    } else if (key === '.' && !displayValue.includes('.')) {
      newValue = displayValue + '.';
    } else if (key !== '.') {
      // Limit decimal places to 2
      const parts = displayValue.split('.');
      if (parts[1] && parts[1].length >= 2) {
        return;
      }
      newValue = displayValue + key;
    }

    setDisplayValue(newValue);
    
    if (activeCurrency === 'USD') {
      const numValue = parseFloat(newValue) || 0;
      if (numValue <= maxAmount) {
        onAmountChange(newValue, calculateReceiveAmount(newValue));
      }
    } else {
      const sendVal = calculateSendAmount(newValue);
      const numValue = parseFloat(sendVal) || 0;
      if (numValue <= maxAmount) {
        onAmountChange(sendVal, newValue);
      }
    }
  };

  const handleQuickAmount = (amount: number) => {
    const amountStr = amount.toString();
    setDisplayValue(amountStr);
    setActiveCurrency('USD');
    onAmountChange(amountStr, calculateReceiveAmount(amountStr));
  };

  const keys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['.', '0', 'delete'],
  ];

  const sendValue = parseFloat(sendAmount) || 0;
  const isOverLimit = sendValue > maxAmount;
  const isUnderLimit = sendValue > 0 && sendValue < minAmount;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Amount Cards */}
      <div className="space-y-3">
        {/* Send Amount */}
        <Card 
          className={cn(
            'cursor-pointer transition-all',
            activeCurrency === 'USD' && 'ring-2 ring-primary'
          )}
          onClick={() => setActiveCurrency('USD')}
        >
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm text-muted-foreground">You send</p>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <span className={cn(
                  'text-2xl font-bold',
                  isOverLimit && 'text-destructive'
                )}>
                  {sendAmount || '0'}
                </span>
                <span className="text-lg font-medium text-muted-foreground">USD</span>
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <span className="text-lg font-bold text-primary">$</span>
            </div>
          </CardContent>
        </Card>

        {/* Arrow */}
        <div className="flex justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            <ArrowDown className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>

        {/* Receive Amount */}
        <Card 
          className={cn(
            'cursor-pointer transition-all',
            activeCurrency === 'ETB' && 'ring-2 ring-primary'
          )}
          onClick={() => setActiveCurrency('ETB')}
        >
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm text-muted-foreground">They receive</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {receiveAmount ? parseFloat(receiveAmount).toLocaleString() : '0'}
                </span>
                <span className="text-lg font-medium text-muted-foreground">ETB</span>
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10">
              <span className="text-lg font-bold text-secondary">ብ</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exchange Rate Info */}
      {exchangeRate && (
        <div className="rounded-lg bg-muted/50 p-3 text-center text-sm">
          <span className="text-muted-foreground">1 USD = </span>
          <span className="font-semibold text-foreground">{effectiveRate.toFixed(2)} ETB</span>
          {exchangeRate.bonusRate && exchangeRate.bonusRate > 0 && (
            <span className="ml-2 text-xs text-primary">(+{exchangeRate.bonusRate.toFixed(2)} bonus)</span>
          )}
        </div>
      )}

      {/* Error Messages */}
      {isOverLimit && (
        <p className="text-center text-sm text-destructive">
          Maximum amount is ${maxAmount.toLocaleString()}
        </p>
      )}
      {isUnderLimit && (
        <p className="text-center text-sm text-destructive">
          Minimum amount is ${minAmount}
        </p>
      )}

      {/* Numeric Keypad */}
      <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
        {keys.flat().map((key) => (
          <Button
            key={key}
            type="button"
            variant="outline"
            className={cn(
              'h-12 text-lg font-semibold transition-all',
              'hover:bg-primary hover:text-primary-foreground hover:border-primary',
              'active:scale-95'
            )}
            onClick={() => handleKeyPress(key)}
          >
            {key === 'delete' ? (
              <Delete className="h-5 w-5" />
            ) : (
              key
            )}
          </Button>
        ))}
      </div>

      {/* Quick Amount Buttons */}
      <div className="flex flex-wrap justify-center gap-2">
        {[50, 100, 200, 500].map((amount) => (
          <Button
            key={amount}
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => handleQuickAmount(amount)}
            className="min-w-[60px]"
          >
            ${amount}
          </Button>
        ))}
      </div>
    </div>
  );
}
