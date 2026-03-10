"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocale } from "@/hooks/use-locale";
import { mockBanks } from "@/lib/mock-data";

export default function NewReceiverPage() {
  const router = useRouter();
  const { t } = useLocale();

  const [formData, setFormData] = useState({
    fullName: "",
    bankCode: "",
    accountNumber: "",
    phoneNumber: "",
    city: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = t("receivers.errors.nameRequired");
    }
    if (!formData.bankCode) {
      newErrors.bankCode = t("receivers.errors.bankRequired");
    }
    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = t("receivers.errors.accountRequired");
    } else if (formData.accountNumber.length < 10) {
      newErrors.accountNumber = t("receivers.errors.accountInvalid");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccess(true);
    } catch {
      setErrors({ form: "Failed to add receiver. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="space-y-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
            <Check className="h-10 w-10 text-success" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {t("receivers.addSuccess")}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {t("receivers.addSuccessDesc", { name: formData.fullName })}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Link href={`/send?receiver=receiver-1`}>
              <Button className="w-full">{t("receivers.sendNow")}</Button>
            </Link>
            <Link href="/receivers">
              <Button variant="outline" className="w-full">
                {t("receivers.viewAll")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-foreground">
            {t("receivers.addNew")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("receivers.addNewDesc")}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {t("receivers.personalInfo")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">{t("receivers.fullName")} *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                placeholder={t("receivers.fullNamePlaceholder")}
                className={errors.fullName ? "border-destructive" : ""}
              />
              {errors.fullName && (
                <p className="text-sm text-destructive">{errors.fullName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">{t("receivers.phoneNumber")}</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                placeholder="+251 9XX XXX XXX"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">{t("receivers.city")}</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
                placeholder={t("receivers.cityPlaceholder")}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {t("receivers.bankInfo")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bankCode">{t("receivers.bank")} *</Label>
              <select
                id="bankCode"
                value={formData.bankCode}
                onChange={(e) => handleChange("bankCode", e.target.value)}
                className={`w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  errors.bankCode ? "border-destructive" : "border-input"
                }`}
              >
                <option value="">{t("receivers.selectBank")}</option>
                {mockBanks.map((bank) => (
                  <option key={bank.code} value={bank.code}>
                    {bank.name}
                  </option>
                ))}
              </select>
              {errors.bankCode && (
                <p className="text-sm text-destructive">{errors.bankCode}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountNumber">
                {t("receivers.accountNumber")} *
              </Label>
              <Input
                id="accountNumber"
                value={formData.accountNumber}
                onChange={(e) => handleChange("accountNumber", e.target.value)}
                placeholder={t("receivers.accountPlaceholder")}
                className={errors.accountNumber ? "border-destructive" : ""}
              />
              {errors.accountNumber && (
                <p className="text-sm text-destructive">
                  {errors.accountNumber}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {errors.form && (
          <p className="text-center text-sm text-destructive">{errors.form}</p>
        )}

        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
          ) : (
            t("receivers.addReceiver")
          )}
        </Button>
      </form>
    </div>
  );
}
