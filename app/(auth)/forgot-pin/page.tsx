"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import {
  Form,
  Input as AntInput,
  Button as AntButton,
  Card as AntCard,
  Space,
} from "antd";
import { toast } from "sonner";

export default function ForgotPinPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    setEmail(values.email);
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
        <AntCard
          className="overflow-hidden border-border/40 bg-background/60 backdrop-blur-xl shadow-2xl rounded-[1.5rem]"
          styles={{
            body: { padding: "3rem 2.5rem" },
          }}
        >
          <div className="text-center space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-sm">
              <CheckCircle className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Check Your Email
              </h1>
              <p className="text-sm font-normal text-muted-foreground leading-relaxed">
                We've sent a PIN reset link to:
                <span className="block font-bold text-foreground mt-1">
                  {email}
                </span>
              </p>
            </div>

            <div className="pt-4 space-y-4">
              <p className="text-xs text-muted-foreground font-medium">
                Didn't receive the email? Check your spam folder or
              </p>
              <AntButton
                block
                className="h-12 rounded-xl border-border/40 hover:border-primary/50 hover:bg-primary/5 transition-all text-sm font-bold"
                onClick={() => setIsSubmitted(false)}
              >
                Try a different email
              </AntButton>
            </div>
          </div>
        </AntCard>

        <div className="text-center mt-8">
          <Link href="/login">
            <AntButton
              type="link"
              className="text-muted-foreground hover:text-foreground flex items-center gap-2 mx-auto font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </AntButton>
          </Link>
        </div>
      </div>
    );
  }

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
              Reset Your PIN
            </h1>
            <p className="text-sm font-normal text-muted-foreground">
              Enter your email address and we'll send you a link to reset your
              PIN
            </p>
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          className="space-y-6"
        >
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
              autoFocus
            />
          </Form.Item>

          <AntButton
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={isLoading}
            className="h-12 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
          >
            Send Reset Link
          </AntButton>
        </Form>
      </AntCard>

      <div className="text-center mt-8">
        <Link href="/login">
          <AntButton
            type="link"
            className="text-muted-foreground hover:text-foreground flex items-center gap-2 mx-auto font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </AntButton>
        </Link>
      </div>
    </div>
  );
}
