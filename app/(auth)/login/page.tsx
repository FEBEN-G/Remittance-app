"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Loader2, Globe } from "lucide-react";
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
        className="overflow-hidden border-border/40 bg-background/60 backdrop-blur-xl shadow-2xl rounded-3xl"
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

        <div className="mt-8 space-y-6">
          <div className="relative">
            <Divider
              plain
              className="text-muted-foreground text-xs uppercase tracking-widest font-medium opacity-50"
            >
              Or continue with
            </Divider>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <AntButton
              className="h-12 rounded-xl border-border/40 hover:border-primary/50 flex items-center justify-center gap-2 font-medium"
              block
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </AntButton>
            <AntButton
              className="h-12 rounded-xl border-border/40 hover:border-primary/50 flex items-center justify-center gap-2 font-medium"
              block
            >
              <path
                d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.11.74.82 0 1.99-.83 3.58-.69 1.49.13 2.59.69 3.29 1.72-3.15 1.9-2.64 6.36.52 7.64-.78 1.96-1.83 3.93-3.4 3.56zM12.03 7.25c-.09-2.65 2.19-4.91 4.67-5.25.32 2.88-2.67 5.35-4.67 5.25z"
                fill="currentColor"
              />
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.11.74.82 0 1.99-.83 3.58-.69 1.49.13 2.59.69 3.29 1.72-3.15 1.9-2.64 6.36.52 7.64-.78 1.96-1.83 3.93-3.4 3.56zM12.03 7.25c-.09-2.65 2.19-4.91 4.67-5.25.32 2.88-2.67 5.35-4.67 5.25z" />
              </svg>
              Apple
            </AntButton>
          </div>

          <div className="pt-2">
            <p className="text-sm text-center text-muted-foreground mb-4">
              {"Don't have an account?"}{" "}
              <Link
                href="/register"
                className="text-primary font-bold hover:underline decoration-2"
              >
                Sign up
              </Link>
            </p>

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
      </AntCard>
    </div>
  );
}
