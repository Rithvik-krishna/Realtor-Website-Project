/**
 * NovaEstate Mobile - Domain Type Definitions
 */

export type UserRole = 'AGENT' | 'BUYER' | 'SELLER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  brokerageName?: string;
  licenseNumber?: string;
  createdAt: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  budgetMax: number;
  preferredCities: string[];
  isVip?: boolean;
  notes?: string[];
  createdAt: string;
}

export type PropertyType = 'DETACHED' | 'SEMI_DETACHED' | 'TOWNHOUSE' | 'CONDO' | 'COMMERCIAL';
export type ListingStatus = 'ACTIVE' | 'PENDING' | 'SOLD' | 'DRAFT';

export interface Property {
  id: string;
  slug: string;
  mlsNumber: string;
  title: string;
  description: string;
  price: number;
  city: string;
  address: string;
  neighborhood: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  propertyType: PropertyType;
  status: ListingStatus;
  isFeatured: boolean;
  virtualTourUrl?: string;
  images: string[];
  walkScore?: number;
  maintenanceFee?: number;
  yearBuilt?: number;
  lifestyleTags?: string[];
  agentId?: string;
  features?: string[];
  daysOnMarket?: number;
  garage?: string;
  propertyStatus?: string;
  listOfficeName?: string;
  createdAt: string;
}

export type LeadInquiryType = 'REQUEST_SHOWING' | 'ASK_QUESTION' | 'CONTACT_AGENT' | 'SAVED_SEARCH';
export type LeadStatus = 'NEW' | 'CONTACTED';

export interface Lead {
  id: string;
  clientName: string;
  email: string;
  phone: string;
  propertyAddress?: string;
  mlsNumber?: string;
  message?: string;
  inquiryType: LeadInquiryType;
  status: LeadStatus;
  timestamp: string;
  budgetMin?: number;
  budgetMax?: number;
  preferredCities?: string[];
  notes?: string[];
  lastContactedAt?: string;
}

export type AppointmentStatus = 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'RESCHEDULED';

export interface ShowingAppointment {
  id: string;
  propertyId: string;
  property?: Property;
  clientId: string;
  clientName: string;
  clientPhone: string;
  appointmentDate: string;
  durationMinutes: number;
  status: AppointmentStatus;
  realtorNotes?: string;
  voiceNoteUrl?: string;
  createdAt: string;
}

export interface HomeValuationRequest {
  address: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  propertyType: PropertyType;
  condition: 'EXCELLENT' | 'GOOD' | 'FAIR';
}

export interface HomeValuationResult {
  estimatedValue: number;
  valueRangeMin: number;
  valueRangeMax: number;
  demandScore: number; // 0-100
  comparableListings: Property[];
  generatedAt: string;
}

export interface MarketStats {
  region: string;
  avgPrice: number;
  medianPrice: number;
  daysOnMarket: number;
  activeListingsCount: number;
  appreciationRateYearly: number;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}
