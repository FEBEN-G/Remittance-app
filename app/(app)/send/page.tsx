"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Search, Plus, Check } from "lucide-react";
import {
  Steps,
  Card as AntCard,
  Button as AntButton,
  Input as AntInput,
  Avatar as AntAvatar,
  Modal,
  Select,
  Alert,
} from "antd";
import { AmountInput } from "@/components/amount-input";
import { TransactionSummary } from "@/components/transaction-summary";
import { PinInput } from "@/components/pin-input";
import { useAuth, useExchangeRate } from "@/lib/store";
import { useLocale } from "@/hooks/use-locale";
import { mockReceivers, mockBanks } from "@/lib/mock";
import type { Receiver, TransactionDetails } from "@/types";

type Step = "receiver" | "amount" | "review";

function SendMoneyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { t } = useLocale();

  const [step, setStep] = useState<Step>("receiver");
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [receivers, setReceivers] = useState<Receiver[]>([]);
  const [selectedReceiver, setSelectedReceiver] = useState<Receiver | null>(
    null,
  );
  const { currentRate: exchangeRate } = useExchangeRate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");
  const [purpose, setPurpose] = useState("family_support");
  const [transactionDetails, setTransactionDetails] =
    useState<TransactionDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Load receivers
    setReceivers(mockReceivers);

    // Check for pre-selected receiver
    const receiverId = searchParams.get("receiver");
    if (receiverId) {
      const receiver = mockReceivers.find((r) => r.id === receiverId);
      if (receiver) {
        setSelectedReceiver(receiver);
        setStep("amount");
      }
    }
  }, [searchParams]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const filteredReceivers = receivers.filter((r) =>
    r.fullName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const calculateFees = (amount: number): number => {
    // Simple fee calculation: $2.99 flat + 0.5% of amount
    return 2.99 + amount * 0.005;
  };

  const handleSelectReceiver = (receiver: Receiver) => {
    // Check if user is verified (Level 2)
    // For demo purposes, we'll check if user.kycStatus is 'approved'
    if (user?.kycStatus !== "approved") {
      setError("KYC_REQUIRED");
      return;
    }

    setSelectedReceiver(receiver);
    setStep("amount");
    setError("");
  };

  const handleAmountChange = (send: string, receive: string) => {
    setSendAmount(send);
    setReceiveAmount(receive);
  };

  const handleContinueToReview = () => {
    if (!sendAmount || !receiveAmount || !selectedReceiver || !exchangeRate)
      return;

    const amount = parseFloat(sendAmount);
    const fees = calculateFees(amount);
    const total = amount + fees;

    setTransactionDetails({
      sendAmount: amount,
      receiveAmount: parseFloat(receiveAmount),
      sendCurrency: "USD",
      receiveCurrency: "ETB",
      exchangeRate: exchangeRate.rate,
      fees,
      total,
      receiver: selectedReceiver,
      purpose,
    });

    setStep("review");
  };

  const handleConfirmTransaction = () => {
    setIsPinModalOpen(true);
  };

  const handlePinSubmit = async (pin: string) => {
    setIsLoading(true);
    setError("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // For demo, accept any 4-digit PIN
      if (pin.length === 4) {
        setIsPinModalOpen(false);
        setIsSuccessModalOpen(true);
      } else {
        setError("Invalid PIN");
      }
    } catch {
      setError("Transaction failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewTransaction = () => {
    setIsSuccessModalOpen(false);
    setStep("receiver");
    setSelectedReceiver(null);
    setSendAmount("");
    setReceiveAmount("");
    setTransactionDetails(null);
  };

  const purposeOptions = [
    { value: "family_support", label: t("send.purposes.familySupport") },
    { value: "education", label: t("send.purposes.education") },
    { value: "medical", label: t("send.purposes.medical") },
    { value: "business", label: t("send.purposes.business") },
    { value: "other", label: t("send.purposes.other") },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header Section */}
      <div className="mb-6 flex items-center gap-4">
        <AntButton
          type="text"
          icon={<ArrowLeft className="h-5 w-5" />}
          className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-muted"
          onClick={() => {
            if (step === "receiver") router.back();
            else setStep(step === "amount" ? "receiver" : "amount");
          }}
        />
        <h1 className="text-xl font-bold text-foreground">{t("send.title")}</h1>
      </div>

      {/* Stepper Section Card */}
      <div className="rounded-4xl border border-border/40 bg-background/95 p-6 shadow-2xl backdrop-blur-sm">
        <div className="px-4">
          <Steps
            current={["receiver", "amount", "review"].indexOf(step)}
            responsive={false}
            items={[
              { title: "Receiver", description: "Who" },
              { title: "Amount", description: "How much" },
              { title: "Review", description: "Verify" },
            ]}
            className="premium-steps"
          />
        </div>
      </div>

      <div className="min-h-[60vh] pb-24">
        {/* Step 1: Select Receiver */}
        {step === "receiver" && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-500 fade-in">
            {error === "KYC_REQUIRED" && (
              <Alert
                message="Account Verification Required"
                description={
                  <div className="space-y-2">
                    <p>
                      You must complete Level 2 (International) KYC verification
                      before you can send money.
                    </p>
                    <Link
                      href="/kyc"
                      className="text-primary font-bold hover:underline"
                    >
                      Go to Verification →
                    </Link>
                  </div>
                }
                type="warning"
                showIcon
                closable
                onClose={() => setError("")}
                className="mb-6 rounded-2xl border-warning/20 bg-warning/5 dark:bg-warning/10 shadow-sm overflow-hidden"
              />
            )}

            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground z-10" />
              <AntInput
                placeholder={t("send.searchReceivers")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 rounded-2xl bg-muted/30 border-border/40 text-lg shadow-sm"
              />
            </div>

            <Link
              href="/receivers/new"
              className="block transform transition-transform active:scale-95"
            >
              <AntCard
                hoverable
                className="group border-dashed border-2 grow bg-primary/2 dark:bg-primary/5 border-primary/20 hover:border-primary/50 hover:bg-primary/4 dark:hover:bg-primary/10 transition-all duration-300 rounded-4xl shadow-sm hover:shadow-primary/5"
                styles={{ body: { padding: "1.5rem" } }}
              >
                <div className="flex items-center gap-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-500">
                    <Plus className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="text-xl font-black text-foreground tracking-tight">
                      {t("send.addNewReceiver")}
                    </p>
                    <p className="text-sm font-medium text-muted-foreground/80 mt-1">
                      {t("send.addNewReceiverDesc")}
                    </p>
                  </div>
                </div>
              </AntCard>
            </Link>

            <div className="space-y-4 mt-12">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">
                  {t("send.savedReceivers")}
                </h3>
                <span className="text-[10px] font-bold text-primary/60 px-2 py-0.5 rounded-full bg-primary/5 border border-primary/10">
                  {filteredReceivers.length} Total
                </span>
              </div>

              <div className="grid gap-4">
                {filteredReceivers.map((receiver) => (
                  <AntCard
                    key={receiver.id}
                    hoverable
                    className="group rounded-4xl border-border/40 bg-background/40 backdrop-blur-xl transition-all duration-300 hover:bg-primary/2 hover:border-primary/30 hover:-translate-y-1 shadow-sm active:scale-[0.98]"
                    styles={{ body: { padding: "1.25rem" } }}
                    onClick={() => handleSelectReceiver(receiver)}
                  >
                    <div className="flex items-center gap-5">
                      <div className="relative">
                        <AntAvatar
                          size={64}
                          className="border-2 border-primary/20 bg-primary/5 dark:bg-primary/10 transition-transform duration-500 group-hover:rotate-6"
                        >
                          {getInitials(receiver.fullName)}
                        </AntAvatar>
                        <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-lg bg-background border-2 border-primary/20 flex items-center justify-center shadow-lg">
                          <Check className="h-3 w-3 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-lg font-black text-foreground tracking-tight truncate">
                          {receiver.fullName}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-bold text-muted-foreground/70 uppercase">
                            {
                              mockBanks
                                .find((b) => b.code === receiver.bankCode)
                                ?.name.split(" ")[0]
                            }
                          </span>
                          <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                          <span className="text-xs font-medium text-muted-foreground/60 tracking-widest">
                            •••• {receiver.accountNumber.slice(-4)}
                          </span>
                        </div>
                      </div>
                      <div className="h-10 w-10 rounded-2xl bg-muted/50 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  </AntCard>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Enter Amount */}
        {step === "amount" && selectedReceiver && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 fade-in">
            {!exchangeRate ? (
              <div className="flex flex-col items-center justify-center py-20 bg-background/40 backdrop-blur-xl rounded-4xl border border-dashed border-primary/20">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4" />
                <p className="text-lg font-bold text-primary/60 animate-pulse uppercase tracking-widest text-[10px]">
                  Setting up exchange rate...
                </p>
              </div>
            ) : (
              <>
                <AntCard
                  className="rounded-4xl border-border/40 bg-linear-to-br from-primary/10 via-background to-background backdrop-blur-xl shadow-2xl relative overflow-hidden group"
                  styles={{ body: { padding: "1.5rem" } }}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/10 transition-colors duration-500" />
                  <div className="flex items-center gap-5 relative z-10">
                    <div className="relative">
                      <AntAvatar
                        size={64}
                        className="border-2 border-primary/20 bg-primary font-black text-primary-foreground text-xl shadow-inner shadow-primary/20"
                      >
                        {getInitials(selectedReceiver.fullName)}
                      </AntAvatar>
                      <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-lg bg-success flex items-center justify-center shadow-lg border-2 border-background">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 mb-1">
                        Paying Recipient
                      </p>
                      <p className="text-xl font-black text-foreground tracking-tight truncate leading-none">
                        {selectedReceiver.fullName}
                      </p>
                    </div>
                    <AntButton
                      type="default"
                      shape="round"
                      onClick={() => setStep("receiver")}
                      className="font-black text-[10px] uppercase tracking-wider h-8 px-4 border-muted-foreground/20 hover:border-primary hover:text-primary transition-all active:scale-90"
                    >
                      {t("common.change")}
                    </AntButton>
                  </div>
                </AntCard>

                <AmountInput
                  exchangeRate={exchangeRate}
                  sendAmount={sendAmount}
                  receiveAmount={receiveAmount}
                  onAmountChange={handleAmountChange}
                />

                <div className="space-y-4 px-2">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="purpose"
                      className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1"
                    >
                      {t("send.purpose")}
                    </label>
                    <div className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                  </div>
                  <div className="relative group">
                    <select
                      id="purpose"
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      className="w-full h-16 rounded-[1.25rem] border border-border/40 bg-background/50 backdrop-blur-sm px-6 py-2 text-base font-bold transition-all duration-300 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none appearance-none group-hover:bg-background/80"
                    >
                      {purposeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none rotate-90 group-hover:text-primary transition-colors" />
                  </div>
                </div>

                <div className="pt-8">
                  <AntButton
                    type="primary"
                    size="large"
                    block
                    className="h-16 rounded-3xl text-lg font-black tracking-tight shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95 border-none bg-linear-to-r from-primary to-primary/90"
                    onClick={handleContinueToReview}
                    disabled={!sendAmount || parseFloat(sendAmount) <= 0}
                  >
                    {t("common.continue")}
                  </AntButton>
                  <p className="text-center text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-6">
                    Secure 256-bit encrypted transfer
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Step 3: Review */}
        {step === "review" && transactionDetails && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 fade-in">
            <TransactionSummary details={transactionDetails} />

            <div className="flex flex-col gap-4 pt-8">
              <AntButton
                type="primary"
                size="large"
                block
                className="h-16 rounded-3xl text-lg font-black tracking-tight shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95 border-none bg-linear-to-r from-primary to-primary/90"
                onClick={handleConfirmTransaction}
              >
                {t("send.confirmAndSend")}
              </AntButton>
              <AntButton
                size="large"
                type="text"
                className="h-14 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-all active:scale-95"
                onClick={() => setStep("amount")}
              >
                {t("common.back")}
              </AntButton>
            </div>
          </div>
        )}
      </div>

      {/* PIN Modal via Ant Design */}
      <Modal
        open={isPinModalOpen}
        onCancel={() => !isLoading && setIsPinModalOpen(false)}
        footer={null}
        centered
        closable={!isLoading}
        width={400}
        className="rounded-3xl overflow-hidden"
      >
        <div className="space-y-8 py-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              {t("send.enterPinTitle")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("send.enterPinDescription")}
            </p>
          </div>
          <div className="flex justify-center">
            <PinInput
              length={4}
              onComplete={handlePinSubmit}
              disabled={isLoading}
            />
          </div>
          {error && (
            <p className="text-center text-sm font-semibold text-destructive animate-pulse">
              {error}
            </p>
          )}
          {isLoading && (
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-sm font-medium text-muted-foreground">
                Securing transaction...
              </p>
            </div>
          )}
        </div>
      </Modal>

      <Modal
        open={isSuccessModalOpen}
        closable={false}
        footer={null}
        centered
        width={500}
        className="premium-modal"
      >
        {transactionDetails && (
          <div className="space-y-10 py-10 text-center animate-in zoom-in-95 duration-700 ease-out">
            <div className="relative mx-auto flex h-32 w-32 items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-success/20 animate-ping duration-3000" />
              <div className="absolute inset-0 rounded-full bg-success/10 animate-pulse" />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-success text-success-foreground shadow-2xl shadow-success/40 rotate-12 animate-in slide-in-from-bottom-4 duration-1000">
                <Check className="h-12 w-12 stroke-3" />
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-4xl font-black text-foreground tracking-tight">
                {t("send.success")}
              </h2>
              <p className="text-lg font-medium text-muted-foreground/80 px-6 leading-relaxed">
                {t("send.successDescription", {
                  amount: transactionDetails.receiveAmount.toLocaleString(),
                  currency: transactionDetails.receiveCurrency,
                  name: transactionDetails.receiver.fullName,
                })}
              </p>
            </div>

            <div className="px-6">
              <div className="relative group overflow-hidden rounded-[2.5rem] bg-muted/30 border border-border/40 p-8">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/10 transition-colors" />

                <div className="space-y-6 relative z-10">
                  <div className="flex justify-between items-center group/item">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                      Transaction ID
                    </span>
                    <span className="font-mono font-bold text-sm bg-background/50 px-3 py-1 rounded-full border border-border/20">
                      TXN-{Date.now().toString().slice(-8)}
                    </span>
                  </div>

                  <div className="h-px bg-dashed-gradient opacity-20" />

                  <div className="flex justify-between items-center">
                    <div className="text-left">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-1">
                        Sent Amount
                      </p>
                      <p className="text-2xl font-black tracking-tight">
                        ${transactionDetails.sendAmount.toFixed(2)}
                      </p>
                    </div>
                    <div className="h-10 w-px bg-border/40 rotate-12" />
                    <div className="text-right">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-success/60 mb-1">
                        Recipient Gets
                      </p>
                      <p className="text-2xl font-black text-success tracking-tight">
                        {transactionDetails.receiveAmount.toLocaleString()}{" "}
                        <span className="text-sm">ETB</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 px-6 pt-4">
              <AntButton
                type="primary"
                size="large"
                block
                className="h-16 rounded-3xl text-lg font-black tracking-tight shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95 border-none bg-linear-to-r from-primary to-primary/90"
                onClick={handleNewTransaction}
              >
                {t("send.sendAnother")}
              </AntButton>
              <Link href="/home" className="w-full">
                <AntButton
                  size="large"
                  type="text"
                  block
                  className="h-14 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-all active:scale-95"
                >
                  {t("send.backToHome")}
                </AntButton>
              </Link>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default function SendMoneyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <SendMoneyContent />
    </Suspense>
  );
}
