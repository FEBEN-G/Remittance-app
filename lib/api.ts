import type {
  User,
  Receiver,
  Transaction,
  TransactionFilters,
  ExchangeRate,
  ExchangeRateHistory,
  Notification,
  NotificationPreferences,
  KYCSubmission,
  Bank,
  ApiResponse,
  PaginatedResponse,
  AuthTokens,
  RegisterData,
  LoginCredentials,
  TransactionSummary,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Token management
let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
  if (token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token);
    }
  } else {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
    }
  }
}

export function getAccessToken(): string | null {
  if (accessToken) return accessToken;
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken');
  }
  return null;
}

async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getAccessToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'An error occurred',
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

// Auth Service
export const authService = {
  async register(data: RegisterData): Promise<ApiResponse<{ userId: string }>> {
    return fetchWithAuth('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async verifyOTP(userId: string, otp: string): Promise<ApiResponse<{ verified: boolean }>> {
    return fetchWithAuth('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ userId, otp }),
    });
  },

  async resendOTP(userId: string): Promise<ApiResponse<{ sent: boolean }>> {
    return fetchWithAuth('/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  },

  async setupPIN(userId: string, pin: string): Promise<ApiResponse<AuthTokens>> {
    return fetchWithAuth('/auth/setup-pin', {
      method: 'POST',
      body: JSON.stringify({ userId, pin }),
    });
  },

  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthTokens & { user: User }>> {
    const response = await fetchWithAuth<AuthTokens & { user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data) {
      setAccessToken(response.data.accessToken);
    }

    return response;
  },

  async logout(): Promise<ApiResponse<void>> {
    const response = await fetchWithAuth<void>('/auth/logout', {
      method: 'POST',
    });
    setAccessToken(null);
    return response;
  },

  async forgotPIN(email: string): Promise<ApiResponse<{ sent: boolean }>> {
    return fetchWithAuth('/auth/forgot-pin', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async resetPIN(token: string, newPin: string): Promise<ApiResponse<{ success: boolean }>> {
    return fetchWithAuth('/auth/reset-pin', {
      method: 'POST',
      body: JSON.stringify({ token, newPin }),
    });
  },

  async refreshToken(refreshToken: string): Promise<ApiResponse<AuthTokens>> {
    return fetchWithAuth('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  },

  async verifyPIN(pin: string): Promise<ApiResponse<{ valid: boolean }>> {
    return fetchWithAuth('/auth/verify-pin', {
      method: 'POST',
      body: JSON.stringify({ pin }),
    });
  },
};

// User Service
export const userService = {
  async getProfile(): Promise<ApiResponse<User>> {
    return fetchWithAuth('/users/profile');
  },

  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return fetchWithAuth('/users/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async changePIN(currentPin: string, newPin: string): Promise<ApiResponse<{ success: boolean }>> {
    return fetchWithAuth('/users/change-pin', {
      method: 'POST',
      body: JSON.stringify({ currentPin, newPin }),
    });
  },

  async deleteAccount(pin: string): Promise<ApiResponse<void>> {
    return fetchWithAuth('/users/account', {
      method: 'DELETE',
      body: JSON.stringify({ pin }),
    });
  },
};

// Receiver Service
export const receiverService = {
  async getReceivers(): Promise<ApiResponse<Receiver[]>> {
    return fetchWithAuth('/receivers');
  },

  async getReceiver(id: string): Promise<ApiResponse<Receiver>> {
    return fetchWithAuth(`/receivers/${id}`);
  },

  async createReceiver(data: Omit<Receiver, 'id' | 'userId' | 'createdAt'>): Promise<ApiResponse<Receiver>> {
    return fetchWithAuth('/receivers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateReceiver(id: string, data: Partial<Receiver>): Promise<ApiResponse<Receiver>> {
    return fetchWithAuth(`/receivers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async deleteReceiver(id: string): Promise<ApiResponse<void>> {
    return fetchWithAuth(`/receivers/${id}`, {
      method: 'DELETE',
    });
  },

  async getBanks(): Promise<ApiResponse<Bank[]>> {
    return fetchWithAuth('/banks');
  },
};

// Transaction Service
export const transactionService = {
  async getTransactions(filters?: TransactionFilters): Promise<ApiResponse<PaginatedResponse<Transaction>>> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.append('dateTo', filters.dateTo);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    return fetchWithAuth(`/transactions?${params.toString()}`);
  },

  async getTransaction(id: string): Promise<ApiResponse<Transaction>> {
    return fetchWithAuth(`/transactions/${id}`);
  },

  async calculateSummary(amountUSD: number, receiverId: string): Promise<ApiResponse<TransactionSummary>> {
    return fetchWithAuth('/transactions/calculate', {
      method: 'POST',
      body: JSON.stringify({ amountUSD, receiverId }),
    });
  },

  async createTransaction(data: {
    receiverId: string;
    amountUSD: number;
    pin: string;
  }): Promise<ApiResponse<Transaction>> {
    return fetchWithAuth('/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async cancelTransaction(id: string): Promise<ApiResponse<Transaction>> {
    return fetchWithAuth(`/transactions/${id}/cancel`, {
      method: 'POST',
    });
  },

  async getReceipt(id: string): Promise<ApiResponse<Blob>> {
    const token = getAccessToken();
    const response = await fetch(`${API_BASE_URL}/transactions/${id}/receipt`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      return { success: false, error: 'Failed to generate receipt' };
    }
    
    const blob = await response.blob();
    return { success: true, data: blob };
  },
};

// Exchange Rate Service
export const exchangeRateService = {
  async getCurrentRate(): Promise<ApiResponse<ExchangeRate>> {
    return fetchWithAuth('/exchange-rate/current');
  },

  async getRateHistory(days: number = 30): Promise<ApiResponse<ExchangeRateHistory[]>> {
    return fetchWithAuth(`/exchange-rate/history?days=${days}`);
  },
};

// KYC Service
export const kycService = {
  async getStatus(): Promise<ApiResponse<KYCSubmission | null>> {
    return fetchWithAuth('/kyc/status');
  },

  async submitLevel1(data: FormData): Promise<ApiResponse<KYCSubmission>> {
    const token = getAccessToken();
    const response = await fetch(`${API_BASE_URL}/kyc/submit/level1`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });

    const responseData = await response.json();

    if (!response.ok) {
      return { success: false, error: responseData.message };
    }

    return { success: true, data: responseData };
  },

  async submitLevel2(data: FormData): Promise<ApiResponse<KYCSubmission>> {
    const token = getAccessToken();
    const response = await fetch(`${API_BASE_URL}/kyc/submit/level2`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });

    const responseData = await response.json();

    if (!response.ok) {
      return { success: false, error: responseData.message };
    }

    return { success: true, data: responseData };
  },
};

// Notification Service
export const notificationService = {
  async getNotifications(): Promise<ApiResponse<Notification[]>> {
    return fetchWithAuth('/notifications');
  },

  async markAsRead(id: string): Promise<ApiResponse<void>> {
    return fetchWithAuth(`/notifications/${id}/read`, {
      method: 'POST',
    });
  },

  async markAllAsRead(): Promise<ApiResponse<void>> {
    return fetchWithAuth('/notifications/read-all', {
      method: 'POST',
    });
  },

  async getPreferences(): Promise<ApiResponse<NotificationPreferences>> {
    return fetchWithAuth('/notifications/preferences');
  },

  async updatePreferences(data: Partial<NotificationPreferences>): Promise<ApiResponse<NotificationPreferences>> {
    return fetchWithAuth('/notifications/preferences', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};
