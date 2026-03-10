"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Lock, ShieldCheck, KeyRound } from "lucide-react";
import {
  Button as AntButton,
  Card as AntCard,
  Input as AntInput,
  Typography,
  Space,
  Form,
} from "antd";
import { useLocale } from "@/hooks/use-locale";
import { toast } from "sonner";

const { Text, Title, Paragraph } = Typography;

export default function SecurityPage() {
  const { t } = useLocale();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success(t("profile.pinUpdated") || "PIN updated successfully.");
    form.resetFields();
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <Link href="/profile">
          <AntButton
            type="text"
            icon={<ArrowLeft className="h-5 w-5" />}
            className="flex items-center justify-center"
          />
        </Link>
        <div>
          <Title level={4} style={{ margin: 0 }}>
            {t("profile.security")}
          </Title>
          <Text type="secondary">
            {t("profile.securityDesc") ||
              "Manage your account security settings"}
          </Text>
        </div>
      </div>

      <Space direction="vertical" size="large" className="w-full">
        {/* Security Overview */}
        <AntCard className="border-primary/10 bg-primary/5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <Text strong className="block">
                {t("profile.secureAccount") || "Your account is secure"}
              </Text>
              <Text type="secondary" size="small">
                {t("profile.lastPinChange") || "Last PIN change: 2 months ago"}
              </Text>
            </div>
          </div>
        </AntCard>

        {/* Change PIN Form */}
        <AntCard
          title={
            <Space>
              <Lock className="h-4 w-4" />{" "}
              <span>{t("profile.changePin") || "Change Security PIN"}</span>
            </Space>
          }
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            requiredMark={false}
          >
            <Form.Item
              label={t("profile.currentPin") || "Current PIN"}
              name="currentPin"
              rules={[
                { required: true, message: "Please enter your current PIN" },
                { len: 6, message: "PIN must be 6 digits" },
              ]}
            >
              <AntInput.Password
                maxLength={6}
                placeholder="••••••"
                className="h-12 rounded-xl"
                prefix={
                  <KeyRound className="h-4 w-4 text-muted-foreground mr-2" />
                }
              />
            </Form.Item>

            <Form.Item
              label={t("profile.newPin") || "New PIN"}
              name="newPin"
              rules={[
                { required: true, message: "Please enter your new PIN" },
                { len: 6, message: "PIN must be 6 digits" },
              ]}
            >
              <AntInput.Password
                maxLength={6}
                placeholder="••••••"
                className="h-12 rounded-xl"
                prefix={<Lock className="h-4 w-4 text-muted-foreground mr-2" />}
              />
            </Form.Item>

            <Form.Item
              label={t("profile.confirmNewPin") || "Confirm New PIN"}
              name="confirmPin"
              dependencies={["newPin"]}
              rules={[
                { required: true, message: "Please confirm your new PIN" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPin") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("The two PINs do not match"),
                    );
                  },
                }),
              ]}
            >
              <AntInput.Password
                maxLength={6}
                placeholder="••••••"
                className="h-12 rounded-xl"
                prefix={<Lock className="h-4 w-4 text-muted-foreground mr-2" />}
              />
            </Form.Item>

            <Form.Item className="mb-0 mt-6">
              <AntButton
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={isLoading}
                className="h-12 rounded-xl font-bold"
              >
                {t("profile.updatePin") || "Update PIN"}
              </AntButton>
            </Form.Item>
          </Form>
        </AntCard>

        {/* Recovery Info */}
        <AntCard className="border-dashed border-border/60 bg-muted/30">
          <div className="flex flex-col items-center gap-3 py-2 text-center">
            <HelpCircle className="h-8 w-8 text-muted-foreground" />
            <div>
              <Text strong>{t("profile.forgotPin") || "Forgot your PIN?"}</Text>
              <Paragraph type="secondary" className="mt-1 text-sm">
                {t("profile.pinRecoveryDesc") ||
                  "You can recover your PIN using your registered email address."}
              </Paragraph>
            </div>
            <AntButton type="link" className="font-medium p-0">
              {t("profile.startRecovery") || "Start Recovery Process"}
            </AntButton>
          </div>
        </AntCard>
      </Space>
    </div>
  );
}
