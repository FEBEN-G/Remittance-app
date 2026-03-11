"use client";

import { useState, useEffect, useCallback, type ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import {
  AuthContext,
  ExchangeRateContext,
  NotificationContext,
  SendMoneyContext,
  type AuthStore,
  type ExchangeRateStore,
  type NotificationStore,
  type SendMoneyStore,
} from "@/lib/store";
import {
  authService,
  userService,
  exchangeRateService,
  notificationService,
  getAccessToken,
  setAccessToken,
} from "@/lib/api";
import type { User, ExchangeRate, Notification } from "@/types";

// Auth Provider
function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [isGuest, setGuest] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const token = getAccessToken();
      if (token) {
        const response = await userService.getProfile();
        if (response.success && response.data) {
          setUser(response.data);
        } else {
          setAccessToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    setGuest(false);
  }, []);

  const store: AuthStore = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isGuest,
    setUser,
    setLoading,
    setGuest,
    logout,
  };

  return <AuthContext.Provider value={store}>{children}</AuthContext.Provider>;
}

// Exchange Rate Provider
function ExchangeRateProvider({ children }: { children: ReactNode }) {
  const [currentRate, setRate] = useState<ExchangeRate | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRate = useCallback(async () => {
    setLoading(true);
    const response = await exchangeRateService.getCurrentRate();
    if (response.success && response.data) {
      setRate(response.data);
    } else {
      console.warn(
        "Failed to fetch exchange rate, using mock data:",
        response.error,
      );
      // Fallback to mock data for demo/dev purposes
      const { mockExchangeRate } = require("@/lib/mock-data");
      setRate(mockExchangeRate);
      setError(null); // Clear error since we have a fallback
    }
    setLoading(false);
  }, []);

  const refreshRate = useCallback(() => {
    fetchRate();
  }, [fetchRate]);

  useEffect(() => {
    fetchRate();

    // Refresh rate every 5 minutes
    const interval = setInterval(fetchRate, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchRate]);

  const store: ExchangeRateStore = {
    currentRate,
    isLoading,
    error,
    setRate,
    setLoading,
    setError,
    refreshRate,
  };

  return (
    <ExchangeRateContext.Provider value={store}>
      {children}
    </ExchangeRateContext.Provider>
  );
}

// Notification Provider
function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setLoading] = useState(true);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
    notificationService.markAsRead(id);
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    notificationService.markAllAsRead();
  }, []);

  const addNotification = useCallback((notification: Notification) => {
    setNotifications((prev) => [notification, ...prev]);
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = getAccessToken();
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await notificationService.getNotifications();
      if (response.success && response.data) {
        setNotifications(response.data);
      }
      setLoading(false);
    };

    fetchNotifications();
  }, []);

  const store: NotificationStore = {
    notifications,
    unreadCount,
    isLoading,
    setNotifications,
    markAsRead,
    markAllAsRead,
    addNotification,
    deleteNotification,
    clearAll,
  };

  return (
    <NotificationContext.Provider value={store}>
      {children}
    </NotificationContext.Provider>
  );
}

// Send Money Provider
function SendMoneyProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState(1);
  const [receiverId, setReceiver] = useState<string | null>(null);
  const [amountUSD, setAmount] = useState(0);
  const [summary, setSummary] = useState<SendMoneyStore["summary"]>(null);

  const reset = useCallback(() => {
    setStep(1);
    setReceiver(null);
    setAmount(0);
    setSummary(null);
  }, []);

  const store: SendMoneyStore = {
    step,
    receiverId,
    amountUSD,
    summary,
    setStep,
    setReceiver,
    setAmount,
    setSummary,
    reset,
  };

  return (
    <SendMoneyContext.Provider value={store}>
      {children}
    </SendMoneyContext.Provider>
  );
}

import { ConfigProvider, theme as antTheme } from "antd";
import { useTheme } from "next-themes";

// Theme Config Provider for Ant Design
function ThemeConfigProvider({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by waiting for mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="invisible">{children}</div>;
  }

  return (
    <ConfigProvider
      theme={{
        algorithm:
          resolvedTheme === "dark"
            ? antTheme.darkAlgorithm
            : antTheme.defaultAlgorithm,
        token: {
          colorPrimary: "#6D28D9", // Matches oklch(0.65 0.22 260)
          borderRadius: 12,
          fontFamily: "var(--font-sans)",
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}

// Combined Providers
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <ThemeConfigProvider>
        <AuthProvider>
          <ExchangeRateProvider>
            <NotificationProvider>
              <SendMoneyProvider>
                {children}
                <Toaster position="top-right" richColors />
              </SendMoneyProvider>
            </NotificationProvider>
          </ExchangeRateProvider>
        </AuthProvider>
      </ThemeConfigProvider>
    </ThemeProvider>
  );
}
