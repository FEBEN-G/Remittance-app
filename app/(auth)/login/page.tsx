"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Loader2 } from "lucide-react";
import { PinInput } from "@/components/pin-input";
import {
  Form,
  Input as AntInput,
  Button as AntButton,
  Checkbox as AntCheckbox,
  Card as AntCard,
  Divider,
} from "antd";
import { toast } from "sonner";
import { useAuth } from "@/lib/store";
import { mockExchangeRate, mockUser } from "@/lib/mock-data";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [step, setStep] = useState<"email" | "pin">("email");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [form] = Form.useForm();

  const handleEmailSubmit = (values: any) => {
    setEmail(values.email);
    setStep("pin");
  };

  const handlePinComplete = async (pinValue: string) => {
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
              Welcome Back
            </h1>
            <p className="text-sm font-normal text-muted-foreground">
              {step === "email"
                ? "Enter your email to continue"
                : "Enter your PIN to login"}
            </p>
          </div>
        }
      >
        {step === "email" ? (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleEmailSubmit}
            requiredMark={false}
            className="space-y-4"
          >
            <Form.Item
              label={<span className="text-sm font-medium">Email Address</span>}
              name="email"
              rules={[
                { required: true, message: "Please enter your email address" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <AntInput
                prefix={<Mail className="h-4 w-4 text-muted-foreground mr-2" />}
                placeholder="you@example.com"
                size="large"
                className="h-12 rounded-xl bg-muted/50 border-border/40 hover:border-primary focus:border-primary"
              />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked" noStyle>
              <AntCheckbox className="text-sm">Remember me</AntCheckbox>
            </Form.Item>

            <Form.Item className="mt-8 mb-0">
              <AntButton
                type="primary"
                htmlType="submit"
                size="large"
                block
                className="h-12 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
              >
                Continue
              </AntButton>
            </Form.Item>
          </Form>
        ) : (
          <div className="space-y-8">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">
                Logging in as
              </p>
              <p className="text-lg font-semibold text-foreground">{email}</p>
              <AntButton
                type="link"
                size="small"
                onClick={() => setStep("email")}
                className="text-primary p-0 h-auto font-medium"
              >
                Change email
              </AntButton>
            </div>

            <div className="flex justify-center">
              <PinInput onComplete={handlePinComplete} disabled={isLoading} />
            </div>

            {isLoading && (
              <div className="flex items-center justify-center gap-2 text-muted-foreground animate-pulse">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm font-medium">Verifying...</span>
              </div>
            )}

            <div className="text-center">
              <Link
                href="/forgot-pin"
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Forgot PIN?
              </Link>
            </div>
          </div>
        )}

        <div className="mt-8">
          <Divider
            plain
            className="text-muted-foreground text-xs uppercase tracking-widest font-medium opacity-50"
          >
            Or
          </Divider>
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              {"Don't have an account?"}{" "}
              <Link
                href="/register"
                className="text-primary font-bold hover:underline decoration-2"
              >
                Sign up
              </Link>
            </p>

            <div className="pt-2">
              <Link href="/dashboard">
                <AntButton
                  block
                  className="h-12 rounded-xl border-border/40 hover:border-primary/50 hover:bg-primary/5 transition-all text-sm font-medium"
                >
                  Continue as Guest
                </AntButton>
              </Link>
              <p className="text-center text-[11px] text-muted-foreground mt-3 font-medium uppercase tracking-tight opacity-70">
                View exchange rates without signing in
              </p>
            </div>
          </div>
        </div>
      </AntCard>
    </div>
  );
}
