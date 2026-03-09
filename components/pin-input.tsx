'use client';

import { useState, useRef, useEffect, type KeyboardEvent, type ClipboardEvent } from 'react';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PinInputProps {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
}

export function PinInput({
  length = 6,
  value = '',
  onChange,
  onComplete,
  error,
  disabled = false,
  autoFocus = true,
  className,
}: PinInputProps) {
  const [pin, setPin] = useState<string[]>(value.split('').slice(0, length));
  const [showPin, setShowPin] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    const newPin = value.split('').slice(0, length);
    setPin(newPin);
  }, [value, length]);

  const handleChange = (index: number, inputValue: string) => {
    if (disabled) return;

    const digit = inputValue.replace(/\D/g, '').slice(-1);
    const newPin = [...pin];

    if (digit) {
      newPin[index] = digit;
      setPin(newPin);

      const fullValue = newPin.join('');
      onChange?.(fullValue);

      if (index < length - 1) {
        inputRefs.current[index + 1]?.focus();
        setFocusedIndex(index + 1);
      }

      if (newPin.filter(Boolean).length === length) {
        onComplete?.(fullValue);
      }
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.key === 'Backspace') {
      e.preventDefault();
      const newPin = [...pin];

      if (pin[index]) {
        newPin[index] = '';
        setPin(newPin);
        onChange?.(newPin.join(''));
      } else if (index > 0) {
        newPin[index - 1] = '';
        setPin(newPin);
        onChange?.(newPin.join(''));
        inputRefs.current[index - 1]?.focus();
        setFocusedIndex(index - 1);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setFocusedIndex(index - 1);
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
      setFocusedIndex(index + 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (disabled) return;

    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    const newPin = pastedData.split('');
    
    while (newPin.length < length) {
      newPin.push('');
    }

    setPin(newPin);
    const fullValue = newPin.join('');
    onChange?.(fullValue);

    const nextEmptyIndex = newPin.findIndex((digit) => !digit);
    const focusIndex = nextEmptyIndex === -1 ? length - 1 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
    setFocusedIndex(focusIndex);

    if (newPin.filter(Boolean).length === length) {
      onComplete?.(fullValue);
    }
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-3">
        <div className="flex gap-2">
          {Array.from({ length }).map((_, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type={showPin ? 'text' : 'password'}
              inputMode="numeric"
              maxLength={1}
              value={pin[index] || ''}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              onFocus={() => setFocusedIndex(index)}
              disabled={disabled}
              className={cn(
                'h-14 w-12 rounded-lg border-2 text-center text-xl font-semibold transition-all',
                'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
                'disabled:cursor-not-allowed disabled:opacity-50',
                error
                  ? 'border-destructive bg-destructive/5'
                  : focusedIndex === index
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-background',
              )}
              aria-label={`PIN digit ${index + 1}`}
            />
          ))}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setShowPin(!showPin)}
          className="shrink-0"
        >
          {showPin ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          <span className="sr-only">{showPin ? 'Hide PIN' : 'Show PIN'}</span>
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
