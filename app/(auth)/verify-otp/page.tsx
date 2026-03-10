"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Mail, Phone, ArrowLeft } from "lucide-react";
import {
  Button as AntButton,
  Card as AntCard,
  Input as AntInput,
  Space,
} from "antd";
import { toast } from "sonner";

function VerifyOTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const phone = searchParams.get("phone") || "";

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter the complete 6-digit code");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success("Verification successful!");
    router.push("/setup-pin");
  };

  const handleResend = async () => {
    if (!canResend) return;

    setCanResend(false);
    setResendTimer(60);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Verification code resent!");
  };

  const maskedEmail = email
    ? `${email.slice(0, 3)}***@${email.split("@")[1]}`
    : "";
  const maskedPhone = phone ? `${phone.slice(0, 4)}***${phone.slice(-4)}` : "";

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
      <AntCard
        className="overflow-hidden border-border/40 bg-background/60 backdrop-blur-xl shadow-2xl rounded-[1.5rem]"
        styles={{
          header: {
            textAlign: "center",
            borderBottom: "none",
            paddingTop: "2.5rem",
          },
          body: { padding: "1.5rem 2.5rem 2.5rem" },
        }}
        title={
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Verify Account
            </h1>
            <div className="text-sm font-normal text-muted-foreground space-y-1 mt-2">
              <p>We've sent a code to:</p>
              {email && (
                <div className="flex items-center justify-center gap-2 text-foreground font-medium">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>{maskedEmail}</span>
                </div>
              )}
              {phone && (
                <div className="flex items-center justify-center gap-2 text-foreground font-medium">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>{maskedPhone}</span>
                </div>
              )}
            </div>
          </div>
        }
      >
        <div className="flex flex-col items-center gap-8">
          <div className="text-center space-y-4 w-full">
            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground opacity-60">
              Enter 6-Digit Code
            </p>
            <AntInput.OTP
              length={6}
              value={otp}
              onChange={setOtp}
              disabled={isLoading}
              size="large"
              className="otp-input-container"
              formatter={(str) => str.toUpperCase()}
            />
          </div>

          <AntButton
            type="primary"
            size="large"
            block
            loading={isLoading}
            disabled={otp.length !== 6}
            onClick={handleVerify}
            className="h-12 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
          >
            {isLoading ? "Verifying..." : "Verify & Continue"}
          </AntButton>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Didn't receive the code?
            </p>
            {canResend ? (
              <AntButton
                type="link"
                onClick={handleResend}
                className="text-primary font-bold p-0 h-auto"
              >
                Resend Code
              </AntButton>
            ) : (
              <p className="text-sm font-bold text-foreground bg-muted/50 px-4 py-2 rounded-full inline-block">
                Resend in <span className="text-primary">{resendTimer}s</span>
              </p>
            )}
          </div>
        </div>
      </AntCard>

      <div className="text-center mt-8">
        <AntButton
          type="link"
          onClick={() => router.back()}
          className="text-muted-foreground hover:text-foreground flex items-center gap-2 mx-auto font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Go back to previous step
        </AntButton>
      </div>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <VerifyOTPContent />
    </Suspense>
  );
}
