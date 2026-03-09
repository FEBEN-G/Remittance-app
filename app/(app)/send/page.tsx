"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Search, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

type Step = "receiver" | "amount" | "review" | "pin" | "success";

function SendMoneyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { t } = useLocale();
  
  const [step, setStep] = useState<Step>("receiver");
  const [receivers, setReceivers] = useState<Receiver[]>([]);
  const [selectedReceiver, setSelectedReceiver] = useState<Receiver | null>(null);
  const { currentRate: exchangeRate } = useExchangeRate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");
  const [purpose, setPurpose] = useState("family_support");
  const [transactionDetails, setTransactionDetails] = useState<TransactionDetails | null>(null);
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
    r.fullName.toLowerCase().includes(searchQuery.toLowerCase())
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
    if (!sendAmount || !receiveAmount || !selectedReceiver || !exchangeRate) return;

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
    setStep("pin");
  };

  const handlePinSubmit = async (pin: string) => {
    setIsLoading(true);
    setError("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // For demo, accept any 4-digit PIN
      if (pin.length === 4) {
        setStep("success");
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
    <div className="container mx-auto max-w-7xl px-4 py-6">
      {/* Header */}
      {step !== "success" && (
        <div className="mb-6 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (step === "receiver") router.back();
              else if (step === "amount") setStep("receiver");
              else if (step === "review") setStep("amount");
              else if (step === "pin") setStep("review");
            }}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">{t("send.title")}</h1>
            <p className="text-sm text-muted-foreground">
              {step === "receiver" && t("send.selectReceiver")}
              {step === "amount" && t("send.enterAmount")}
              {step === "review" && t("send.reviewTransaction")}
              {step === "pin" && t("send.enterPin")}
            </p>
          </div>
        </div>
      )}

      {/* Step: Select Receiver */}
      {step === "receiver" && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t("send.searchReceivers")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Link href="/receivers/new">
            <Card className="cursor-pointer border-dashed transition-colors hover:border-primary">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{t("send.addNewReceiver")}</p>
                  <p className="text-sm text-muted-foreground">{t("send.addNewReceiverDesc")}</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">{t("send.savedReceivers")}</h3>
            {filteredReceivers.map((receiver) => (
              <Card
                key={receiver.id}
                className="cursor-pointer transition-all hover:border-primary hover:shadow-sm"
                onClick={() => handleSelectReceiver(receiver)}
              >
                <CardContent className="flex items-center gap-4 p-4">
                  <Avatar className="h-12 w-12 border border-border">
                    <AvatarFallback className="bg-muted text-muted-foreground">
                      {getInitials(receiver.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{receiver.fullName}</p>
                    <p className="text-sm text-muted-foreground">
                      {mockBanks.find((b) => b.code === receiver.bankCode)?.name} - {receiver.accountNumber}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Step: Enter Amount */}
      {step === "amount" && selectedReceiver && exchangeRate && (
        <div className="space-y-6">
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <Avatar className="h-12 w-12 border border-border">
                <AvatarFallback className="bg-muted text-muted-foreground">
                  {getInitials(selectedReceiver.fullName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium text-foreground">{selectedReceiver.fullName}</p>
                <p className="text-sm text-muted-foreground">
                  {mockBanks.find((b) => b.code === selectedReceiver.bankCode)?.name}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setStep("receiver")}>
                {t("common.change")}
              </Button>
            </CardContent>
          </Card>

          <AmountInput
            exchangeRate={exchangeRate}
            sendAmount={sendAmount}
            receiveAmount={receiveAmount}
            onAmountChange={handleAmountChange}
          />

          <div className="space-y-2">
            <Label htmlFor="purpose">{t("send.purpose")}</Label>
            <select
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {purposeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <Button
            className="w-full"
            size="lg"
            onClick={handleContinueToReview}
            disabled={!sendAmount || parseFloat(sendAmount) <= 0}
          >
            {t("common.continue")}
          </Button>
        </div>
      )}

      {/* Step: Review */}
      {step === "review" && transactionDetails && (
        <div className="space-y-6">
          <TransactionSummary details={transactionDetails} />

          <div className="flex gap-4">
            <Button variant="outline" className="flex-1" onClick={() => setStep("amount")}>
              {t("common.back")}
            </Button>
            <Button className="flex-1" onClick={handleConfirmTransaction}>
              {t("send.confirmAndSend")}
            </Button>
          </div>
        </div>
      )}

      {/* Step: PIN */}
      {step === "pin" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-lg">{t("send.enterPinTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-center text-sm text-muted-foreground">
                {t("send.enterPinDescription")}
              </p>
              <PinInput
                length={4}
                onComplete={handlePinSubmit}
                disabled={isLoading}
              />
              {error && (
                <p className="text-center text-sm text-destructive">{error}</p>
              )}
              {isLoading && (
                <div className="flex justify-center">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step: Success */}
      {step === "success" && transactionDetails && (
        <div className="space-y-6 py-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
            <Check className="h-10 w-10 text-success" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{t("send.success")}</h2>
            <p className="mt-2 text-muted-foreground">
              {t("send.successDescription", {
                amount: transactionDetails.receiveAmount.toLocaleString(),
                currency: transactionDetails.receiveCurrency,
                name: transactionDetails.receiver.fullName,
              })}
            </p>
          </div>

          <Card>
            <CardContent className="space-y-3 p-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("send.transactionId")}</span>
                <span className="font-mono font-medium text-foreground">TXN{Date.now()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("send.amountSent")}</span>
                <span className="font-medium text-foreground">
                  ${transactionDetails.sendAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("send.amountReceived")}</span>
                <span className="font-medium text-foreground">
                  {transactionDetails.receiveAmount.toLocaleString()} ETB
                </span>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3">
            <Button onClick={handleNewTransaction}>{t("send.sendAnother")}</Button>
            <Link href="/home">
              <Button variant="outline" className="w-full">{t("send.backToHome")}</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SendMoneyPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    }>
      <SendMoneyContent />
    </Suspense>
  );
}
