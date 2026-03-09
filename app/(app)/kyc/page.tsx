"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  FileText,
  Camera,
  Check,
  AlertCircle,
  Clock,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/store";
import { useLocale } from "@/hooks/use-locale";

type Step = "status" | "documents" | "selfie" | "review" | "submitted";

export default function KYCPage() {
  const { user, setUser } = useAuth();
  const { t } = useLocale();

  const [step, setStep] = useState<Step>(user?.kycStatus === "not_submitted" ? "status" : "status");
  const [documentType, setDocumentType] = useState("passport");
  const [frontDocument, setFrontDocument] = useState<File | null>(null);
  const [backDocument, setBackDocument] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (file: File | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setter(file);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      if (user) {
        setUser({ ...user, kycStatus: "pending" });
      }
      setStep("submitted");
    } catch {
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  const documentTypes = [
    { value: "passport", label: t("kyc.passport") },
    { value: "national_id", label: t("kyc.nationalId") },
    { value: "drivers_license", label: t("kyc.driversLicense") },
  ];

  const getStatusIcon = () => {
    switch (user?.kycStatus) {
      case "approved":
        return <Check className="h-6 w-6 text-success" />;
      case "pending":
        return <Clock className="h-6 w-6 text-warning-foreground" />;
      case "rejected":
        return <X className="h-6 w-6 text-destructive" />;
      default:
        return <AlertCircle className="h-6 w-6 text-muted-foreground" />;
    }
  };

  const getStatusColor = () => {
    switch (user?.kycStatus) {
      case "approved":
        return "bg-success/10 border-success/20";
      case "pending":
        return "bg-warning/10 border-warning/20";
      case "rejected":
        return "bg-destructive/10 border-destructive/20";
      default:
        return "bg-muted border-border";
    }
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Link href="/profile">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-foreground">{t("kyc.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("kyc.subtitle")}</p>
        </div>
      </div>

      {/* Status View */}
      {step === "status" && (
        <div className="space-y-6">
          <Card className={getStatusColor()}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background">
                {getStatusIcon()}
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">
                  {user?.kycStatus === "approved" && t("kyc.statusApproved")}
                  {user?.kycStatus === "pending" && t("kyc.statusPending")}
                  {user?.kycStatus === "rejected" && t("kyc.statusRejected")}
                  {user?.kycStatus === "not_submitted" && t("kyc.statusNotSubmitted")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {user?.kycStatus === "approved" && t("kyc.statusApprovedDesc")}
                  {user?.kycStatus === "pending" && t("kyc.statusPendingDesc")}
                  {user?.kycStatus === "rejected" && t("kyc.statusRejectedDesc")}
                  {user?.kycStatus === "not_submitted" && t("kyc.statusNotSubmittedDesc")}
                </p>
              </div>
            </CardContent>
          </Card>

          {user?.kycStatus === "approved" && (
            <Card>
              <CardContent className="space-y-4 p-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("kyc.verifiedOn")}</span>
                  <span className="text-foreground">January 15, 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("kyc.documentType")}</span>
                  <span className="text-foreground">{t("kyc.passport")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("kyc.sendLimit")}</span>
                  <span className="text-foreground">$10,000/day</span>
                </div>
              </CardContent>
            </Card>
          )}

          {(user?.kycStatus === "not_submitted" || user?.kycStatus === "rejected") && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t("kyc.whatYouNeed")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm text-foreground">{t("kyc.validId")}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Camera className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm text-foreground">{t("kyc.selfiePhoto")}</span>
                  </div>
                </CardContent>
              </Card>

              <Button className="w-full" size="lg" onClick={() => setStep("documents")}>
                {t("kyc.startVerification")}
              </Button>
            </>
          )}
        </div>
      )}

      {/* Documents Step */}
      {step === "documents" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("kyc.selectDocument")}</CardTitle>
              <CardDescription>{t("kyc.selectDocumentDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t("kyc.documentType")}</Label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {documentTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>{t("kyc.frontSide")}</Label>
                <div
                  className={`relative flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
                    frontDocument
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary"
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, setFrontDocument)}
                    className="absolute inset-0 cursor-pointer opacity-0"
                  />
                  {frontDocument ? (
                    <div className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-primary" />
                      <span className="text-sm text-foreground">{frontDocument.name}</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{t("kyc.uploadFront")}</span>
                    </>
                  )}
                </div>
              </div>

              {documentType !== "passport" && (
                <div className="space-y-2">
                  <Label>{t("kyc.backSide")}</Label>
                  <div
                    className={`relative flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
                      backDocument
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary"
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, setBackDocument)}
                      className="absolute inset-0 cursor-pointer opacity-0"
                    />
                    {backDocument ? (
                      <div className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-primary" />
                        <span className="text-sm text-foreground">{backDocument.name}</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{t("kyc.uploadBack")}</span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button variant="outline" className="flex-1" onClick={() => setStep("status")}>
              {t("common.back")}
            </Button>
            <Button
              className="flex-1"
              onClick={() => setStep("selfie")}
              disabled={!frontDocument || (documentType !== "passport" && !backDocument)}
            >
              {t("common.continue")}
            </Button>
          </div>
        </div>
      )}

      {/* Selfie Step */}
      {step === "selfie" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("kyc.takeSelfie")}</CardTitle>
              <CardDescription>{t("kyc.takeSelfieDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`relative flex h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
                  selfie ? "border-primary bg-primary/5" : "border-border hover:border-primary"
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  capture="user"
                  onChange={(e) => handleFileChange(e, setSelfie)}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
                {selfie ? (
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span className="text-sm text-foreground">{selfie.name}</span>
                  </div>
                ) : (
                  <>
                    <Camera className="mb-2 h-12 w-12 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{t("kyc.uploadSelfie")}</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <h4 className="mb-2 font-medium text-foreground">{t("kyc.selfieTips")}</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>- {t("kyc.selfieTip1")}</li>
                <li>- {t("kyc.selfieTip2")}</li>
                <li>- {t("kyc.selfieTip3")}</li>
              </ul>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button variant="outline" className="flex-1" onClick={() => setStep("documents")}>
              {t("common.back")}
            </Button>
            <Button
              className="flex-1"
              onClick={() => setStep("review")}
              disabled={!selfie}
            >
              {t("common.continue")}
            </Button>
          </div>
        </div>
      )}

      {/* Review Step */}
      {step === "review" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("kyc.reviewSubmission")}</CardTitle>
              <CardDescription>{t("kyc.reviewSubmissionDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-foreground">{t("kyc.frontSide")}</span>
                </div>
                <Check className="h-5 w-5 text-success" />
              </div>
              {documentType !== "passport" && (
                <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-foreground">{t("kyc.backSide")}</span>
                  </div>
                  <Check className="h-5 w-5 text-success" />
                </div>
              )}
              <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                <div className="flex items-center gap-3">
                  <Camera className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-foreground">{t("kyc.selfiePhoto")}</span>
                </div>
                <Check className="h-5 w-5 text-success" />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button variant="outline" className="flex-1" onClick={() => setStep("selfie")}>
              {t("common.back")}
            </Button>
            <Button className="flex-1" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              ) : (
                t("kyc.submit")
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Submitted Step */}
      {step === "submitted" && (
        <div className="space-y-6 py-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
            <Check className="h-10 w-10 text-success" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{t("kyc.submitted")}</h2>
            <p className="mt-2 text-muted-foreground">{t("kyc.submittedDesc")}</p>
          </div>
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{t("kyc.reviewTime")}</p>
            </CardContent>
          </Card>
          <Link href="/home">
            <Button className="w-full" size="lg">
              {t("kyc.backToHome")}
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
