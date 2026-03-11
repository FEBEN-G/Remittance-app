"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Users,
  Target,
  Heart,
  Briefcase,
  GraduationCap,
  AlertCircle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLocale } from "@/hooks/use-locale";
import { mockCrowdfundingCampaigns } from "@/lib/mock";
import type { CrowdfundingCampaign } from "@/types";

export default function CrowdfundingPage() {
  const { t } = useLocale();
  const [campaigns, setCampaigns] = useState<CrowdfundingCampaign[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setCampaigns(mockCrowdfundingCampaigns);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const categories = [
    { id: "medical", label: t("crowdfunding.medical"), icon: Heart },
    { id: "business", label: t("crowdfunding.business"), icon: Briefcase },
    {
      id: "education",
      label: t("crowdfunding.education"),
      icon: GraduationCap,
    },
    { id: "emergency", label: t("crowdfunding.emergency"), icon: AlertCircle },
    { id: "community", label: t("crowdfunding.community"), icon: Users },
  ];

  const filteredCampaigns = selectedCategory
    ? campaigns.filter((c) => c.category === selectedCategory)
    : campaigns;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "medical":
        return <Heart className="h-5 w-5" />;
      case "business":
        return <Briefcase className="h-5 w-5" />;
      case "education":
        return <GraduationCap className="h-5 w-5" />;
      case "emergency":
        return <AlertCircle className="h-5 w-5" />;
      case "community":
        return <Users className="h-5 w-5" />;
      default:
        return <Target className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "medical":
        return "bg-red-500/10 text-red-500";
      case "business":
        return "bg-blue-500/10 text-blue-500";
      case "education":
        return "bg-green-500/10 text-green-500";
      case "emergency":
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

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = Math.ceil(
      (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );
    return diff > 0 ? diff : 0;
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
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/home">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-foreground">
            {t("crowdfunding.title")}
          </h1>
        </div>
        <Link href="/crowdfunding/create">
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            {t("crowdfunding.startCampaign")}
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <Card className="mb-6 overflow-hidden bg-gradient-to-br from-primary to-secondary text-primary-foreground">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
              <Target className="h-8 w-8" />
            </div>
          </div>
          <h2 className="mb-2 text-center text-lg font-semibold">
            {t("crowdfunding.heroTitle")}
          </h2>
          <p className="mb-4 text-center text-sm opacity-90">
            {t("crowdfunding.heroDescription")}
          </p>
        </CardContent>
      </Card>

      {/* Categories */}
      <div className="mb-6">
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">
          {t("crowdfunding.categories")}
        </h3>
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            {t("crowdfunding.all")}
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

      {/* Campaigns */}
      <div className="space-y-4">
        {filteredCampaigns.map((campaign) => {
          const progress =
            (campaign.raisedAmount / campaign.targetAmount) * 100;
          const daysRemaining = getDaysRemaining(campaign.endDate);
          return (
            <Link key={campaign.id} href={`/crowdfunding/${campaign.id}`}>
              <Card className="overflow-hidden transition-all hover:border-primary hover:shadow-md">
                <CardContent className="p-0">
                  <div className="flex h-32 items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                    <div
                      className={`rounded-full p-6 ${getCategoryColor(campaign.category)}`}
                    >
                      {getCategoryIcon(campaign.category)}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${getCategoryColor(
                          campaign.category,
                        )}`}
                      >
                        {campaign.category}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {daysRemaining} {t("crowdfunding.daysLeft")}
                      </div>
                    </div>
                    <h3 className="mb-1 font-semibold text-foreground">
                      {campaign.title}
                    </h3>
                    <div className="mb-2 flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="bg-primary/10 text-xs text-primary">
                          {campaign.creatorName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">
                        {t("crowdfunding.by")} {campaign.creatorName}
                      </span>
                    </div>
                    <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                      {campaign.description}
                    </p>
                    <div className="mb-2">
                      <Progress value={progress} className="h-2" />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        <span className="font-semibold text-foreground">
                          {formatCurrency(campaign.raisedAmount)}
                        </span>{" "}
                        {t("crowdfunding.raised")}
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Users className="h-3 w-3" />
                        {campaign.contributorsCount} {t("crowdfunding.backers")}
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
