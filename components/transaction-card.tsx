'use client';

import { ArrowUpRight, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/status-badge';
import { cn } from '@/lib/utils';
import type { Transaction } from '@/types';

interface TransactionCardProps {
  transaction: Transaction;
  onClick?: () => void;
  className?: string;
}

export function TransactionCard({ transaction, onClick, className }: TransactionCardProps) {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(transaction.createdAt));

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:shadow-md hover:border-primary/20',
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-foreground truncate">
                {transaction.receiver.fullName}
              </p>
              <p className="text-sm text-muted-foreground truncate">
                {transaction.receiver.bankName}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1 text-primary font-semibold">
              <ArrowUpRight className="h-4 w-4" />
              <span>${transaction.amountUSD.toFixed(2)}</span>
            </div>
            <StatusBadge status={transaction.status} size="sm" />
          </div>
        </div>
        
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
          <span>{formattedDate}</span>
          <span className="font-mono">{transaction.referenceNumber}</span>
        </div>
      </CardContent>
    </Card>
  );
}
