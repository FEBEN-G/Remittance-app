'use client';

import { TrendingUp, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { ExchangeRate } from '@/types';

interface ExchangeRateCardProps {
  rate: ExchangeRate;
  isLoading?: boolean;
  showBonus?: boolean;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ExchangeRateCard({
  rate,
  isLoading = false,
  showBonus = true,
  showDetails = false,
  size = 'md',
  className,
}: ExchangeRateCardProps) {
  const effectiveRate = rate.rate + (rate.bonusRate || 0);

  if (isLoading) {
    return (
      <Card className={cn('bg-primary text-primary-foreground', className)}>
        <CardContent className={cn('p-4', size === 'lg' && 'p-6')}>
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-4 w-24 bg-primary-foreground/20" />
              <Skeleton className="h-8 w-32 mt-2 bg-primary-foreground/20" />
            </div>
            <Skeleton className="h-10 w-10 rounded-full bg-primary-foreground/20" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('bg-primary text-primary-foreground overflow-hidden', className)}>
      <CardContent className={cn('p-4 relative', size === 'lg' && 'p-6')}>
        {/* Background decoration */}
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-secondary/20" />
        <div className="absolute -right-4 -bottom-8 h-24 w-24 rounded-full bg-accent/20" />
        
        <div className="relative flex items-center justify-between">
          <div>
            <p className={cn(
              'text-primary-foreground/80 font-medium',
              size === 'sm' && 'text-xs',
              size === 'md' && 'text-sm',
              size === 'lg' && 'text-base'
            )}>
              {"Today's Rate"}
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={cn(
                'font-bold',
                size === 'sm' && 'text-xl',
                size === 'md' && 'text-2xl',
                size === 'lg' && 'text-4xl'
              )}>
                1 USD = {effectiveRate.toFixed(2)} ETB
              </span>
            </div>
            {showBonus && rate.bonusRate && rate.bonusRate > 0 && (
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className={cn(
                  size === 'sm' && 'h-3 w-3',
                  size === 'md' && 'h-4 w-4',
                  size === 'lg' && 'h-5 w-5'
                )} />
                <span className={cn(
                  'font-medium text-accent',
                  size === 'sm' && 'text-xs',
                  size === 'md' && 'text-sm',
                  size === 'lg' && 'text-base'
                )}>
                  +{rate.bonusRate?.toFixed(2)} bonus rate
                </span>
              </div>
            )}
          </div>
          <div className={cn(
            'flex items-center justify-center rounded-full bg-primary-foreground/10',
            size === 'sm' && 'h-10 w-10',
            size === 'md' && 'h-12 w-12',
            size === 'lg' && 'h-16 w-16'
          )}>
            <RefreshCw className={cn(
              size === 'sm' && 'h-5 w-5',
              size === 'md' && 'h-6 w-6',
              size === 'lg' && 'h-8 w-8'
            )} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
