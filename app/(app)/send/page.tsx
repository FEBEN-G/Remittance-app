"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Search, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AmountInput } from "@/components/amount-input";
import { TransactionSummary } from "@/components/transaction-summary";
import { PinInput } from "@/components/pin-input";
import { useAuth, useExchangeRate } from "@/lib/store";
import { useLocale } from "@/hooks/use-locale";
import { mockReceivers, mockBanks } from "@/lib/mock-data";
import type { Receiver, ExchangeRate, TransactionDetails } from "@/types";
import { Steps, Card as AntCard, Button as AntButton, Modal } from "antd";

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
    setSelectedReceiver(receiver);
    setStep("amount");
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
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Header and Stepper */}
      <div className="mb-8 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-muted/50 rounded-xl"
            onClick={() => {
              if (step === "receiver") router.back();
              else if (step === "amount") setStep("receiver");
              else if (step === "review") setStep("amount");
            }}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {t("send.title")}
          </h1>
        </div>

        <Steps
          current={["receiver", "amount", "review"].indexOf(step)}
          items={[
            { title: "Receiver", description: "Select who to send to" },
            { title: "Amount", description: "Enter amount to send" },
            { title: "Review", description: "Confirm details" },
          ]}
          className="px-4 py-4 bg-background/50 backdrop-blur-sm rounded-2xl border border-border/40 shadow-sm"
        />
      </div>

      <div className="min-h-[60vh] pb-24">
        {/* Step 1: Select Receiver */}
        {step === "receiver" && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-500 fade-in">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("send.searchReceivers")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 rounded-2xl bg-muted/30 border-border/40 text-lg shadow-sm"
              />
            </div>

            <Link href="/receivers/new">
              <AntCard
                hoverable
                className="border-dashed border-2 bg-transparent hover:border-primary/50 transition-colors rounded-2xl"
                styles={{ body: { padding: "1rem" } }}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 transition-transform group-hover:scale-110">
                    <Plus className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">
                      {t("send.addNewReceiver")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t("send.addNewReceiverDesc")}
                    </p>
                  </div>
                </div>
              </AntCard>
            </Link>

            <div className="space-y-3 mt-8">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground ml-2">
                {t("send.savedReceivers")}
              </h3>
              {filteredReceivers.map((receiver) => (
                <AntCard
                  key={receiver.id}
                  hoverable
                  className="rounded-2xl border-border/40 bg-background/60 backdrop-blur-sm transition-all hover:bg-muted/20"
                  styles={{ body: { padding: "1rem" } }}
                  onClick={() => handleSelectReceiver(receiver)}
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14 border-2 border-primary/20 bg-primary/5">
                      <AvatarFallback className="text-lg font-bold text-primary">
                        {getInitials(receiver.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-lg font-bold text-foreground">
                        {receiver.fullName}
                      </p>
                      <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        {
                          mockBanks.find((b) => b.code === receiver.bankCode)
                            ?.name
                        }
                        <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                        {receiver.accountNumber}
                      </p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      <ChevronRight className="h-5 w-5 text-foreground" />
                    </div>
                  </div>
                </AntCard>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Enter Amount */}
        {step === "amount" && selectedReceiver && exchangeRate && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 fade-in">
            <AntCard
              className="rounded-3xl border-border/40 bg-gradient-to-br from-primary/5 to-transparent backdrop-blur-sm"
              styles={{ body: { padding: "1.25rem" } }}
            >
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14 border border-border shadow-sm">
                  <AvatarFallback className="bg-primary text-primary-foreground font-bold text-lg">
                    {getInitials(selectedReceiver.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
                    Sending to
                  </p>
                  <p className="text-lg font-bold text-foreground leading-none">
                    {selectedReceiver.fullName}
                  </p>
                </div>
                <AntButton
                  type="default"
                  shape="round"
                  onClick={() => setStep("receiver")}
                  className="font-semibold text-xs"
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

            <div className="space-y-3 px-2">
              <Label htmlFor="purpose" className="text-sm font-semibold ml-1">
                {t("send.purpose")}
              </Label>
              <select
                id="purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full h-14 rounded-2xl border border-border/60 bg-background/50 px-4 py-2 text-base font-medium transition-colors focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              >
                {purposeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-4">
              <AntButton
                type="primary"
                size="large"
                block
                className="h-14 rounded-2xl text-base font-bold shadow-lg shadow-primary/20"
                onClick={handleContinueToReview}
                disabled={!sendAmount || parseFloat(sendAmount) <= 0}
              >
                {t("common.continue")}
              </AntButton>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === "review" && transactionDetails && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 fade-in">
            <TransactionSummary details={transactionDetails} />

            <div className="flex gap-4 pt-4">
              <AntButton
                size="large"
                className="flex-1 h-14 rounded-2xl font-bold"
                onClick={() => setStep("amount")}
              >
                {t("common.back")}
              </AntButton>
              <AntButton
                type="primary"
                size="large"
                className="flex-1 h-14 rounded-2xl font-bold shadow-lg shadow-primary/20"
                onClick={handleConfirmTransaction}
              >
                {t("send.confirmAndSend")}
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

      {/* Success Modal via Ant Design */}
      <Modal
        open={isSuccessModalOpen}
        closable={false}
        footer={null}
        centered
        width={480}
        className="rounded-3xl overflow-hidden"
      >
        {transactionDetails && (
          <div className="space-y-8 py-8 text-center animate-in zoom-in-95 duration-500">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-success/15 relative">
              <div
                className="absolute inset-0 rounded-full animate-ping bg-success/20"
                style={{ animationDuration: "2s" }}
              />
              <Check className="h-12 w-12 text-success" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-foreground">
                {t("send.success")}
              </h2>
              <p className="text-lg text-muted-foreground">
                {t("send.successDescription", {
                  amount: transactionDetails.receiveAmount.toLocaleString(),
                  currency: transactionDetails.receiveCurrency,
                  name: transactionDetails.receiver.fullName,
                })}
              </p>
            </div>

            <AntCard
              className="bg-muted/30 border-border/40 rounded-2xl"
              styles={{ body: { padding: "1.5rem" } }}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-border/40 pb-4">
                  <span className="text-muted-foreground font-medium">
                    {t("send.transactionId")}
                  </span>
                  <span className="font-mono font-bold text-foreground">
                    TXN{Date.now().toString().slice(-8)}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-border/40 pb-4">
                  <span className="text-muted-foreground font-medium">
                    {t("send.amountSent")}
                  </span>
                  <span className="font-bold text-foreground text-lg">
                    ${transactionDetails.sendAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">
                    {t("send.amountReceived")}
                  </span>
                  <span className="font-bold text-success text-lg">
                    {transactionDetails.receiveAmount.toLocaleString()} ETB
                  </span>
                </div>
              </div>
            </AntCard>

            <div className="flex flex-col gap-3 pt-4">
              <AntButton
                type="primary"
                size="large"
                block
                className="h-14 rounded-2xl font-bold shadow-lg shadow-primary/20"
                onClick={handleNewTransaction}
              >
                {t("send.sendAnother")}
              </AntButton>
              <Link href="/home">
                <AntButton
                  type="default"
                  size="large"
                  block
                  className="h-14 rounded-2xl font-bold"
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
