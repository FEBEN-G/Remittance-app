"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Shield,
  Bell,
  Globe,
  Lock,
  ChevronRight,
  User,
} from "lucide-react";
import {
  Button as AntButton,
  Card as AntCard,
  Typography,
  Space,
  Divider,
} from "antd";
import { StatusBadge } from "@/components/status-badge";
import { useAuth } from "@/lib/store";
import { useLocale } from "@/hooks/use-locale";

const { Text, Title } = Typography;

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useLocale();

  const settingSections = [
    {
      title: "Account & Verification",
      items: [
        {
          id: "kyc",
          label: "KYC Verification",
          icon: Shield,
          href: "/kyc",
          description: "Verify your identity to increase limits",
          badge: user?.kycStatus,
        },
        {
          id: "personal",
          label: "Personal Information",
          icon: User,
          href: "/profile/edit",
          description: "Update your name and contact details",
        },
      ],
    },
    {
      title: "Security & Privacy",
      items: [
        {
          id: "security",
          label: "Security (PIN & Privacy)",
          icon: Lock,
          href: "/profile/security",
          description: "Change your 6-digit PIN and biometrics",
        },
        {
          id: "notifications",
          label: "Notification Preferences",
          icon: Bell,
          href: "/profile/notifications",
          description: "Control how we communicate with you",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20 pb-12">
      <div className="space-y-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-6">
          <Link href="/profile">
            <AntButton
              type="text"
              icon={<ArrowLeft className="h-6 w-6" />}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/60 shadow-sm transition-all hover:bg-white hover:scale-105"
            />
          </Link>
          <div>
            <Title
              level={2}
              className="m-0 text-3xl! font-black tracking-tight text-foreground"
            >
              Settings
            </Title>
            <Text
              type="secondary"
              className="text-sm font-medium tracking-wide uppercase opacity-70"
            >
              Account & Preferences
            </Text>
          </div>
        </div>

        {/* Setting Sections */}
        <div className="space-y-8">
          {settingSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="px-2 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                {section.title}
              </h3>
              <AntCard
                className="rounded-[2rem] border-border/40 bg-background/60 backdrop-blur-xl shadow-xl overflow-hidden"
                bodyStyle={{ padding: 0 }}
              >
                <div className="divide-y divide-border/10">
                  {section.items.map((item) => (
                    <Link key={item.id} href={item.href}>
                      <div className="flex items-center justify-between px-6 py-5 transition-all hover:bg-primary/5 group">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                            <item.icon className="h-6 w-6" />
                          </div>
                          <div>
                            <span className="block text-foreground font-bold tracking-tight">
                              {item.label}
                            </span>
                            {item.description && (
                              <span className="text-xs text-muted-foreground font-medium">
                                {item.description}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {item.badge && (
                            <StatusBadge
                              status={
                                item.badge === "approved"
                                  ? "completed"
                                  : item.badge === "pending"
                                    ? "pending"
                                    : item.badge === "rejected"
                                      ? "failed"
                                      : item.badge === "incomplete"
                                        ? "incomplete"
                                        : "pending"
                              }
                              size="sm"
                            />
                          )}
                          <ChevronRight className="h-5 w-5 text-muted-foreground/30 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </AntCard>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <AntCard className="mt-8 rounded-3xl border-none bg-primary/5 p-2">
          <div className="flex items-start gap-4 p-2">
            <Shield className="h-5 w-5 text-primary shrink-0 mt-1" />
            <Text type="secondary" className="text-xs leading-relaxed">
              Your data is secured with bank-level encryption. We never share
              your personal information with third parties without your explicit
              consent.
            </Text>
          </div>
        </AntCard>
      </div>
    </div>
  );
}
