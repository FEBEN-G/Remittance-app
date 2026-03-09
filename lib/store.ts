'use client';

import { createContext, useContext } from 'react';
import type { User, ExchangeRate, Notification } from '@/types';

// Auth Store
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isGuest: boolean;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setGuest: (isGuest: boolean) => void;
  logout: () => void;
}

export type AuthStore = AuthState & AuthActions;

const defaultAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isGuest: false,
};

export const AuthContext = createContext<AuthStore | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Exchange Rate Store
interface ExchangeRateState {
  currentRate: ExchangeRate | null;
  isLoading: boolean;
  error: string | null;
}

interface ExchangeRateActions {
  setRate: (rate: ExchangeRate) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  refreshRate: () => void;
}

export type ExchangeRateStore = ExchangeRateState & ExchangeRateActions;

export const ExchangeRateContext = createContext<ExchangeRateStore | null>(null);

export function useExchangeRate() {
  const context = useContext(ExchangeRateContext);
  if (!context) {
    throw new Error('useExchangeRate must be used within an ExchangeRateProvider');
  }
  return context;
}

// Notification Store
interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
}

interface NotificationActions {
  setNotifications: (notifications: Notification[]) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Notification) => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
}

export type NotificationStore = NotificationState & NotificationActions;

export const NotificationContext = createContext<NotificationStore | null>(null);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

// Send Money Flow Store
interface SendMoneyState {
  step: number;
  receiverId: string | null;
  amountUSD: number;
  summary: {
    amountUSD: number;
    amountETB: number;
    exchangeRate: number;
    bonusRate?: number;
    fee: number;
    totalDebit: number;
    receiverGets: number;
  } | null;
}

interface SendMoneyActions {
  setStep: (step: number) => void;
  setReceiver: (receiverId: string) => void;
  setAmount: (amount: number) => void;
  setSummary: (summary: SendMoneyState['summary']) => void;
  reset: () => void;
}

export type SendMoneyStore = SendMoneyState & SendMoneyActions;

const defaultSendMoneyState: SendMoneyState = {
  step: 1,
  receiverId: null,
  amountUSD: 0,
  summary: null,
};

export const SendMoneyContext = createContext<SendMoneyStore | null>(null);

export function useSendMoney() {
  const context = useContext(SendMoneyContext);
  if (!context) {
    throw new Error('useSendMoney must be used within a SendMoneyProvider');
  }
  return context;
}
