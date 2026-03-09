'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PinInput } from '@/components/pin-input';
import { toast } from 'sonner';

export default function SetupPinPage() {
  const router = useRouter();
  const [step, setStep] = useState<'create' | 'confirm'>('create');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePinCreate = (value: string) => {
    setPin(value);
    if (value.length === 6) {
      setStep('confirm');
    }
  };

  const handlePinConfirm = async (value: string) => {
    setConfirmPin(value);
    
    if (value.length === 6) {
      if (value !== pin) {
        setError('PINs do not match. Please try again.');
        setConfirmPin('');
        return;
      }

      setIsLoading(true);
      setError('');

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success('Account created successfully!');
      router.push('/home');
    }
  };

  const handleBack = () => {
    if (step === 'confirm') {
      setStep('create');
      setConfirmPin('');
      setError('');
    } else {
      router.back();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">
            {step === 'create' ? 'Create Your PIN' : 'Confirm Your PIN'}
          </CardTitle>
          <CardDescription>
            {step === 'create'
              ? 'Create a 6-digit PIN to secure your transactions'
              : 'Re-enter your PIN to confirm'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 'create' ? (
            <div className="flex justify-center">
              <PinInput
                value={pin}
                onChange={setPin}
                onComplete={handlePinCreate}
                autoFocus
              />
            </div>
          ) : (
            <div className="flex justify-center">
              <PinInput
                value={confirmPin}
                onChange={setConfirmPin}
                onComplete={handlePinConfirm}
                error={error}
                disabled={isLoading}
                autoFocus
              />
            </div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Setting up your account...</span>
            </div>
          )}

          {/* PIN Security Tips */}
          <div className="rounded-lg bg-muted/50 p-4 space-y-2">
            <p className="text-sm font-medium">PIN Security Tips</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>{"• Don't use easily guessable numbers like 123456"}</li>
              <li>{"• Avoid using your birth date or phone number"}</li>
              <li>{"• Never share your PIN with anyone"}</li>
              <li>{"• Your PIN is required for all transactions"}</li>
            </ul>
          </div>

          {/* Step Indicator */}
          <div className="flex justify-center gap-2">
            <div
              className={`h-2 w-8 rounded-full ${
                step === 'create' ? 'bg-primary' : 'bg-primary/30'
              }`}
            />
            <div
              className={`h-2 w-8 rounded-full ${
                step === 'confirm' ? 'bg-primary' : 'bg-primary/30'
              }`}
            />
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="text-muted-foreground hover:text-foreground"
          disabled={isLoading}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {step === 'confirm' ? 'Change PIN' : 'Go back'}
        </Button>
      </div>
    </div>
  );
}
