"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Calendar,
  Info,
} from "lucide-react";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useExchangeRate } from "@/lib/store";
import { useLocale } from "@/hooks/use-locale";
import { mockRateHistory, mockExchangeRate } from "@/lib/mock";
import type { ExchangeRateHistory } from "@/types";

export default function RatesPage() {
  const { t } = useLocale();
  const { currentRate, refreshRate } = useExchangeRate();
  const [rateHistory, setRateHistory] = useState<ExchangeRateHistory[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<"7d" | "30d">("30d");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setRateHistory(mockRateHistory);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    refreshRate();
    setIsRefreshing(false);
  };

  const filteredHistory =
    selectedPeriod === "7d" ? rateHistory.slice(-7) : rateHistory;

  const chartData = filteredHistory.map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    rate: parseFloat(item.rate.toFixed(2)),
  }));

  const getStats = () => {
    if (filteredHistory.length === 0) return null;
    const rates = filteredHistory.map((h) => h.rate);
    const min = Math.min(...rates);
    const max = Math.max(...rates);
    const avg = rates.reduce((a, b) => a + b, 0) / rates.length;
    const firstRate = rates[0];
    const lastRate = rates[rates.length - 1];
    const change = lastRate - firstRate;
    const changePercent = ((change / firstRate) * 100).toFixed(2);
    return { min, max, avg, change, changePercent };
  };

  const stats = getStats();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const rate = currentRate || mockExchangeRate;

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/home">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-foreground">
            {t("rates.title")}
          </h1>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw
            className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          {t("common.refresh")}
        </Button>
      </div>

      {/* Current Rate Card */}
      <Card className="mb-6 overflow-hidden bg-gradient-to-br from-primary to-secondary text-primary-foreground">
        <CardContent className="p-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm opacity-90">{t("rates.currentRate")}</span>
            <span className="text-xs opacity-75">
              {new Date().toLocaleDateString()}
            </span>
          </div>
          <div className="mb-4 flex items-baseline gap-2">
            <span className="text-4xl font-bold">
              {rate.effectiveRate.toFixed(2)}
            </span>
            <span className="text-lg opacity-90">ETB</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full bg-white/20 px-3 py-1">
              <span className="text-sm">
                1 USD = {rate.rate.toFixed(2)} ETB
              </span>
            </div>
            {rate.bonusRate && rate.bonusRate > 0 && (
              <div className="flex items-center gap-1 rounded-full bg-white/30 px-3 py-1">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">
                  +{rate.bonusRate.toFixed(2)} {t("rates.bonus")}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      {stats && (
        <div className="mb-6 grid grid-cols-4 gap-3">
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-lg font-bold text-foreground">
                {stats.min.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">{t("rates.low")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-lg font-bold text-foreground">
                {stats.max.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">{t("rates.high")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-lg font-bold text-foreground">
                {stats.avg.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("rates.average")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <div className="flex items-center justify-center gap-1">
                {parseFloat(stats.changePercent) >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-success" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-destructive" />
                )}
                <p
                  className={`text-lg font-bold ${
                    parseFloat(stats.changePercent) >= 0
                      ? "text-success"
                      : "text-destructive"
                  }`}
                >
                  {stats.changePercent}%
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                {t("rates.change")}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Period Selector */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-foreground">{t("rates.history")}</h2>
        <div className="flex gap-2">
          <Button
            variant={selectedPeriod === "7d" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPeriod("7d")}
          >
            7 {t("rates.days")}
          </Button>
          <Button
            variant={selectedPeriod === "30d" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPeriod("30d")}
          >
            30 {t("rates.days")}
          </Button>
        </div>
      </div>

      {/* Chart */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <ChartContainer
            config={{
              rate: {
                label: "Exchange Rate",
                color: "#1c5f5d",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1c5f5d" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1c5f5d" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  domain={["dataMin - 0.5", "dataMax + 0.5"]}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => value.toFixed(1)}
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value: number) => [
                    `${value.toFixed(2)} ETB`,
                    "Rate",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="rate"
                  stroke="#1c5f5d"
                  strokeWidth={2}
                  fill="url(#colorRate)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-muted/50">
        <CardContent className="flex items-start gap-3 p-4">
          <Info className="mt-0.5 h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium text-foreground">
              {t("rates.infoTitle")}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("rates.infoDescription")}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
