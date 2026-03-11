"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TransactionStatus, KYCStatus } from "@/types";
import {
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  Ban,
  AlertCircle,
} from "lucide-react";

interface StatusBadgeProps {
  status: TransactionStatus | KYCStatus;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

const statusConfig: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    className: string;
    icon: React.ElementType;
  }
> = {
  pending: {
    label: "Pending",
    variant: "secondary",
    className:
      "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-500/10 dark:text-amber-500 dark:border-amber-500/20",
    icon: Clock,
  },
  processing: {
    label: "Processing",
    variant: "secondary",
    className:
      "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-500/10 dark:text-blue-500 dark:border-blue-500/20",
    icon: Loader2,
  },
  completed: {
    label: "Completed",
    variant: "default",
    className:
      "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-500 dark:border-emerald-500/20",
    icon: CheckCircle,
  },
  approved: {
    label: "Approved",
    variant: "default",
    className:
      "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-500 dark:border-emerald-500/20",
    icon: CheckCircle,
  },
  failed: {
    label: "Failed",
    variant: "destructive",
    className:
      "bg-red-100 text-red-800 border-red-200 dark:bg-red-500/10 dark:text-red-500 dark:border-red-500/20",
    icon: XCircle,
  },
  rejected: {
    label: "Rejected",
    variant: "destructive",
    className:
      "bg-red-100 text-red-800 border-red-200 dark:bg-red-500/10 dark:text-red-500 dark:border-red-500/20",
    icon: XCircle,
  },
  cancelled: {
    label: "Cancelled",
    variant: "outline",
    className:
      "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
    icon: Ban,
  },
  not_submitted: {
    label: "Not Submitted",
    variant: "outline",
    className:
      "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-500 dark:border-gray-700",
    icon: Clock,
  },
  incomplete: {
    label: "Incomplete",
    variant: "secondary",
    className:
      "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-500/10 dark:text-amber-500 dark:border-amber-500/20",
    icon: AlertCircle,
  },
};

export function StatusBadge({
  status,
  size = "md",
  showIcon = true,
  className,
}: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <Badge
      variant={config.variant}
      className={cn(
        "font-medium border",
        config.className,
        size === "sm" && "text-xs px-2 py-0.5",
        size === "md" && "text-xs px-2.5 py-1",
        size === "lg" && "text-sm px-3 py-1.5",
        className,
      )}
    >
      {showIcon && (
        <Icon
          className={cn(
            "mr-1",
            size === "sm" && "h-3 w-3",
            size === "md" && "h-3.5 w-3.5",
            size === "lg" && "h-4 w-4",
            status === "processing" && "animate-spin",
          )}
        />
      )}
      {config.label}
    </Badge>
  );
}
