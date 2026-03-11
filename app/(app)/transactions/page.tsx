"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Filter,
  Download,
  ChevronDown,
  Calendar,
  X,
} from "lucide-react";
import {
  Pagination as AntPagination,
  Button as AntButton,
  Card as AntCard,
  Input as AntInput,
  Typography,
} from "antd";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { TransactionCard } from "@/components/transaction-card";
import { useLocale } from "@/hooks/use-locale";
import { mockTransactions } from "@/lib/mock";
import type { Transaction, TransactionStatus } from "@/types";
import { toast } from "sonner";

const { Text, Title } = Typography;

export default function TransactionsPage() {
  const { t } = useLocale();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | "all">(
    "all",
  );
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState(0);

  useEffect(() => {
    const loadTransactions = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setTransactions(mockTransactions);
      setFilteredTransactions(mockTransactions);
      setIsLoading(false);
    };
    loadTransactions();
  }, []);

  useEffect(() => {
    let filtered = transactions;

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((tx) => tx.status === statusFilter);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (tx) =>
          tx.receiverName.toLowerCase().includes(query) ||
          tx.referenceNumber.toLowerCase().includes(query),
      );
    }

    // Apply date range filter
    if (dateFrom) {
      filtered = filtered.filter(
        (tx) => new Date(tx.createdAt) >= new Date(dateFrom),
      );
    }
    if (dateTo) {
      filtered = filtered.filter(
        (tx) => new Date(tx.createdAt) <= new Date(dateTo + "T23:59:59"),
      );
    }

    setFilteredTransactions(filtered);

    // Count active filters
    let count = 0;
    if (statusFilter !== "all") count++;
    if (dateFrom) count++;
    if (dateTo) count++;
    setActiveFilters(count);
  }, [transactions, statusFilter, searchQuery, dateFrom, dateTo]);

  const statusOptions: Array<{
    value: TransactionStatus | "all";
    label: string;
  }> = [
    { value: "all", label: t("transactions.allStatuses") },
    { value: "completed", label: t("transactions.status.completed") },
    { value: "pending", label: t("transactions.status.pending") },
    { value: "processing", label: t("transactions.status.processing") },
    { value: "failed", label: t("transactions.status.failed") },
    { value: "cancelled", label: t("transactions.status.cancelled") },
  ];

  const getStatusStats = () => {
    return {
      total: transactions.length,
      completed: transactions.filter((tx) => tx.status === "completed").length,
      pending: transactions.filter((tx) => tx.status === "pending").length,
      processing: transactions.filter((tx) => tx.status === "processing")
        .length,
    };
  };

  const clearFilters = () => {
    setStatusFilter("all");
    setDateFrom("");
    setDateTo("");
    setSearchQuery("");
  };

  const exportTransactions = () => {
    const csvContent = [
      [
        "Reference",
        "Date",
        "Receiver",
        "Amount USD",
        "Amount ETB",
        "Fee",
        "Status",
      ],
      ...filteredTransactions.map((tx) => [
        tx.referenceNumber,
        new Date(tx.createdAt).toLocaleDateString(),
        tx.receiverName,
        tx.amountUSD.toFixed(2),
        tx.amountETB.toFixed(2),
        tx.fee.toFixed(2),
        tx.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(t("transactions.exported"));
  };

  const stats = getStatusStats();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/home">
            <AntButton
              type="text"
              icon={<ArrowLeft className="h-5 w-5" />}
              className="flex items-center justify-center"
            />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {t("transactions.title")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {filteredTransactions.length} {t("transactions.subtitle")}
            </p>
          </div>
        </div>
        <AntButton
          type="default"
          size="small"
          className="gap-2"
          onClick={exportTransactions}
          icon={<Download className="h-4 w-4" />}
        >
          {t("transactions.export")}
        </AntButton>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-4 gap-3">
        <AntCard className="bg-card">
          <div className="p-1 text-center">
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            <p className="text-xs text-muted-foreground">
              {t("transactions.total")}
            </p>
          </div>
        </AntCard>
        <AntCard className="bg-success/10 border-success/20">
          <div className="p-1 text-center">
            <p className="text-2xl font-bold text-success">{stats.completed}</p>
            <p className="text-xs text-muted-foreground">
              {t("transactions.completed")}
            </p>
          </div>
        </AntCard>
        <AntCard className="bg-warning/10 border-warning/20">
          <div className="p-1 text-center">
            <p className="text-2xl font-bold text-warning">{stats.pending}</p>
            <p className="text-xs text-muted-foreground">
              {t("transactions.pending")}
            </p>
          </div>
        </AntCard>
        <AntCard className="bg-primary/10 border-primary/20">
          <div className="p-1 text-center">
            <p className="text-2xl font-bold text-primary">
              {stats.processing}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("transactions.processing")}
            </p>
          </div>
        </AntCard>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <AntInput
            placeholder={t("transactions.search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10"
          />
        </div>

        {/* Status Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              {statusFilter === "all"
                ? t("transactions.status.title")
                : statusFilter}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>
              {t("transactions.filterByStatus")}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {statusOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => setStatusFilter(option.value)}
                className={statusFilter === option.value ? "bg-accent" : ""}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Advanced Filters Sheet */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="relative gap-2">
              <Filter className="h-4 w-4" />
              {t("transactions.filters")}
              {activeFilters > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {activeFilters}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{t("transactions.advancedFilters")}</SheetTitle>
              <SheetDescription>
                {t("transactions.filterDescription")}
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              {/* Status Filter */}
              <div className="space-y-2">
                <Label>{t("transactions.status.title")}</Label>
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as TransactionStatus | "all")
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Range */}
              <div className="space-y-4">
                <Label>{t("transactions.dateRange")}</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      {t("transactions.from")}
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      {t("transactions.to")}
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Date Presets */}
              <div className="space-y-2">
                <Label>{t("transactions.quickSelect")}</Label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const today = new Date();
                      const weekAgo = new Date(today);
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      setDateFrom(weekAgo.toISOString().split("T")[0]);
                      setDateTo(today.toISOString().split("T")[0]);
                    }}
                  >
                    {t("transactions.last7Days")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const today = new Date();
                      const monthAgo = new Date(today);
                      monthAgo.setMonth(monthAgo.getMonth() - 1);
                      setDateFrom(monthAgo.toISOString().split("T")[0]);
                      setDateTo(today.toISOString().split("T")[0]);
                    }}
                  >
                    {t("transactions.last30Days")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const today = new Date();
                      const threeMonthsAgo = new Date(today);
                      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
                      setDateFrom(threeMonthsAgo.toISOString().split("T")[0]);
                      setDateTo(today.toISOString().split("T")[0]);
                    }}
                  >
                    {t("transactions.last3Months")}
                  </Button>
                </div>
              </div>
            </div>
            <SheetFooter className="mt-8">
              <Button variant="outline" onClick={clearFilters}>
                {t("transactions.clearFilters")}
              </Button>
              <SheetClose asChild>
                <Button>{t("transactions.applyFilters")}</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {/* Active Filters */}
      {activeFilters > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {t("transactions.activeFilters")}:
          </span>
          {statusFilter !== "all" && (
            <span className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
              {statusFilter}
              <button onClick={() => setStatusFilter("all")}>
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {dateFrom && (
            <span className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
              {t("transactions.from")}: {dateFrom}
              <button onClick={() => setDateFrom("")}>
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {dateTo && (
            <span className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
              {t("transactions.to")}: {dateTo}
              <button onClick={() => setDateTo("")}>
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          <button
            onClick={clearFilters}
            className="text-xs text-muted-foreground underline hover:text-foreground"
          >
            {t("transactions.clearAll")}
          </button>
        </div>
      )}

      {/* Transactions List */}
      <div className="space-y-3">
        {filteredTransactions.length > 0 ? (
          <>
            {filteredTransactions.map((tx) => (
              <Link key={tx.id} href={`/transactions/${tx.id}`}>
                <TransactionCard transaction={tx} />
              </Link>
            ))}

            <div className="mt-12 flex justify-center pb-8 text-center">
              <AntPagination
                defaultCurrent={1}
                total={filteredTransactions.length > 0 ? 50 : 0}
                pageSize={10}
                showSizeChanger={false}
                className="premium-pagination px-6 py-4 bg-background/60 backdrop-blur-xl border border-border/40 rounded-3xl shadow-lg inline-block"
              />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">
                {t("transactions.noResults")}
              </p>
              <p className="text-sm text-muted-foreground">
                {searchQuery || activeFilters > 0
                  ? t("transactions.noResultsFiltered")
                  : t("transactions.noTransactions")}
              </p>
            </div>
            {(searchQuery || activeFilters > 0) && (
              <Button variant="outline" onClick={clearFilters}>
                {t("transactions.clearFilters")}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
