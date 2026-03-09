"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  BookOpen,
  Stethoscope,
  Leaf,
  AlertTriangle,
  Users,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLocale } from "@/hooks/use-locale";
import { mockDonationCauses } from "@/lib/mock-data";
import type { DonationCause } from "@/types";

export default function DonatePage() {
  const { t } = useLocale();
  const [causes, setCauses] = useState<DonationCause[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setCauses(mockDonationCauses);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const categories = [
    { id: "education", label: t("donate.education"), icon: BookOpen },
    { id: "health", label: t("donate.health"), icon: Stethoscope },
    { id: "environment", label: t("donate.environment"), icon: Leaf },
    { id: "disaster", label: t("donate.disaster"), icon: AlertTriangle },
    { id: "community", label: t("donate.community"), icon: Users },
  ];

  const filteredCauses = selectedCategory
    ? causes.filter((c) => c.category === selectedCategory)
    : causes;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "education":
        return <BookOpen className="h-5 w-5" />;
      case "health":
        return <Stethoscope className="h-5 w-5" />;
      case "environment":
        return <Leaf className="h-5 w-5" />;
      case "disaster":
        return <AlertTriangle className="h-5 w-5" />;
      case "community":
        return <Users className="h-5 w-5" />;
      default:
        return <Heart className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "education":
        return "bg-blue-500/10 text-blue-500";
      case "health":
        return "bg-red-500/10 text-red-500";
      case "environment":
        return "bg-green-500/10 text-green-500";
      case "disaster":
        return "bg-orange-500/10 text-orange-500";
      case "community":
        return "bg-purple-500/10 text-purple-500";
      default:
        return "bg-primary/10 text-primary";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Link href="/home">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-foreground">{t("donate.title")}</h1>
      </div>

      {/* Hero Section */}
      <Card className="mb-6 overflow-hidden bg-gradient-to-br from-red-500 to-pink-600 text-white">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
              <Heart className="h-8 w-8" />
            </div>
          </div>
          <h2 className="mb-2 text-center text-lg font-semibold">
            {t("donate.heroTitle")}
          </h2>
          <p className="mb-4 text-center text-sm opacity-90">
            {t("donate.heroDescription")}
          </p>
        </CardContent>
      </Card>

      {/* Categories */}
      <div className="mb-6">
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">
          {t("donate.categories")}
        </h3>
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            {t("donate.all")}
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              size="sm"
              className="gap-2"
              onClick={() => setSelectedCategory(cat.id)}
            >
              <cat.icon className="h-4 w-4" />
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Causes */}
      <div className="space-y-4">
        {filteredCauses.map((cause) => {
          const progress = (cause.raisedAmount / cause.targetAmount) * 100;
          return (
            <Link key={cause.id} href={`/donate/${cause.id}`}>
              <Card className="overflow-hidden transition-all hover:border-primary hover:shadow-md">
                <CardContent className="p-0">
                  <div className="flex h-32 items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                    <div className={`rounded-full p-6 ${getCategoryColor(cause.category)}`}>
                      {getCategoryIcon(cause.category)}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${getCategoryColor(
                          cause.category
                        )}`}
                      >
                        {cause.category}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {cause.organizationName}
                      </span>
                    </div>
                    <h3 className="mb-1 font-semibold text-foreground">{cause.name}</h3>
                    <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                      {cause.description}
                    </p>
                    <div className="mb-2">
                      <Progress value={progress} className="h-2" />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        <span className="font-semibold text-foreground">
                          {formatCurrency(cause.raisedAmount)}
                        </span>{" "}
                        {t("donate.raised")}
                      </span>
                      <span className="text-muted-foreground">
                        {t("donate.goal")}: {formatCurrency(cause.targetAmount)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
