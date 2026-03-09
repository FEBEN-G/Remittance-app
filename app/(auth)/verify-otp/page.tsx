'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Mail, Phone, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@/components/ui/input-otp';
import { toast } from 'sonner';

function VerifyOTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const phone = searchParams.get('phone') || '';

  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter the complete 6-digit code');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success('Verification successful!');
    router.push('/setup-pin');
  };

  const handleResend = async () => {
    if (!canResend) return;

    setCanResend(false);
    setResendTimer(60);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success('Verification code resent!');
  };

  const maskedEmail = email
    ? `${email.slice(0, 3)}***@${email.split('@')[1]}`
    : '';
  const maskedPhone = phone
    ? `${phone.slice(0, 4)}***${phone.slice(-4)}`
    : '';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Verify Your Account</CardTitle>
          <CardDescription className="space-y-2">
            <p>{"We've sent a verification code to:"}</p>
            {email && (
              <div className="flex items-center justify-center gap-2 text-foreground font-medium">
                <Mail className="h-4 w-4 text-primary" />
                <span>{maskedEmail}</span>
              </div>
            )}
            {phone && (
              <div className="flex items-center justify-center gap-2 text-foreground font-medium">
                <Phone className="h-4 w-4 text-primary" />
                <span>{maskedPhone}</span>
              </div>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-muted-foreground">Enter the 6-digit code</p>
            
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={setOtp}
              disabled={isLoading}
              className="gap-2"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} className="h-14 w-12 text-xl" />
                <InputOTPSlot index={1} className="h-14 w-12 text-xl" />
                <InputOTPSlot index={2} className="h-14 w-12 text-xl" />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} className="h-14 w-12 text-xl" />
                <InputOTPSlot index={4} className="h-14 w-12 text-xl" />
                <InputOTPSlot index={5} className="h-14 w-12 text-xl" />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button
            onClick={handleVerify}
            className="w-full"
            size="lg"
            disabled={isLoading || otp.length !== 6}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify'
            )}
          </Button>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              {"Didn't receive the code?"}
            </p>
            {canResend ? (
              <Button variant="link" onClick={handleResend} className="text-primary">
                Resend Code
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground">
                Resend code in{' '}
                <span className="font-medium text-foreground">{resendTimer}s</span>
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go back
        </Button>
      </div>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <VerifyOTPContent />
    </Suspense>
  );
}
