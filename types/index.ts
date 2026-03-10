// User & Authentication Types
export interface User {
  id: string;
  email: string;
  phone: string;
  phoneNumber?: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  avatarUrl?: string;
  address?: Address | string;
  city?: string;
  country?: string;
  kycLevel: KYCLevel;
  kycStatus: KYCStatus;
  referralCode: string;
  referredBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export type KYCLevel = 0 | 1 | 2 | 3;

export type KYCStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "not_submitted"
  | "incomplete";

export interface KYCSubmission {
  id: string;
  userId: string;
  level: KYCLevel;
  status: KYCStatus;
  documentType: "passport" | "drivers_license" | "national_id";
  documentFrontUrl?: string;
  documentBackUrl?: string;
  selfieUrl?: string;
  proofOfAddressUrl?: string;
  rejectionReason?: string;
  submittedAt: string;
  reviewedAt?: string;
}

// Wallet Types
export interface Wallet {
  id: string;
  userId: string;
  currency: string;
  balance: number;
  availableBalance: number;
  pendingBalance: number;
  createdAt: string;
  updatedAt: string;
}

export interface WalletTransaction {
  id: string;
  walletId: string;
  type: "deposit" | "withdrawal" | "transfer" | "refund";
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed";
  description: string;
  createdAt: string;
}

// Payment Method Types
export interface PaymentMethod {
  id: string;
  userId: string;
  type: "mastercard" | "visa" | "bank_account";
  lastFourDigits: string;
  expiryMonth?: string;
  expiryYear?: string;
  cardholderName?: string;
  bankName?: string;
  isDefault: boolean;
  createdAt: string;
}

// Transaction Types
export type TransactionStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled";

export interface Transaction {
  id: string;
  referenceNumber: string;
  senderId: string;
  receiverId: string;
  receiverName: string;
  receiver: Receiver;
  amountUSD: number;
  amountETB: number;
  exchangeRate: number;
  bonusRate?: number;
  fee: number;
  totalAmount: number;
  status: TransactionStatus;
  purpose?: string;
  createdAt: string;
  completedAt?: string;
  failureReason?: string;
}

export interface TransactionSummary {
  amountUSD: number;
  amountETB: number;
  exchangeRate: number;
  bonusRate?: number;
  fee: number;
  totalDebit: number;
  receiverGets: number;
}

export interface TransactionDetails {
  sendAmount: number;
  receiveAmount: number;
  sendCurrency: string;
  receiveCurrency: string;
  exchangeRate: number;
  fees: number;
  total: number;
  receiver: Receiver;
  purpose: string;
}

// Receiver/Beneficiary Types
export interface Receiver {
  id: string;
  userId: string;
  fullName: string;
  bankId: string;
  bankCode: string;
  bankName: string;
  accountNumber: string;
  phone?: string;
  createdAt: string;
}

export interface Bank {
  id: string;
  name: string;
  code: string;
  logo?: string;
}

// Exchange Rate Types
export interface ExchangeRate {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  bonusRate?: number;
  effectiveRate: number;
  date: string;
  currency: "USD" | "ETB";
}

export interface ExchangeRateHistory {
  date: string;
  rate: number;
}

// Referral Types
export interface Referral {
  id: string;
  referrerId: string;
  referredUserId: string;
  referredUserName: string;
  status: "pending" | "active" | "rewarded";
  rewardAmount: number;
  rewardCurrency: string;
  createdAt: string;
  rewardedAt?: string;
}

export interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  pendingReferrals: number;
  totalEarnings: number;
  currency: string;
}

// Gift Package Types
export interface GiftPackage {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: "birthday" | "wedding" | "holiday" | "graduation" | "other";
  minAmount: number;
  maxAmount: number;
  fee: number;
  isActive: boolean;
}

export interface GiftTransaction {
  id: string;
  senderId: string;
  recipientName: string;
  recipientPhone: string;
  recipientEmail?: string;
  packageId: string;
  package: GiftPackage;
  amountUSD: number;
  amountETB: number;
  message: string;
  deliveryDate: string;
  status: TransactionStatus;
  createdAt: string;
}

// Donation Types
export interface DonationCause {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: "education" | "health" | "environment" | "disaster" | "community";
  organizationName: string;
  targetAmount: number;
  raisedAmount: number;
  currency: string;
  isActive: boolean;
  endDate?: string;
}

export interface Donation {
  id: string;
  donorId: string;
  causeId: string;
  cause: DonationCause;
  amountUSD: number;
  amountETB: number;
  isAnonymous: boolean;
  message?: string;
  status: TransactionStatus;
  createdAt: string;
}

// Crowdfunding Types
export interface CrowdfundingCampaign {
  id: string;
  creatorId: string;
  creatorName: string;
  title: string;
  description: string;
  imageUrl: string;
  category:
    | "medical"
    | "education"
    | "business"
    | "emergency"
    | "community"
    | "personal";
  targetAmount: number;
  raisedAmount: number;
  currency: string;
  contributorsCount: number;
  status: "active" | "completed" | "cancelled";
  endDate: string;
  createdAt: string;
}

export interface CrowdfundingContribution {
  id: string;
  contributorId: string;
  campaignId: string;
  campaign: CrowdfundingCampaign;
  amountUSD: number;
  amountETB: number;
  isAnonymous: boolean;
  message?: string;
  status: TransactionStatus;
  createdAt: string;
}

// Notification Types
export type NotificationType =
  | "transaction"
  | "kyc"
  | "security"
  | "promotion"
  | "system"
  | "referral"
  | "gift"
  | "donation";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, string | number>;
}

export interface NotificationPreferences {
  pushEnabled: boolean;
  emailEnabled: boolean;
  transactionAlerts: boolean;
  kycUpdates: boolean;
  promotions: boolean;
  securityAlerts: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  pin: string;
}

export interface RegisterData {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  referralCode?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// Filter Types
export interface TransactionFilters {
  status?: TransactionStatus;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

// KYC Limits with 3 tiers
export const KYC_LIMITS: Record<
  KYCLevel,
  { perTransaction: number; monthly: number; description: string }
> = {
  0: {
    perTransaction: 0,
    monthly: 0,
    description: "View only - no transactions",
  },
  1: {
    perTransaction: 500,
    monthly: 1000,
    description: "Domestic basic - Up to $500/tx",
  },
  2: {
    perTransaction: 3000,
    monthly: 10000,
    description: "International standard - Up to $3000/tx",
  },
  3: {
    perTransaction: 10000,
    monthly: 50000,
    description: "Premium - Full limits",
  },
};

// Partner API Types
export interface PartnerApiKey {
  id: string;
  partnerId: string;
  apiKey: string;
  secretKey: string;
  name: string;
  permissions: string[];
  rateLimit: number;
  isActive: boolean;
  createdAt: string;
  lastUsedAt?: string;
}

export interface PartnerTransaction {
  id: string;
  partnerId: string;
  externalReference: string;
  transaction: Transaction;
  commissionRate: number;
  commissionAmount: number;
  status: TransactionStatus;
  createdAt: string;
}
