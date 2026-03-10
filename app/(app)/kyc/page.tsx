"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Upload,
  FileText,
  Camera,
  Check,
  AlertCircle,
  Clock,
  X,
  Globe,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Info,
} from "lucide-react";
import {
  Button as AntButton,
  Card as AntCard,
  Input as AntInput,
  Select as AntSelect,
  Typography,
  Space,
  Divider,
  Result,
  Alert,
  Form,
  Radio,
  Tooltip,
} from "antd";
import { useAuth } from "@/lib/store";
import { useLocale } from "@/hooks/use-locale";
import { toast } from "sonner";
import { KYCIncompleteMock } from "@/components/kyc-incomplete-mock";

const { Title: AntTitle, Text: AntText, Paragraph: AntParagraph } = Typography;

type Step =
  | "status"
  | "level_selection"
  | "details"
  | "selfie"
  | "review"
  | "submitted";
type KYCLevel = "level1" | "level2";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function KYCPage() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const { t } = useLocale();
  const [form] = Form.useForm();

  const [step, setStep] = useState<Step>("status");
  const [kycLevel, setKycLevel] = useState<KYCLevel | null>(null);
  const [documentType, setDocumentType] = useState("passport");
  const [frontDocument, setFrontDocument] = useState<File | null>(null);
  const [backDocument, setBackDocument] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // Mock trigger removed as requested

  const handleFileChange = (
    file: File | null,
    setter: (file: File | null) => void,
  ) => {
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error("File is too large. Maximum size is 10MB.");
        return;
      }
      setter(file);
    }
  };

  const handleSaveDraft = () => {
    if (user) {
      setUser({ ...user, kycStatus: "incomplete" });
      toast.info("Draft saved successfully");
      router.push("/profile/settings");
    }
  };

  const handleReset = () => {
    if (user) {
      setUser({
        ...user,
        kycLevel: 0,
        kycStatus: "not_submitted",
      });
      setStep("status");
      setKycLevel(null);
      setFrontDocument(null);
      setBackDocument(null);
      setSelfie(null);
      form.resetFields();
      toast.success("Verification state reset for testing");
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (kycLevel === "level1") {
        // FR-KYC-01: Fiyida Integration Mock
        const fan = form.getFieldValue("fanNumber");
        await new Promise((resolve) => setTimeout(resolve, 1500));
        // Simple mock validation
        if (user) {
          setUser({
            ...user,
            kycLevel: 1,
            kycStatus: "approved",
          });
          toast.success("Level 1 Verified via Fiyida API!");
        }
      } else {
        // FR-KYC-02: Level 2 Manual Review Mock
        await new Promise((resolve) => setTimeout(resolve, 2000));
        if (user) {
          setUser({
            ...user,
            kycStatus: "pending",
          });
          toast.success("Documents submitted for manual review.");
        }
      }
      setStep("submitted");
    } catch {
      toast.error("Failed to submit verification. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const documentTypes = [
    { value: "passport", label: "Passport" },
    { value: "national_id", label: "National ID" },
    { value: "drivers_license", label: "Driver's License" },
  ];

  const getStatusIcon = () => {
    switch (user?.kycStatus) {
      case "approved":
        return <ShieldCheck className="h-10 w-10 text-success" />;
      case "pending":
        return <Clock className="h-10 w-10 text-amber-500" />;
      case "rejected":
        return <X className="h-10 w-10 text-destructive" />;
      case "incomplete":
        return <AlertCircle className="h-10 w-10 text-amber-500" />;
      default:
        return <ShieldAlert className="h-10 w-10 text-muted-foreground" />;
    }
  };

  const getStatusColorClass = () => {
    switch (user?.kycStatus) {
      case "approved":
        return "bg-success/5 border-success/20";
      case "pending":
        return "bg-amber-500/5 border-amber-500/20";
      case "rejected":
        return "bg-destructive/5 border-destructive/20";
      case "incomplete":
        return "bg-amber-500/5 border-amber-500/20";
      default:
        return "bg-muted/30 border-border";
    }
  };

  const statusContent = (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <AntCard className={getStatusColorClass()}>
        <div className="flex items-center gap-6 p-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-background shadow-sm">
            {getStatusIcon()}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground">
              {user?.kycStatus === "approved" && "Verification Approved"}
              {user?.kycStatus === "pending" && "Verification Pending"}
              {user?.kycStatus === "rejected" && "Verification Rejected"}
              {user?.kycStatus === "not_submitted" && "Not Verified"}
              {user?.kycStatus === "incomplete" && "Verification Incomplete"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {user?.kycStatus === "approved" &&
                "Your identity has been verified. You can now send money globally."}
              {user?.kycStatus === "pending" &&
                "We are reviewing your documents. This usually takes 24-48 hours."}
              {user?.kycStatus === "rejected" &&
                "There was an issue with your documents. Please review and try again."}
              {user?.kycStatus === "incomplete" &&
                "You have a draft verification. Complete the missing steps to finish."}
              {user?.kycStatus === "not_submitted" &&
                "Complete your KYC verification to unlock all features, increase limits, and send money globally."}
            </p>
          </div>
        </div>
      </AntCard>

      {user?.kycStatus === "not_submitted" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <AntCard className="text-center rounded-2xl border-none bg-primary/5">
            <Shield className="h-6 w-6 text-primary mx-auto mb-2" />
            <AntText strong className="block text-xs uppercase">
              Secure
            </AntText>
            <AntText type="secondary" className="text-[10px]">
              Bank-level encryption
            </AntText>
          </AntCard>
          <AntCard className="text-center rounded-2xl border-none bg-primary/5">
            <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
            <AntText strong className="block text-xs uppercase">
              Fast
            </AntText>
            <AntText type="secondary" className="text-[10px]">
              Review in 24-48h
            </AntText>
          </AntCard>
          <AntCard className="text-center rounded-2xl border-none bg-primary/5">
            <Globe className="h-6 w-6 text-primary mx-auto mb-2" />
            <AntText strong className="block text-xs uppercase">
              Global
            </AntText>
            <AntText type="secondary" className="text-[10px]">
              Unlocks all countries
            </AntText>
          </AntCard>
        </div>
      )}

      {user?.kycStatus === "approved" && (
        <AntCard className="rounded-3xl border-border/40 shadow-sm">
          <Space direction="vertical" className="w-full" size="middle">
            <div className="flex justify-between items-center pb-2 border-b border-border/10">
              <AntText type="secondary">Verified On</AntText>
              <AntText strong>March 10, 2024</AntText>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-border/10">
              <AntText type="secondary">Verification Level</AntText>
              <AntText
                strong
                className="text-primary uppercase tracking-wider text-xs"
              >
                Level 2
              </AntText>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-border/10">
              <AntText type="secondary">Daily Send Limit</AntText>
              <AntText strong>$10,000</AntText>
            </div>
          </Space>
        </AntCard>
      )}

      {user?.kycStatus === "incomplete" ? (
        <KYCIncompleteMock onResume={() => setStep("level_selection")} />
      ) : (
        (user?.kycStatus === "not_submitted" ||
          user?.kycStatus === "rejected") && (
          <>
            <AntCard
              className="rounded-3xl border-border/40 shadow-sm"
              title="What You Need"
            >
              <Space direction="vertical" className="w-full" size="large">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <AntText strong className="block text-sm">
                      Official Identity Document
                    </AntText>
                    <AntText type="secondary" className="text-xs">
                      Passport, National ID or Driver's License
                    </AntText>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Camera className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <AntText strong className="block text-sm">
                      Personal Selfie
                    </AntText>
                    <AntText type="secondary" className="text-xs">
                      A clear photo of yourself for facial matching
                    </AntText>
                  </div>
                </div>
              </Space>
            </AntCard>

            <AntButton
              type="primary"
              size="large"
              block
              className="h-14 rounded-2xl font-bold shadow-lg shadow-primary/20"
              onClick={() => setStep("level_selection")}
            >
              {user?.kycStatus === "rejected"
                ? "Retry Verification"
                : "Start Identity Verification"}
            </AntButton>

            <AntButton
              type="text"
              block
              className="mt-4 text-muted-foreground hover:text-destructive transition-colors text-xs font-semibold"
              onClick={handleReset}
            >
              Reset Verification State (Dev Only)
            </AntButton>
          </>
        )
      )}

      {user?.kycStatus !== "not_submitted" &&
        user?.kycStatus !== "incomplete" && (
          <AntButton
            type="text"
            block
            className="mt-6 text-muted-foreground hover:text-destructive transition-colors text-xs font-semibold"
            onClick={handleReset}
          >
            Reset Verification State (Dev Only)
          </AntButton>
        )}
    </div>
  );

  const levelSelectionContent = (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-4">
        <AntTitle level={4}>Choose Verification Level</AntTitle>
        <AntText type="secondary">
          Select the level that matches your needs
        </AntText>
      </div>

      <div className="grid gap-4">
        <AntCard
          hoverable
          className={`cursor-pointer transition-all rounded-3xl border-2 ${kycLevel === "level1" ? "border-primary bg-primary/5" : "border-border/40"}`}
          onClick={() => setKycLevel("level1")}
        >
          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-2xl ${kycLevel === "level1" ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}
            >
              <Shield className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <AntText strong className="text-lg">
                  Level 1 (Ethiopian Users)
                </AntText>
                {kycLevel === "level1" && (
                  <Check className="h-5 w-5 text-primary" />
                )}
              </div>
              <div className="mb-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary uppercase">
                  FAN Number Validation
                </span>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4 font-medium">
                <li>Automatic identity verification via Fiyida API</li>
                <li>Send up to $500 per transaction</li>
                <li>Monthly limit of $1,000</li>
              </ul>
            </div>
          </div>
        </AntCard>

        <AntCard
          hoverable
          className={`cursor-pointer transition-all rounded-3xl border-2 ${kycLevel === "level2" ? "border-primary bg-primary/5" : "border-border/40"}`}
          onClick={() => setKycLevel("level2")}
        >
          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-2xl ${kycLevel === "level2" ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}
            >
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <AntText strong className="text-lg">
                  Level 2 (Foreign Users)
                </AntText>
                {kycLevel === "level2" && (
                  <Check className="h-5 w-5 text-primary" />
                )}
              </div>
              <div className="mb-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-secondary/10 text-secondary uppercase">
                  Manual Document Review
                </span>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4 font-medium">
                <li>Upload Passport, Driver's License or ID</li>
                <li>Send up to $3,000 per transaction</li>
                <li>Monthly limit of $10,000</li>
              </ul>
            </div>
          </div>
        </AntCard>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex gap-4">
          <AntButton
            variant="outlined"
            size="large"
            className="flex-1 h-14 rounded-2xl"
            onClick={() => setStep("status")}
          >
            Cancel
          </AntButton>
          <AntButton
            type="primary"
            size="large"
            className="flex-1 h-14 rounded-2xl font-bold shadow-lg"
            disabled={!kycLevel}
            onClick={() => setStep("details")}
          >
            Continue
          </AntButton>
        </div>
        <AntButton
          type="text"
          className="text-muted-foreground hover:text-primary transition-colors text-xs font-semibold"
          onClick={handleSaveDraft}
        >
          Save & Exit Later
        </AntButton>
      </div>
    </div>
  );

  const detailsContent = (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-4">
        <AntTitle level={4}>
          {kycLevel === "level1" ? "Enter FAN Details" : "Identity Documents"}
        </AntTitle>
        <AntText type="secondary">
          {kycLevel === "level1"
            ? "Provide your unique FAN number for validation"
            : "Select and upload your ID documents"}
        </AntText>
      </div>

      <Form layout="vertical" form={form} className="space-y-4">
        {kycLevel === "level1" ? (
          <AntCard className="rounded-3xl border-border/40 shadow-sm">
            <Form.Item
              label="FAN Number"
              name="fanNumber"
              rules={[
                { required: true, message: "Please enter your FAN number" },
                {
                  pattern: /^[A-Z0-9]{12}$/,
                  message: "FAN number must be 12 alphanumeric characters",
                },
              ]}
              extra={
                <AntText type="secondary" className="text-[10px]">
                  Your 12-character unique Fiyida identification number
                </AntText>
              }
            >
              <AntInput
                size="large"
                placeholder="e.g. AB1234567890"
                className="h-12 rounded-xl"
                prefix={
                  <FileText className="h-4 w-4 text-muted-foreground mr-2" />
                }
              />
            </Form.Item>
          </AntCard>
        ) : (
          <AntCard className="rounded-3xl border-border/40 shadow-sm">
            <Form.Item label="Document Type">
              <AntSelect
                size="large"
                value={documentType}
                onChange={setDocumentType}
                className="w-full h-12"
                options={documentTypes}
              />
            </Form.Item>

            <Divider className="my-6" />

            <div className="space-y-4">
              <AntText strong className="text-sm">
                Front of {documentType}
              </AntText>
              <div
                className={`relative flex h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all ${
                  frontDocument
                    ? "border-primary bg-primary/5 shadow-inner"
                    : "border-border/60 hover:border-primary"
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleFileChange(
                      e.target.files?.[0] || null,
                      setFrontDocument,
                    )
                  }
                  className="absolute inset-0 cursor-pointer opacity-0 z-10"
                />
                {frontDocument ? (
                  <div className="flex flex-col items-center gap-2">
                    <Check className="h-8 w-8 text-primary animate-in zoom-in" />
                    <AntText className="text-xs truncate max-w-[200px]">
                      {frontDocument.name}
                    </AntText>
                  </div>
                ) : (
                  <>
                    <Upload className="mb-2 h-10 w-10 text-muted-foreground/60" />
                    <AntText type="secondary" className="text-xs">
                      Tap to upload front side
                    </AntText>
                  </>
                )}
              </div>

              {documentType !== "passport" && (
                <div className="space-y-4 mt-4">
                  <AntText strong className="text-sm">
                    Back of {documentType}
                  </AntText>
                  <div
                    className={`relative flex h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all ${
                      backDocument
                        ? "border-primary bg-primary/5 shadow-inner"
                        : "border-border/60 hover:border-primary"
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileChange(
                          e.target.files?.[0] || null,
                          setBackDocument,
                        )
                      }
                      className="absolute inset-0 cursor-pointer opacity-0 z-10"
                    />
                    {backDocument ? (
                      <div className="flex flex-col items-center gap-2">
                        <Check className="h-8 w-8 text-primary animate-in zoom-in" />
                        <AntText className="text-xs truncate max-w-[200px]">
                          {backDocument.name}
                        </AntText>
                      </div>
                    ) : (
                      <>
                        <Upload className="mb-2 h-10 w-10 text-muted-foreground/60" />
                        <AntText type="secondary" className="text-xs">
                          Tap to upload back side
                        </AntText>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </AntCard>
        )}
      </Form>

      <div className="flex gap-4">
        <AntButton
          variant="outlined"
          size="large"
          className="flex-1 h-14 rounded-2xl"
          onClick={() => setStep("level_selection")}
        >
          Back
        </AntButton>
        <AntButton
          type="primary"
          size="large"
          className="flex-1 h-14 rounded-2xl font-bold shadow-lg"
          disabled={
            kycLevel === "level1"
              ? false
              : !frontDocument || (documentType !== "passport" && !backDocument)
          }
          onClick={() =>
            kycLevel === "level1" ? handleSubmit() : setStep("selfie")
          }
        >
          {kycLevel === "level1" ? "Submit" : "Next"}
        </AntButton>
      </div>
    </div>
  );

  const selfieContent = (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-4">
        <AntTitle level={4}>Face Verification</AntTitle>
        <AntText type="secondary">
          We need a selfie to match with your document
        </AntText>
      </div>

      <AntCard className="rounded-3xl border-border/40 shadow-sm text-center">
        <div
          className={`relative flex h-56 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed transition-all mb-4 ${
            selfie
              ? "border-primary bg-primary/5"
              : "border-border/60 hover:border-primary"
          }`}
        >
          <input
            type="file"
            accept="image/*"
            capture="user"
            onChange={(e) =>
              handleFileChange(e.target.files?.[0] || null, setSelfie)
            }
            className="absolute inset-0 cursor-pointer opacity-0 z-10"
          />
          {selfie ? (
            <div className="flex flex-col items-center gap-2">
              <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-primary/20">
                <ShieldCheck className="h-full w-full text-primary/40 p-6" />
              </div>
              <AntText strong className="text-xs">
                {selfie.name}
              </AntText>
              <AntButton type="link" size="small" className="text-primary">
                Change Photo
              </AntButton>
            </div>
          ) : (
            <>
              <div className="h-24 w-24 rounded-full bg-muted/30 flex items-center justify-center mb-4 border border-border/10">
                <Camera className="h-10 w-10 text-muted-foreground/40" />
              </div>
              <AntText strong>Take a Selfie</AntText>
              <AntText
                type="secondary"
                className="text-xs px-8 text-center pt-2 italic"
              >
                Face the camera directly and ensure good lighting
              </AntText>
            </>
          )}
        </div>

        <Alert
          message="Privacy Note"
          description="Your biometric data is encrypted and used only for identity verification purposes."
          type="info"
          showIcon
          icon={<Info className="h-4 w-4" />}
          className="rounded-2xl border-none bg-primary/5 text-left"
        />
      </AntCard>

      <div className="flex gap-4">
        <AntButton
          variant="outlined"
          size="large"
          className="flex-1 h-14 rounded-2xl"
          onClick={() => setStep("details")}
        >
          Back
        </AntButton>
        <AntButton
          type="primary"
          size="large"
          className="flex-1 h-14 rounded-2xl font-bold shadow-lg"
          disabled={!selfie}
          onClick={() => setStep("review")}
        >
          Review
        </AntButton>
      </div>
    </div>
  );

  const reviewContent = (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-4">
        <AntTitle level={4}>Review Submission</AntTitle>
        <AntText type="secondary">
          Ensure everything is correct before submitting
        </AntText>
      </div>

      <AntCard className="rounded-3xl border-border/40 shadow-sm overflow-hidden">
        <div className="space-y-1">
          <div className="flex items-center justify-between p-4 bg-muted/20">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary" />
              <AntText strong>Verification Level</AntText>
            </div>
            <AntText type="secondary" className="uppercase text-xs font-bold">
              {kycLevel === "level1" ? "Level 1" : "Level 2"}
            </AntText>
          </div>

          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <AntText>
                {documentType === "passport" ? "Passport" : "ID Front"}
              </AntText>
            </div>
            <Check className="h-5 w-5 text-success" />
          </div>

          {documentType !== "passport" && (
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <AntText>ID Back</AntText>
              </div>
              <Check className="h-5 w-5 text-success" />
            </div>
          )}

          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Camera className="h-5 w-5 text-muted-foreground" />
              <AntText>Selfie Verification</AntText>
            </div>
            <Check className="h-5 w-5 text-success" />
          </div>
        </div>
      </AntCard>

      <Alert
        message="Final Verification"
        description="By submitting, you confirm that the documents provided are authentic and belong to you."
        type="warning"
        showIcon
        className="rounded-2xl border-none bg-amber-500/10"
      />

      <div className="flex gap-4">
        <AntButton
          variant="outlined"
          size="large"
          className="flex-1 h-14 rounded-2xl"
          onClick={() => setStep("selfie")}
        >
          Change
        </AntButton>
        <AntButton
          type="primary"
          size="large"
          className="flex-1 h-14 rounded-2xl font-bold shadow-lg"
          loading={isLoading}
          onClick={handleSubmit}
        >
          Submit Documents
        </AntButton>
      </div>
    </div>
  );

  const submittedContent = (
    <div className="py-12 animate-in fade-in zoom-in duration-700">
      <Result
        status="success"
        title={
          <span className="text-2xl font-black tracking-tight">
            Verification Submitted!
          </span>
        }
        subTitle={
          <div className="space-y-4 px-4">
            <p className="text-muted-foreground">
              Thank you for providing your information. Our team will review
              your application within 24-48 hours.
            </p>
            <AntCard className="bg-muted/30 border-none rounded-2xl">
              <AntText type="secondary" className="text-xs">
                You'll receive a notification and an email once your
                verification status is updated.
              </AntText>
            </AntCard>
          </div>
        }
        extra={[
          <Link href="/home" key="home">
            <AntButton
              type="primary"
              size="large"
              className="h-14 w-full rounded-2xl font-bold shadow-lg shadow-primary/20"
            >
              Return to Home
            </AntButton>
          </Link>,
        ]}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20 pb-12">
      <div className="space-y-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-6">
          <Link href="/profile">
            <AntButton
              type="text"
              icon={<ArrowLeft className="h-6 w-6" />}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/60 shadow-sm transition-all hover:bg-white hover:scale-105"
            />
          </Link>
          <div>
            <AntTitle
              level={2}
              className="m-0 text-3xl! font-black tracking-tight text-foreground"
            >
              {step === "status" ? "KYC Verification" : "KYC Process"}
            </AntTitle>
            <AntText
              type="secondary"
              className="text-sm font-medium tracking-wide uppercase opacity-70"
            >
              {step === "status"
                ? "Account Security"
                : `Step ${step === "level_selection" ? "1" : step === "details" ? "2" : "3"} of 3`}
            </AntText>
          </div>
        </div>

        {/* Content Area */}
        {step === "status" && statusContent}
        {step === "level_selection" && levelSelectionContent}
        {step === "details" && detailsContent}
        {step === "selfie" && selfieContent}
        {step === "review" && reviewContent}
        {step === "submitted" && submittedContent}
      </div>
    </div>
  );
}
