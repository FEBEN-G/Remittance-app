"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Loader2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { PinInput } from "@/components/pin-input";
import { toast } from "sonner";
import { useAuth } from "@/lib/store";
import { mockExchangeRate, mockUser } from "@/lib/mock-data";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [step, setStep] = useState<"email" | "pin">("email");
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    setStep("pin");
  };

  const handlePinComplete = async (pinValue: string) => {
    setPin(pinValue);
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock successful login
    setUser({
      ...mockUser,
      email,
    });
    toast.success("Welcome back!");
    router.push("/home");
  };

  const rate = mockExchangeRate;

  return (
    <div className="space-y-6">
      {/* Login Form */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            {step === "email"
              ? "Enter your email to continue"
              : "Enter your PIN to login"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "email" ? (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    autoComplete="email"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                />
                <Label
                  htmlFor="remember"
                  className="text-sm font-normal cursor-pointer"
                >
                  Remember me
                </Label>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Continue
              </Button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">
                  Logging in as
                </p>
                <p className="font-medium">{email}</p>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setStep("email")}
                  className="text-primary"
                >
                  Change email
                </Button>
              </div>

              <div className="flex justify-center">
                <PinInput
                  value={pin}
                  onChange={setPin}
                  onComplete={handlePinComplete}
                  disabled={isLoading}
                />
              </div>

              {isLoading && (
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Verifying...</span>
                </div>
              )}

              <div className="text-center">
                <Link
                  href="/forgot-pin"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot PIN?
                </Link>
              </div>
            </div>
          )}

          <div className="mt-6">
            <Separator className="my-4" />
            <p className="text-center text-sm text-muted-foreground">
              {"Don't have an account?"}{" "}
              <Link
                href="/register"
                className="text-primary font-medium hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-4">
            <Link href="/dashboard">
              <Button variant="outline" className="w-full">
                Continue as Guest
              </Button>
            </Link>
            <p className="text-center text-xs text-muted-foreground mt-2">
              View exchange rates without signing in
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
