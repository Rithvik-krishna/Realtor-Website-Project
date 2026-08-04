/**
 * Canadian Realtor Platform - Frontend API Service Client
 * Handles HTTP requests, JWT authentication tokens, and backend communication.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

class ApiService {
  private getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  /**
   * Ping backend health endpoint to check connection
   */
  async checkBackendHealth(): Promise<{ isConnected: boolean; message: string }> {
    try {
      const res = await fetch('/health').catch(() => fetch('http://localhost:5000/health'));
      if (!res || !res.ok) throw new Error(res ? `HTTP ${res.status}` : 'Offline');
      const data = await res.json();
      return { isConnected: data.success === true, message: data.message || 'Connected to Canadian Realtor Backend API' };
    } catch (err: any) {
      return { isConnected: false, message: 'Backend server offline (Mock/Local Mode)' };
    }
  }

  /**
   * Authenticate user (Login)
   */
  async login(email: string, passwordHash: string) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password: passwordHash })
    });
    const data = await res.json();
    if (data.success && data.data?.accessToken) {
      localStorage.setItem('auth_token', data.data.accessToken);
    }
    return data;
  }

  /**
   * Register new user (Signup)
   */
  async signup(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role?: 'BUYER' | 'SELLER' | 'AGENT' | 'ADMIN';
  }) {
    const res = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(userData)
    });
    return await res.json();
  }

  /**
   * Fetch listing properties from backend
   */
  async getProperties(params?: {
    city?: string;
    propertyType?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    isFeatured?: boolean;
    page?: number;
    limit?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          queryParams.append(key, String(val));
        }
      });
    }
    const url = `${API_BASE_URL}/properties?${queryParams.toString()}`;
    const res = await fetch(url, { headers: this.getHeaders() });
    return await res.json();
  }

  /**
   * Get single property details by ID or Slug
   */
  async getPropertyById(idOrSlug: string) {
    const res = await fetch(`${API_BASE_URL}/properties/${idOrSlug}`, {
      headers: this.getHeaders()
    });
    return await res.json();
  }

  /**
   * Full-text search
   */
  async searchProperties(query: string) {
    const res = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`, {
      headers: this.getHeaders()
    });
    return await res.json();
  }

  /**
   * Home valuation request (Seller experience)
   */
  async requestHomeValuation(valuationData: {
    address: string;
    city: string;
    bedrooms: number;
    bathrooms: number;
    contactName: string;
    contactEmail: string;
    contactPhone?: string;
    notes?: string;
  }) {
    const res = await fetch(`${API_BASE_URL}/seller/valuation`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(valuationData)
    });
    return await res.json();
  }

  /**
   * AI Real Estate Assistant prompt parsing / Q&A
   */
  async queryAIAssistant(prompt: string) {
    const res = await fetch(`${API_BASE_URL}/ai/assistant`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ prompt })
    });
    return await res.json();
  }

  /**
   * Parse natural language search into structured query
   */
  async parseAISearch(prompt: string) {
    const res = await fetch(`${API_BASE_URL}/ai/search-parse`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ prompt })
    });
    return await res.json();
  }

  /**
   * Fetch market statistics
   */
  async getMarketStats(region = 'GTA') {
    const res = await fetch(`${API_BASE_URL}/analytics/market?region=${encodeURIComponent(region)}`, {
      headers: this.getHeaders()
    });
    return await res.json();
  }
}

export const apiService = new ApiService();
