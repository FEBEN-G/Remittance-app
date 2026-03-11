import type {
  User,
  Receiver,
  Transaction,
  Bank,
  ExchangeRate,
  ExchangeRateHistory,
  Notification,
  KYCSubmission,
  Wallet,
  PaymentMethod,
  Referral,
  ReferralStats,
  GiftPackage,
  DonationCause,
  CrowdfundingCampaign,
} from "@/types";

export const mockUser: User = {
  id: "user-1",
  email: "john.doe@example.com",
  phone: "+1234567890",
  phoneNumber: "+1234567890",
  firstName: "John",
  lastName: "Doe",
  dateOfBirth: "1990-05-15",
  avatarUrl: undefined,
  address: "123 Main Street",
  city: "Los Angeles",
  country: "United States",
  kycLevel: 1,
  kycStatus: "approved",
  referralCode: "JOHN2024",
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-02-20T14:45:00Z",
};

export const mockBanks: Bank[] = [
  {
    id: "bank-1",
    name: "Commercial Bank of Ethiopia (CBE)",
    code: "CBE",
    logo: "/banks/cbe.png",
  },
  { id: "bank-2", name: "Awash Bank", code: "AWASH", logo: "/banks/awash.png" },
  {
    id: "bank-3",
    name: "Dashen Bank",
    code: "DASHEN",
    logo: "/banks/dashen.png",
  },
  { id: "bank-4", name: "Abyssinia Bank", code: "BOA", logo: "/banks/boa.png" },
  {
    id: "bank-5",
    name: "Wegagen Bank",
    code: "WEGAGEN",
    logo: "/banks/wegagen.png",
  },
  {
    id: "bank-6",
    name: "Hibret Bank",
    code: "HIBRET",
    logo: "/banks/hibret.png",
  },
  {
    id: "bank-7",
    name: "NIB International Bank",
    code: "NIB",
    logo: "/banks/nib.png",
  },
  { id: "bank-8", name: "Zemen Bank", code: "ZEMEN", logo: "/banks/zemen.png" },
  {
    id: "bank-9",
    name: "Bunna International Bank",
    code: "BUNNA",
    logo: "/banks/bunna.png",
  },
  {
    id: "bank-10",
    name: "Berhan Bank",
    code: "BERHAN",
    logo: "/banks/berhan.png",
  },
  { id: "bank-11", name: "Abay Bank", code: "ABAY", logo: "/banks/abay.png" },
  { id: "bank-12", name: "Enat Bank", code: "ENAT", logo: "/banks/enat.png" },
  {
    id: "bank-13",
    name: "Cooperative Bank of Oromia",
    code: "COOPBANK",
    logo: "/banks/coop.png",
  },
];

export const mockReceivers: Receiver[] = [
  {
    id: "receiver-1",
    userId: "user-1",
    fullName: "Abebe Bekele",
    bankId: "bank-1",
    bankCode: "CBE",
    bankName: "Commercial Bank of Ethiopia (CBE)",
    accountNumber: "1000012345678",
    phone: "+251911234567",
    createdAt: "2024-01-20T08:00:00Z",
  },
  {
    id: "receiver-2",
    userId: "user-1",
    fullName: "Tigist Haile",
    bankId: "bank-2",
    bankCode: "AWASH",
    bankName: "Awash Bank",
    accountNumber: "0145678901234",
    phone: "+251922345678",
    createdAt: "2024-02-01T10:30:00Z",
  },
  {
    id: "receiver-3",
    userId: "user-1",
    fullName: "Dawit Mengistu",
    bankId: "bank-3",
    bankCode: "DASHEN",
    bankName: "Dashen Bank",
    accountNumber: "0198765432100",
    phone: "+251933456789",
    createdAt: "2024-02-15T14:00:00Z",
  },
];

export const mockExchangeRate: ExchangeRate = {
  id: "rate_1",
  fromCurrency: "USD",
  toCurrency: "ETB",
  rate: 152.79,
  bonusRate: 0,
  effectiveRate: 152.79,
  date: new Date().toISOString(),
  currency: "USD",
};

export const mockRateHistory: ExchangeRateHistory[] = Array.from(
  { length: 30 },
  (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toISOString().split("T")[0],
      rate: 151 + Math.random() * 3,
    };
  },
);

export const mockTransactions: Transaction[] = [
  {
    id: "txn-1",
    referenceNumber: "RMT2024030001",
    senderId: "user-1",
    receiverId: "receiver-1",
    receiverName: "Abebe Bekele",
    receiver: mockReceivers[0],
    amountUSD: 200,
    amountETB: 25320,
    exchangeRate: 126.6,
    bonusRate: 0.1,
    fee: 3.99,
    totalAmount: 203.99,
    status: "completed",
    purpose: "Family Support",
    createdAt: "2024-03-01T14:30:00Z",
    completedAt: "2024-03-01T14:32:00Z",
  },
  {
    id: "txn-2",
    referenceNumber: "RMT2024030002",
    senderId: "user-1",
    receiverId: "receiver-2",
    receiverName: "Tigist Haile",
    receiver: mockReceivers[1],
    amountUSD: 150,
    amountETB: 18990,
    exchangeRate: 126.6,
    fee: 2.99,
    totalAmount: 152.99,
    status: "completed",
    purpose: "Education",
    createdAt: "2024-02-28T10:15:00Z",
    completedAt: "2024-02-28T10:17:00Z",
  },
  {
    id: "txn-3",
    referenceNumber: "RMT2024030003",
    senderId: "user-1",
    receiverId: "receiver-3",
    receiverName: "Dawit Mengistu",
    receiver: mockReceivers[2],
    amountUSD: 500,
    amountETB: 63300,
    exchangeRate: 126.6,
    fee: 7.99,
    totalAmount: 507.99,
    status: "pending",
    purpose: "Business",
    createdAt: new Date().toISOString(),
  },
  {
    id: "txn-4",
    referenceNumber: "RMT2024020004",
    senderId: "user-1",
    receiverId: "receiver-1",
    receiverName: "Abebe Bekele",
    receiver: mockReceivers[0],
    amountUSD: 100,
    amountETB: 12650,
    exchangeRate: 126.5,
    fee: 1.99,
    totalAmount: 101.99,
    status: "failed",
    purpose: "Family Support",
    createdAt: "2024-02-20T16:45:00Z",
    failureReason: "Invalid account number",
  },
];

export const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    userId: "user-1",
    type: "transaction",
    title: "Transfer Completed",
    message:
      "Your transfer of $200 to Abebe Bekele has been completed successfully. The recipient should receive the funds within 24 hours.",
    read: false,
    createdAt: "2024-03-01T14:32:00Z",
    actionUrl: "/transactions/txn-1",
    actionLabel: "View Transaction",
    metadata: {
      amount: "$200.00",
      receiver: "Abebe Bekele",
      status: "Completed",
    },
  },
  {
    id: "notif-2",
    userId: "user-1",
    type: "security",
    title: "New Login Detected",
    message:
      "We noticed a new sign-in to your account from Chrome on Windows. If this was you, you can ignore this message.",
    read: false,
    createdAt: "2024-03-01T10:15:00Z",
    metadata: {
      device: "Chrome on Windows",
      location: "Los Angeles, CA",
      ip_address: "192.168.1.x",
    },
  },
  {
    id: "notif-3",
    userId: "user-1",
    type: "kyc",
    title: "KYC Approved",
    message:
      "Your KYC Level 1 verification has been approved. You can now send up to $500 per transaction.",
    read: true,
    createdAt: "2024-02-25T09:00:00Z",
    actionUrl: "/kyc",
    actionLabel: "View KYC Status",
  },
  {
    id: "notif-4",
    userId: "user-1",
    type: "promotion",
    title: "Bonus Rate Available",
    message:
      "Get an extra 0.10 ETB per dollar on all transfers this week! Limited time offer ends Sunday.",
    read: false,
    createdAt: "2024-03-01T08:00:00Z",
    actionUrl: "/send",
    actionLabel: "Send Now",
    metadata: {
      bonus_rate: "+0.10 ETB",
      valid_until: "March 7, 2024",
    },
  },
  {
    id: "notif-5",
    userId: "user-1",
    type: "referral",
    title: "Referral Bonus Earned",
    message:
      "Your friend John Smith just made their first transfer! You earned $5.00 referral bonus.",
    read: true,
    createdAt: "2024-02-28T16:45:00Z",
    actionUrl: "/referrals",
    actionLabel: "View Referrals",
    metadata: {
      referred_user: "John S.",
      bonus_earned: "$5.00",
    },
  },
  {
    id: "notif-6",
    userId: "user-1",
    type: "system",
    title: "Scheduled Maintenance",
    message:
      "We will be performing scheduled maintenance on March 5th from 2:00 AM to 4:00 AM EST. Services may be temporarily unavailable.",
    read: true,
    createdAt: "2024-02-27T12:00:00Z",
  },
];

export const mockKYCSubmission: KYCSubmission = {
  id: "kyc-1",
  userId: "user-1",
  level: 1,
  status: "approved",
  documentType: "passport",
  documentFrontUrl: "/documents/passport-front.jpg",
  documentBackUrl: "/documents/passport-back.jpg",
  submittedAt: "2024-02-24T10:00:00Z",
  reviewedAt: "2024-02-25T09:00:00Z",
};

// Wallet Mock Data
export const mockWallets: Wallet[] = [
  {
    id: "wallet-1",
    userId: "user-1",
    currency: "USD",
    balance: 1250.0,
    availableBalance: 1200.0,
    pendingBalance: 50.0,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-03-01T14:32:00Z",
  },
  {
    id: "wallet-2",
    userId: "user-1",
    currency: "ETB",
    balance: 25000.0,
    availableBalance: 25000.0,
    pendingBalance: 0,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-03-01T14:32:00Z",
  },
];

// Payment Methods Mock Data
export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "pm-1",
    userId: "user-1",
    type: "mastercard",
    lastFourDigits: "4242",
    expiryMonth: "12",
    expiryYear: "2026",
    cardholderName: "JOHN DOE",
    isDefault: true,
    createdAt: "2024-01-20T10:00:00Z",
  },
  {
    id: "pm-2",
    userId: "user-1",
    type: "visa",
    lastFourDigits: "1234",
    expiryMonth: "08",
    expiryYear: "2025",
    cardholderName: "JOHN DOE",
    isDefault: false,
    createdAt: "2024-02-15T14:00:00Z",
  },
];

// Referral Mock Data
export const mockReferrals: Referral[] = [
  {
    id: "ref-1",
    referrerId: "user-1",
    referredUserId: "user-2",
    referredUserName: "Sarah Johnson",
    status: "rewarded",
    rewardAmount: 10,
    rewardCurrency: "USD",
    createdAt: "2024-02-01T10:00:00Z",
    rewardedAt: "2024-02-05T10:00:00Z",
  },
  {
    id: "ref-2",
    referrerId: "user-1",
    referredUserId: "user-3",
    referredUserName: "Michael Brown",
    status: "active",
    rewardAmount: 10,
    rewardCurrency: "USD",
    createdAt: "2024-02-15T14:00:00Z",
  },
  {
    id: "ref-3",
    referrerId: "user-1",
    referredUserId: "user-4",
    referredUserName: "Emily Davis",
    status: "pending",
    rewardAmount: 10,
    rewardCurrency: "USD",
    createdAt: "2024-03-01T09:00:00Z",
  },
];

export const mockReferralStats: ReferralStats = {
  totalReferrals: 3,
  activeReferrals: 1,
  pendingReferrals: 1,
  totalEarnings: 10,
  currency: "USD",
};

// Gift Packages Mock Data
export const mockGiftPackages: GiftPackage[] = [
  {
    id: "gift-1",
    name: "Birthday Gift",
    description: "Celebrate a special birthday with a money gift",
    imageUrl: "/gifts/birthday.jpg",
    category: "birthday",
    minAmount: 25,
    maxAmount: 500,
    fee: 2.99,
    isActive: true,
  },
  {
    id: "gift-2",
    name: "Wedding Gift",
    description: "Send your best wishes on their special day",
    imageUrl: "/gifts/wedding.jpg",
    category: "wedding",
    minAmount: 50,
    maxAmount: 1000,
    fee: 4.99,
    isActive: true,
  },
  {
    id: "gift-3",
    name: "Holiday Gift",
    description: "Share the joy of the holidays",
    imageUrl: "/gifts/holiday.jpg",
    category: "holiday",
    minAmount: 25,
    maxAmount: 500,
    fee: 2.99,
    isActive: true,
  },
  {
    id: "gift-4",
    name: "Graduation Gift",
    description: "Congratulate a new graduate",
    imageUrl: "/gifts/graduation.jpg",
    category: "graduation",
    minAmount: 50,
    maxAmount: 500,
    fee: 2.99,
    isActive: true,
  },
];

// Donation Causes Mock Data
export const mockDonationCauses: DonationCause[] = [
  {
    id: "cause-1",
    name: "Education for All",
    description:
      "Help provide quality education to underprivileged children in Ethiopia",
    imageUrl: "/causes/education.jpg",
    category: "education",
    organizationName: "Ethiopian Education Foundation",
    targetAmount: 50000,
    raisedAmount: 32500,
    currency: "USD",
    isActive: true,
  },
  {
    id: "cause-2",
    name: "Clean Water Initiative",
    description: "Bring clean drinking water to rural communities",
    imageUrl: "/causes/water.jpg",
    category: "health",
    organizationName: "Water for Ethiopia",
    targetAmount: 25000,
    raisedAmount: 18750,
    currency: "USD",
    isActive: true,
  },
  {
    id: "cause-3",
    name: "Disaster Relief Fund",
    description: "Support families affected by natural disasters",
    imageUrl: "/causes/disaster.jpg",
    category: "disaster",
    organizationName: "Ethiopian Red Cross",
    targetAmount: 100000,
    raisedAmount: 67000,
    currency: "USD",
    isActive: true,
  },
];

// Crowdfunding Campaigns Mock Data
export const mockCrowdfundingCampaigns: CrowdfundingCampaign[] = [
  {
    id: "campaign-1",
    creatorId: "user-10",
    creatorName: "Yohannes Tesfaye",
    title: "Medical Treatment for My Mother",
    description: "Help fund my mothers heart surgery at Black Lion Hospital",
    imageUrl: "/campaigns/medical.jpg",
    category: "medical",
    targetAmount: 15000,
    raisedAmount: 8500,
    currency: "USD",
    contributorsCount: 127,
    status: "active",
    endDate: "2024-04-15T00:00:00Z",
    createdAt: "2024-02-01T10:00:00Z",
  },
  {
    id: "campaign-2",
    creatorId: "user-11",
    creatorName: "Marta Hailu",
    title: "Start My Coffee Business",
    description: "Help me start a specialty coffee export business in Sidama",
    imageUrl: "/campaigns/business.jpg",
    category: "business",
    targetAmount: 10000,
    raisedAmount: 4200,
    currency: "USD",
    contributorsCount: 45,
    status: "active",
    endDate: "2024-05-01T00:00:00Z",
    createdAt: "2024-02-15T14:00:00Z",
  },
  {
    id: "campaign-3",
    creatorId: "user-12",
    creatorName: "Abenet Girma",
    title: "School Supplies for Orphanage",
    description:
      "Provide school supplies for 50 children at Kidane Mihret Orphanage",
    imageUrl: "/campaigns/education.jpg",
    category: "education",
    targetAmount: 2500,
    raisedAmount: 2100,
    currency: "USD",
    contributorsCount: 89,
    status: "active",
    endDate: "2024-03-30T00:00:00Z",
    createdAt: "2024-01-20T08:00:00Z",
  },
];

// Helper functions
export function calculateTransactionSummary(
  amountUSD: number,
  rate: ExchangeRate,
) {
  const fee =
    amountUSD < 100
      ? 1.99
      : amountUSD < 300
        ? 3.99
        : amountUSD < 500
          ? 5.99
          : 7.99;
  const effectiveRate = rate.rate + (rate.bonusRate || 0);
  const amountETB = amountUSD * effectiveRate;

  return {
    amountUSD,
    amountETB,
    exchangeRate: rate.rate,
    bonusRate: rate.bonusRate,
    fee,
    totalDebit: amountUSD + fee,
    receiverGets: amountETB,
  };
}

export function generateReferralCode(firstName: string): string {
  const randomNum = Math.floor(Math.random() * 10000);
  return `${firstName.toUpperCase().slice(0, 4)}${randomNum}`;
}
