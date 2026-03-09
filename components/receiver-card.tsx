'use client';

import { User, Building2, ChevronRight, MoreHorizontal, Trash2, Edit } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { Receiver } from '@/types';

interface ReceiverCardProps {
  receiver: Receiver;
  selected?: boolean;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
  className?: string;
}

export function ReceiverCard({
  receiver,
  selected = false,
  onClick,
  onEdit,
  onDelete,
  showActions = false,
  className,
}: ReceiverCardProps) {
  return (
    <Card
      className={cn(
        'cursor-pointer transition-all',
        selected
          ? 'border-primary bg-primary/5 shadow-md'
          : 'hover:border-primary/20 hover:shadow-sm',
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className={cn(
              'flex h-12 w-12 shrink-0 items-center justify-center rounded-full',
              selected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            )}>
              <User className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-foreground truncate">
                {receiver.fullName}
              </p>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Building2 className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{receiver.bankName}</span>
              </div>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                ****{receiver.accountNumber.slice(-4)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {showActions && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit?.(); }}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <ChevronRight className={cn(
              'h-5 w-5 transition-colors',
              selected ? 'text-primary' : 'text-muted-foreground'
            )} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
