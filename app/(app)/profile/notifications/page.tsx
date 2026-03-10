"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  Mail,
  Smartphone,
  BellRing,
  Settings2,
} from "lucide-react";
import {
  Button as AntButton,
  Card as AntCard,
  Switch,
  Typography,
  Space,
  Divider,
} from "antd";
import { useLocale } from "@/hooks/use-locale";
import { toast } from "sonner";

const { Text, Title, Paragraph } = Typography;

export default function NotificationsPage() {
  const { t } = useLocale();
  const [loading, setLoading] = useState(false);

  const [preferences, setPreferences] = useState({
    pushTransactions: true,
    emailTransactions: true,
    pushPromotions: false,
    emailPromotions: true,
    pushSecurity: true,
    emailSecurity: true,
  });

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
    toast.success(
      t("profile.preferencesUpdated") || "Notification preferences updated.",
    );
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
            {t("profile.notifications")}
          </Title>
          <Text type="secondary">
            {t("profile.manageNotifications") ||
              "Control how you receive updates"}
          </Text>
        </div>
      </div>

      <Space direction="vertical" size="large" className="w-full">
        {/* Transaction Alerts */}
        <AntCard
          title={
            <Space>
              <BellRing className="h-4 w-4 text-primary" />{" "}
              <span>
                {t("profile.transactionAlerts") || "Transaction Alerts"}
              </span>
            </Space>
          }
          extra={
            <Text type="secondary" size="small">
              {t("profile.realtime") || "Real-time updates"}
            </Text>
          }
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Space>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <Text strong block>
                    {t("profile.pushNotifications") || "Push Notifications"}
                  </Text>
                  <Text type="secondary" size="small">
                    {t("profile.pushTransDesc") ||
                      "Get instant alerts on your mobile device"}
                  </Text>
                </div>
              </Space>
              <Switch
                checked={preferences.pushTransactions}
                onChange={() => handleToggle("pushTransactions")}
              />
            </div>

            <Divider className="my-0" />

            <div className="flex items-center justify-between">
              <Space>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <Text strong block>
                    {t("profile.emailAlerts") || "Email Alerts"}
                  </Text>
                  <Text type="secondary" size="small">
                    {t("profile.emailTransDesc") ||
                      "Receive transaction receipts via email"}
                  </Text>
                </div>
              </Space>
              <Switch
                checked={preferences.emailTransactions}
                onChange={() => handleToggle("emailTransactions")}
              />
            </div>
          </div>
        </AntCard>

        {/* Security & Activity */}
        <AntCard
          title={
            <Space>
              <Settings2 className="h-4 w-4 text-primary" />{" "}
              <span>
                {t("profile.securityAndActivity") || "Security & Activity"}
              </span>
            </Space>
          }
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Space>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <Text strong block>
                    {t("profile.securityPush") || "Security Push Alerts"}
                  </Text>
                  <Text type="secondary" size="small">
                    {t("profile.securityPushDesc") ||
                      "Alerts for new logins and PIN changes"}
                  </Text>
                </div>
              </Space>
              <Switch
                checked={preferences.pushSecurity}
                onChange={() => handleToggle("pushSecurity")}
              />
            </div>

            <Divider className="my-0" />

            <div className="flex items-center justify-between">
              <Space>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <Text strong block>
                    {t("profile.securityEmail") || "Security Email Alerts"}
                  </Text>
                  <Text type="secondary" size="small">
                    {t("profile.securityEmailDesc") ||
                      "Crucial account activity updates"}
                  </Text>
                </div>
              </Space>
              <Switch
                checked={preferences.emailSecurity}
                onChange={() => handleToggle("emailSecurity")}
              />
            </div>
          </div>
        </AntCard>

        {/* Marketing & Promotions */}
        <AntCard
          title={
            <Space>
              <Gift className="h-4 w-4 text-primary" />{" "}
              <span>{t("profile.marketing") || "Marketing & Promotions"}</span>
            </Space>
          }
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Space>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <Text strong block>
                    {t("profile.promoPush") || "Promo Push Notifications"}
                  </Text>
                  <Text type="secondary" size="small">
                    {t("profile.promoPushDesc") ||
                      "Offers, rewards, and rate updates"}
                  </Text>
                </div>
              </Space>
              <Switch
                checked={preferences.pushPromotions}
                onChange={() => handleToggle("pushPromotions")}
              />
            </div>

            <Divider className="my-0" />

            <div className="flex items-center justify-between">
              <Space>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <Text strong block>
                    {t("profile.promoEmail") || "Marketing Emails"}
                  </Text>
                  <Text type="secondary" size="small">
                    {t("profile.promoEmailDesc") ||
                      "Newsletters and personalized offers"}
                  </Text>
                </div>
              </Space>
              <Switch
                checked={preferences.emailPromotions}
                onChange={() => handleToggle("emailPromotions")}
              />
            </div>
          </div>
        </AntCard>

        {/* Quiet Mode Info */}
        <div className="rounded-2xl bg-muted/30 p-4 border border-border/40">
          <Space align="start" size="middle">
            <Bell className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <Text strong className="block">
                {t("profile.systemAlerts") || "System Alerts"}
              </Text>
              <Text type="secondary" className="text-sm">
                {t("profile.systemAlertsDesc") ||
                  "Critical system updates and legally required notices will always be sent via email even if other notifications are disabled."}
              </Text>
            </div>
          </Space>
        </div>
      </Space>
    </div>
  );
}
