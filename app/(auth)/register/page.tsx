"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Phone, User, Loader2, ArrowLeft } from "lucide-react";
import {
  Form,
  Input as AntInput,
  Button as AntButton,
  Card as AntCard,
  Divider,
} from "antd";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Navigate to OTP verification
    toast.success("Verification code sent!");
    router.push(
      `/verify-otp?email=${encodeURIComponent(
        values.email,
      )}&phone=${encodeURIComponent(values.phone)}`,
    );
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
              Create Account
            </h1>
            <p className="text-sm font-normal text-muted-foreground">
              Start sending money to Ethiopia in minutes
            </p>
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label={<span className="text-sm font-medium">First Name</span>}
              name="firstName"
              rules={[{ required: true, message: "Required" }]}
            >
              <AntInput
                prefix={<User className="h-4 w-4 text-muted-foreground mr-2" />}
                placeholder="John"
                size="large"
                className="h-12 rounded-xl bg-muted/50 border-border/40 hover:border-primary focus:border-primary"
              />
            </Form.Item>
            <Form.Item
              label={<span className="text-sm font-medium">Last Name</span>}
              name="lastName"
              rules={[{ required: true, message: "Required" }]}
            >
              <AntInput
                placeholder="Doe"
                size="large"
                className="h-12 rounded-xl bg-muted/50 border-border/40 hover:border-primary focus:border-primary"
              />
            </Form.Item>
          </div>

          <Form.Item
            label={<span className="text-sm font-medium">Email Address</span>}
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Enter a valid email" },
            ]}
          >
            <AntInput
              prefix={<Mail className="h-4 w-4 text-muted-foreground mr-2" />}
              placeholder="you@example.com"
              size="large"
              className="h-12 rounded-xl bg-muted/50 border-border/40 hover:border-primary focus:border-primary"
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-sm font-medium">Phone Number</span>}
            name="phone"
            rules={[{ required: true, message: "Please enter your phone" }]}
          >
            <AntInput
              prefix={<Phone className="h-4 w-4 text-muted-foreground mr-2" />}
              placeholder="+1 (555) 000-0000"
              size="large"
              className="h-12 rounded-xl bg-muted/50 border-border/40 hover:border-primary focus:border-primary"
            />
          </Form.Item>

          <div className="pt-2">
            <AntButton
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={isLoading}
              className="h-12 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
            >
              {isLoading ? "Creating account..." : "Continue"}
            </AntButton>
          </div>

          <p className="text-[11px] text-center text-muted-foreground mt-4 leading-relaxed font-medium">
            By creating an account, you agree to our{" "}
            <Link
              href="/terms"
              className="text-primary hover:underline font-bold"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-primary hover:underline font-bold"
            >
              Privacy Policy
            </Link>
          </p>
        </Form>

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
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.11.74.82 0 1.99-.83 3.58-.69 1.49.13 2.59.69 3.29 1.72-3.15 1.9-2.64 6.36.52 7.64-.78 1.96-1.83 3.93-3.4 3.56zM12.03 7.25c-.09-2.65 2.19-4.91 4.67-5.25.32 2.88-2.67 5.35-4.67 5.25z" />
              </svg>
              Apple
            </AntButton>
          </div>

          <div className="text-center pt-2">
            <p className="text-muted-foreground text-xs uppercase tracking-widest font-medium opacity-50 mb-4">
              Already have an account?
            </p>
            <Link href="/login">
              <AntButton
                block
                className="h-12 rounded-xl border-border/40 hover:border-primary/50 hover:bg-primary/5 transition-all text-sm font-bold"
              >
                Log in to White Label Pay
              </AntButton>
            </Link>
          </div>
        </div>
      </AntCard>

      <div className="text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
      </div>
    </div>
  );
}
