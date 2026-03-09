"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Gift,
  Heart,
  Cake,
  GraduationCap,
  PartyPopper,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocale } from "@/hooks/use-locale";
import { mockGiftPackages } from "@/lib/mock-data";
import type { GiftPackage } from "@/types";

export default function GiftsPage() {
  const { t } = useLocale();
  const [packages, setPackages] = useState<GiftPackage[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setPackages(mockGiftPackages);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const categories = [
    { id: "birthday", label: t("gifts.birthday"), icon: Cake },
    { id: "wedding", label: t("gifts.wedding"), icon: Heart },
    { id: "graduation", label: t("gifts.graduation"), icon: GraduationCap },
    { id: "holiday", label: t("gifts.holiday"), icon: PartyPopper },
  ];

  const filteredPackages = selectedCategory
    ? packages.filter((p) => p.category === selectedCategory)
    : packages;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "birthday":
        return <Cake className="h-5 w-5" />;
      case "wedding":
        return <Heart className="h-5 w-5" />;
      case "graduation":
        return <GraduationCap className="h-5 w-5" />;
      case "holiday":
        return <PartyPopper className="h-5 w-5" />;
      default:
        return <Gift className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "birthday":
        return "bg-pink-500/10 text-pink-500";
      case "wedding":
        return "bg-red-500/10 text-red-500";
      case "graduation":
        return "bg-blue-500/10 text-blue-500";
      case "holiday":
        return "bg-yellow-500/10 text-yellow-500";
      default:
        return "bg-primary/10 text-primary";
    }
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
        <h1 className="text-xl font-bold text-foreground">{t("gifts.title")}</h1>
      </div>

      {/* Hero Section */}
      <Card className="mb-6 overflow-hidden bg-gradient-to-br from-pink-500 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
              <Gift className="h-8 w-8" />
            </div>
          </div>
          <h2 className="mb-2 text-center text-lg font-semibold">
            {t("gifts.heroTitle")}
          </h2>
          <p className="mb-4 text-center text-sm opacity-90">
            {t("gifts.heroDescription")}
          </p>
        </CardContent>
      </Card>

      {/* Categories */}
      <div className="mb-6">
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">
          {t("gifts.categories")}
        </h3>
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            {t("gifts.all")}
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

      {/* Gift Packages */}
      <div className="space-y-4">
        {filteredPackages.map((pkg) => (
          <Link key={pkg.id} href={`/gifts/send?package=${pkg.id}`}>
            <Card className="overflow-hidden transition-all hover:border-primary hover:shadow-md">
              <CardContent className="p-0">
                <div className="flex">
                  <div className="flex h-28 w-28 flex-shrink-0 items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                    <div className={`rounded-full p-4 ${getCategoryColor(pkg.category)}`}>
                      {getCategoryIcon(pkg.category)}
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col justify-center p-4">
                    <div className="mb-1 flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${getCategoryColor(
                          pkg.category
                        )}`}
                      >
                        {pkg.category}
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground">{pkg.name}</h3>
                    <p className="mb-2 text-xs text-muted-foreground line-clamp-2">
                      {pkg.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        ${pkg.minAmount} - ${pkg.maxAmount}
                      </span>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
