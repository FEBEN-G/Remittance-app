'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { TransactionDetails, TransactionSummary as TransactionSummaryType, Receiver } from '@/types';
import { User, Building2, ArrowRight, TrendingUp } from 'lucide-react';

// Props for TransactionDetails (from send flow)
interface TransactionSummaryProps {
  details: TransactionDetails;
  className?: string;
}

export function TransactionSummary({
  details,
  className,
}: TransactionSummaryProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="bg-primary/5 pb-4">
        <CardTitle className="text-lg">Transaction Summary</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Receiver Info */}
        <div className="p-4">
          <p className="text-sm text-muted-foreground mb-2">Sending to</p>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">{details.receiver.fullName}</p>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Building2 className="h-3.5 w-3.5" />
                <span>{details.receiver.bankName}</span>
              </div>
            </div>
          </div>
        </div>
        <Separator />

        {/* Amount Details */}
        <div className="p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">You send</span>
            <span className="font-semibold text-lg">${details.sendAmount.toFixed(2)} {details.sendCurrency}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Exchange rate</span>
            <span className="font-medium">1 {details.sendCurrency} = {details.exchangeRate.toFixed(2)} {details.receiveCurrency}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Transfer fee</span>
            <span className="font-medium">${details.fees.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Purpose</span>
            <span className="font-medium capitalize">{details.purpose.replace(/_/g, ' ')}</span>
          </div>
        </div>

        <Separator />

        {/* Total Section */}
        <div className="p-4 bg-muted/30 space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total to pay</span>
            <span className="font-bold text-lg">${details.total.toFixed(2)}</span>
          </div>
          
          <div className="flex items-center justify-center gap-2 py-2">
            <ArrowRight className="h-5 w-5 text-primary" />
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-medium">Receiver gets</span>
            <span className="font-bold text-xl text-primary">
              {details.receiveAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} {details.receiveCurrency}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Props for TransactionSummary type (for other uses)
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
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="bg-primary/5 pb-4">
        <CardTitle className="text-lg">Transaction Summary</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Receiver Info */}
        {showReceiver && receiver && (
          <>
            <div className="p-4">
              <p className="text-sm text-muted-foreground mb-2">Sending to</p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">{receiver.fullName}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Building2 className="h-3.5 w-3.5" />
                    <span>{receiver.bankName}</span>
                  </div>
                </div>
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* Amount Details */}
        <div className="p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">You send</span>
            <span className="font-semibold text-lg">${summary.amountUSD.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Exchange rate</span>
            <div className="text-right">
              <span className="font-medium">1 USD = {summary.exchangeRate.toFixed(2)} ETB</span>
              {summary.bonusRate && summary.bonusRate > 0 && (
                <div className="flex items-center justify-end gap-1 text-sm text-emerald-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>+{summary.bonusRate.toFixed(2)} bonus</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Transfer fee</span>
            <span className="font-medium">${summary.fee.toFixed(2)}</span>
          </div>
        </div>

        <Separator />

        {/* Total Section */}
        <div className="p-4 bg-muted/30 space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total to pay</span>
            <span className="font-bold text-lg">${summary.totalDebit.toFixed(2)}</span>
          </div>
          
          <div className="flex items-center justify-center gap-2 py-2">
            <ArrowRight className="h-5 w-5 text-primary" />
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-medium">Receiver gets</span>
            <span className="font-bold text-xl text-primary">
              {summary.receiverGets.toLocaleString('en-US', { minimumFractionDigits: 2 })} ETB
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
