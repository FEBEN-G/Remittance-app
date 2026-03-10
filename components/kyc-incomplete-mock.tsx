"use client";

import {
  Shield,
  AlertCircle,
  CheckCircle2,
  FileText,
  Camera,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import {
  Button as AntButton,
  Card as AntCard,
  Typography,
  Space,
  Progress,
  Steps,
} from "antd";

const { Text, Title, Paragraph } = Typography;

interface KYCIncompleteMockProps {
  onResume: () => void;
}

export function KYCIncompleteMock({ onResume }: KYCIncompleteMockProps) {
  const requirements = [
    {
      id: "identity",
      label: "Identity Details",
      status: "completed",
      details: ["Email Verified", "FAN Number Submitted"],
      icon: FileText,
    },
    {
      id: "selfie",
      label: "Missing Information",
      status: "missing",
      details: ["Selfie Missing"],
      icon: Camera,
      error: true,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Progress Header */}
      <div className="text-center space-y-4">
        <Title level={4} className="m-0 font-black tracking-tight">
          2/3 Steps Completed
        </Title>
        <div className="px-4">
          <Steps
            size="small"
            current={1}
            items={[
              { title: "Verify Identity" },
              { title: "Submit Details" },
              { title: "Final Verification" },
            ]}
            className="mb-8"
          />
        </div>
      </div>

      {/* Illustration Card */}
      <AntCard className="rounded-[2.5rem] border-none bg-linear-to-br from-primary/5 to-secondary/5 overflow-hidden shadow-inner">
        <div className="flex flex-col items-center py-8 text-center px-6">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-white shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
              <FileText className="h-12 w-12 text-primary" />
              <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-amber-500 border-4 border-white flex items-center justify-center">
                <AlertCircle className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
          <Paragraph className="text-sm font-medium text-muted-foreground max-w-[200px]">
            We've saved your progress. Please complete the missing steps to
            finish your verification.
          </Paragraph>
        </div>
      </AntCard>

      {/* Requirements List */}
      <div className="space-y-4">
        <h3 className="px-2 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60">
          Required Information
        </h3>
        <AntCard
          className="rounded-4xl border-border/40 bg-background/60 backdrop-blur-xl shadow-xl overflow-hidden"
          bodyStyle={{ padding: 0 }}
        >
          <div className="divide-y divide-border/10">
            {requirements.map((req) => (
              <div
                key={req.id}
                className="flex items-start gap-4 px-6 py-6 group"
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-transform group-hover:scale-110 ${req.error ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-500"}`}
                >
                  {req.status === "completed" ? (
                    <CheckCircle2 className="h-6 w-6" />
                  ) : (
                    <req.icon className="h-6 w-6" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <span
                    className={`block font-bold tracking-tight ${req.error ? "text-amber-600" : "text-foreground"}`}
                  >
                    {req.label}
                  </span>
                  <div className="flex flex-col gap-1">
                    {req.details.map((detail, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        {req.error ? (
                          <AlertCircle className="h-3 w-3 text-amber-500" />
                        ) : (
                          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                        )}
                        <span
                          className={`text-[11px] font-medium ${req.error ? "text-amber-500" : "text-muted-foreground"}`}
                        >
                          {detail}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                {req.error && (
                  <ChevronRight className="h-5 w-5 text-muted-foreground/30 self-center" />
                )}
              </div>
            ))}
          </div>
        </AntCard>
      </div>

      {/* Action Button */}
      <AntButton
        type="primary"
        size="large"
        block
        className="h-16 rounded-[1.25rem] font-black uppercase tracking-widest text-sm shadow-2xl shadow-primary/30 mt-4 group"
        onClick={onResume}
      >
        <span className="flex items-center justify-center gap-2">
          Resume Verification
          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </span>
      </AntButton>

      {/* Footer Info */}
      <p className="text-center text-[10px] text-muted-foreground/50 font-medium px-8 leading-relaxed">
        Your information is saved as a draft. You can continue from where you
        left off at any time.
      </p>
    </div>
  );
}
