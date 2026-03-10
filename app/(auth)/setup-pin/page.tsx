"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck, ArrowLeft } from "lucide-react";
import { Button as AntButton, Card as AntCard, Space } from "antd";
import { PinInput } from "@/components/pin-input";
import { toast } from "sonner";

export default function SetupPinPage() {
  const router = useRouter();
  const [step, setStep] = useState<"create" | "confirm">("create");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePinCreate = (value: string) => {
    setPin(value);
    if (value.length === 6) {
      setStep("confirm");
    }
  };

  const handlePinConfirm = async (value: string) => {
    setConfirmPin(value);

    if (value.length === 6) {
      if (value !== pin) {
        setError("PINs do not match. Please try again.");
        setConfirmPin("");
        return;
      }

      setIsLoading(true);
      setError("");

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Account created successfully!");
      router.push("/home");
    }
  };

  const handleBack = () => {
    if (step === "confirm") {
      setStep("create");
      setConfirmPin("");
      setError("");
    } else {
      router.back();
    }
  };

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
          <div className="space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {step === "create" ? "Create Your PIN" : "Confirm Your PIN"}
              </h1>
              <p className="text-sm font-normal text-muted-foreground">
                {step === "create"
                  ? "Create a 6-digit PIN to secure your transactions"
                  : "Re-enter your PIN to confirm"}
              </p>
            </div>
          </div>
        }
      >
        <div className="space-y-8">
          {step === "create" ? (
            <div className="flex justify-center">
              <PinInput
                value={pin}
                onChange={setPin}
                onComplete={handlePinCreate}
                autoFocus
              />
            </div>
          ) : (
            <div className="flex justify-center">
              <PinInput
                value={confirmPin}
                onChange={setConfirmPin}
                onComplete={handlePinConfirm}
                error={error}
                disabled={isLoading}
                autoFocus
              />
            </div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center gap-3 text-muted-foreground animate-pulse">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-sm font-medium">
                Setting up your account...
              </span>
            </div>
          )}

          {/* PIN Security Tips */}
          <div className="rounded-2xl bg-muted/50 p-6 space-y-3 border border-border/20">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground opacity-60">
              Security Tips
            </p>
            <ul className="text-xs text-muted-foreground space-y-2 font-medium">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Don't use easily guessable numbers like 123456</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Avoid using your birth date or phone number</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Never share your PIN with anyone</span>
              </li>
            </ul>
          </div>

          {/* Step Indicator */}
          <div className="flex justify-center gap-3">
            <div
              className={`h-1.5 w-12 rounded-full transition-all duration-500 ${
                step === "create"
                  ? "bg-primary shadow-lg shadow-primary/20"
                  : "bg-primary/10"
              }`}
            />
            <div
              className={`h-1.5 w-12 rounded-full transition-all duration-500 ${
                step === "confirm"
                  ? "bg-primary shadow-lg shadow-primary/20"
                  : "bg-primary/10"
              }`}
            />
          </div>
        </div>
      </AntCard>

      <div className="text-center mt-8">
        <AntButton
          type="link"
          onClick={handleBack}
          disabled={isLoading}
          className="text-muted-foreground hover:text-foreground flex items-center gap-2 mx-auto font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          {step === "confirm" ? "Change PIN" : "Go back"}
        </AntButton>
      </div>
    </div>
  );
}
