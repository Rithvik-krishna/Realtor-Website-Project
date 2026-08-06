import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { apiService } from '../services/api';

// Interfaces for NovaEstate Luxury Data Structure
export interface Property {
  id: string;
  title: string;
  price: number;
  previousPrice: number;
  priceDrop: number;
  location: string;
  city: string;
  province: string;
  postalCode: string;
  mlsNumber: string;
  beds: number;
  baths: number;
  sqft: number;
  lotSize: number;
  propertyTax: number;
  yearBuilt: number;
  walkScore: number;
  transitScore: number;
  schoolScore: number;
  energyRating: number;
  propertyStatus: string;
  daysOnMarket: number;
  propertyType: string;
  propertySubType?: string;
  estateClassification: string;
  luxuryBadge: boolean;
  openHouse?: string;
  virtualTour: boolean;
  droneTour: boolean;
  featured: boolean;
  recentlyAdded: boolean;
  aiRecommended: boolean;
  imageUrl: string;
  images?: string[];
  mediaItems?: any[];
  category: string; // Alpine, Waterfront, Penthouse, Architectural, Suburban, Urban
  description: string;
  monthlyHOA: number;
  taxes: number;
  features: string[];
  basement: string;
  garage: string;
  crimeRate: string;
  hospitalRating: string;
  lat: number;
  lng: number;
  address: string;
  typology: string;
  amenities: string[];
  floorPlanUrl?: string;
  videoUrl?: string;
  listOfficeName?: string;
  disp_addr?: boolean;
  agent: {
    name: string;
    role: string;
    phone: string;
    email: string;
    avatar: string;
  };
}

export interface Community {
  name: string;
  city: string;
  description: string;
  averagePrice: string;
  walkScore: number;
  transitScore: number;
  schoolRating: number;
  lifestyleTags: string[];
  imageUrl: string;
  marketTrend: 'Upward' | 'Stable' | 'Correction';
  crimeIndex: 'Minimal' | 'Extremely Low' | 'Low';
}

export interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: 
    | 'Market Insights' 
    | 'Buying Guides' 
    | 'Selling Guides' 
    | 'Mortgage Tips' 
    | 'Investment Articles' 
    | 'Community News' 
    | 'AI Real Estate Tips' 
    | 'Interior Design' 
    | 'Luxury Home Inspiration';
  readTime: string;
  date: string;
  author: string;
  imageUrl: string;
  featured?: boolean;
  tags: string[];
  likes: number;
  shares: number;
  bookmarks: boolean;
  relatedIds: string[];
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

export interface SavedSearch {
  id: string;
  name: string;
  city: string;
  filters: {
    city: string;
    beds: string;
    priceRange: [number, number];
    category: string;
  };
  dateCreated: string;
  matchCount: number;
}

export interface ViewingSchedule {
  id: string;
  propertyId: string;
  date: string;
  time: string;
  tourType: 'in-person' | 'virtual';
  agentName: string;
  agentPhone: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  notes?: string;
  meetingLocation: string;
}

export interface PriceAlert {
  id: string;
  name: string;
  conditionType: string;
  targetPrice?: number;
  city?: string;
  propertyType?: string;
  status: 'Active' | 'Paused';
  dateCreated: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  category: string;
  size: string;
  date: string;
  url: string;
}

export interface AppointmentItem {
  id: string;
  propertyTitle: string;
  agentName: string;
  date: string;
  time: string;
  status: 'Completed' | 'Upcoming' | 'Cancelled';
  feedback?: string;
}

export interface OfferItem {
  id: string;
  propertyId: string;
  offerAmount: number;
  deposit: number;
  closingDate: string;
  irrevocableDate: string;
  conditions: string[];
  status: 'Submitted' | 'Under Review' | 'Accepted' | 'Countered' | 'Closed';
  dateSubmitted: string;
  notes?: string;
}

export interface TimelineStep {
  stepId: string;
  title: string;
  desc: string;
  status: 'completed' | 'active' | 'pending';
  dateCompleted?: string;
}

export interface NotificationItem {
  id: string;
  type: 'price_drop' | 'viewing_reminder' | 'offer_update' | 'similar_property' | 'mortgage_update' | 'system';
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export interface ValuationData {
  address: string;
  postalCode: string;
  city: string;
  province: string;
  propertyType: string;
  beds: number;
  baths: number;
  garage: number;
  sqft: number;
  lotSize: string;
  yearBuilt: number;
  basementType: string;
  renovations: string[];
  additionalFeatures: string;
  estimatedValue?: number;
  suggestedSellingPrice?: number;
  priceRangeMin?: number;
  priceRangeMax?: number;
  confidenceScore?: number;
  demandScore?: number;
  daysOnMarket?: number;
}

export interface SellerEvaluationBooking {
  id: string;
  date: string;
  time: string;
  address: string;
  notes: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'buyer' | 'seller';
  status: 'Active' | 'Suspended' | 'Pending Verification';
  registrationDate: string;
  lastLogin: string;
  avatar?: string;
}

export interface AdminAgent {
  id: string;
  name: string;
  email: string;
  phone: string;
  photo: string;
  experience: string;
  rating: number;
  propertiesCount: number;
  status: 'Active' | 'Pending Approval' | 'Suspended';
  commissionRate: string;
}

export interface AdminAppointment {
  id: string;
  buyerName: string;
  sellerName: string;
  agentName: string;
  propertyTitle: string;
  propertyAddress: string;
  date: string;
  time: string;
  status: 'Upcoming' | 'Approved' | 'Completed' | 'Cancelled';
  meetingType: 'In-Person Viewing' | 'Virtual 3D Tour' | 'Seller Valuation Inspection';
}

export interface PendingPropertyAction {
  type: 'save' | 'book' | 'offer' | 'buy' | 'price_alert' | 'contact_agent';
  propertyId: string;
  propertyTitle?: string;
  payload?: any;
}

export interface RoleSwitchModalState {
  isOpen: boolean;
  currentRole: 'buyer' | 'seller' | 'admin' | null;
  targetRole: 'buyer' | 'seller' | 'admin' | null;
  targetPage: string;
}

interface AppContextType {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  selectedPropertyId: string | null;
  setSelectedPropertyId: (id: string | null) => void;
  selectedCommunityName: string | null;
  setSelectedCommunityName: (name: string | null) => void;
  selectedBlogId: string | null;
  setSelectedBlogId: (id: string | null) => void;
  
  // Authentication Sim
  user: { name: string; email: string; role: 'buyer' | 'seller' | 'admin' } | null;
  login: (role: 'buyer' | 'seller' | 'admin', targetPage?: string) => void;
  register: (data: { name: string; email: string; phone?: string; role?: 'buyer' | 'seller' | 'admin' }) => void;
  logout: () => void;

  // Pending Actions & Role Switching
  pendingPropertyAction: PendingPropertyAction | null;
  setPendingPropertyAction: (action: PendingPropertyAction | null) => void;
  autoOpenPropertyModal: 'book' | 'buy' | 'offer' | 'contact' | null;
  setAutoOpenPropertyModal: (modal: 'book' | 'buy' | 'offer' | 'contact' | null) => void;
  roleSwitchModal: RoleSwitchModalState;
  triggerRoleSwitchWarning: (targetRole: 'buyer' | 'seller' | 'admin', targetPage: string) => void;
  closeRoleSwitchModal: () => void;
  confirmRoleSwitch: () => void;

  // Seller Valuation Context
  pendingValuationData: ValuationData | null;
  currentValuationData: ValuationData;
  savePendingValuation: (data: ValuationData, redirectPage?: string) => void;
  setCurrentValuationData: React.Dispatch<React.SetStateAction<ValuationData>>;
  sellerEvaluationBookings: SellerEvaluationBooking[];
  addSellerEvaluationBooking: (booking: Omit<SellerEvaluationBooking, 'id' | 'status'>) => void;
  cancelSellerEvaluationBooking: (id: string) => void;
  rescheduleSellerEvaluationBooking: (id: string, date: string, time: string) => void;

  // Admin Management Context
  adminUsers: AdminUser[];
  adminAgents: AdminAgent[];
  adminAppointments: AdminAppointment[];
  updateListingStatus: (id: string, status: 'active' | 'pending' | 'sold' | 'rejected' | 'archived') => void;
  toggleFeatureListing: (id: string) => void;
  deleteListing: (id: string) => void;
  updateUserStatus: (id: string, status: 'Active' | 'Suspended') => void;
  deleteUser: (id: string) => void;
  updateAgentStatus: (id: string, status: 'Active' | 'Pending Approval' | 'Suspended') => void;
  deleteAgent: (id: string) => void;
  updateAppointmentStatus: (id: string, status: 'Upcoming' | 'Approved' | 'Completed' | 'Cancelled') => void;
  rescheduleAppointment: (id: string, date: string, time: string) => void;

  // Search Context
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilters: {
    city: string;
    beds: string;
    baths?: string;
    propertyType?: string;
    postalCode?: string;
    mlsNumber?: string;
    community?: string;
    radius?: string;
    priceRange: [number, number];
    category: string;
    address?: string;
    searchType?: string;
    schoolZone?: boolean;
    propertyClass?: string;
    homeType?: string;
    status?: string;
    sqftMin?: number;
    sqftMax?: number;
    daysOnMarket?: string;
    showOnly?: string[];
    keywords?: string;
  };
  setActiveFilters: React.Dispatch<React.SetStateAction<{
    city: string;
    beds: string;
    baths?: string;
    propertyType?: string;
    postalCode?: string;
    mlsNumber?: string;
    community?: string;
    radius?: string;
    priceRange: [number, number];
    category: string;
    address?: string;
    searchType?: string;
    schoolZone?: boolean;
    propertyClass?: string;
    homeType?: string;
    status?: string;
    sqftMin?: number;
    sqftMax?: number;
    daysOnMarket?: string;
    showOnly?: string[];
    keywords?: string;
  }>>;
  pendingSearchFilters: any;
  savePendingSearch: (filters: any, redirectPage?: string) => void;
  selectedMapMarkerId: string | null;
  setSelectedMapMarkerId: (id: string | null) => void;

  // Saved Listings & Comparison
  savedProperties: string[];
  toggleSaveProperty: (id: string) => void;
  compareList: string[];
  toggleCompare: (id: string) => void;
  recentlyViewed: string[];
  addToRecentlyViewed: (id: string) => void;

  // Saved Searches & Favorite Communities
  savedSearches: SavedSearch[];
  addSavedSearch: (name: string, city: string, filters: any, matchCount: number) => void;
  deleteSavedSearch: (id: string) => void;
  favoriteCommunities: string[];
  toggleFavoriteCommunity: (name: string) => void;

  // Viewing Schedule
  viewingSchedule: ViewingSchedule[];
  bookViewing: (viewing: Omit<ViewingSchedule, 'id' | 'status'>) => void;
  rescheduleViewing: (id: string, newDate: string, newTime: string) => void;
  cancelViewing: (id: string) => void;
  addViewingNote: (id: string, note: string) => void;

  // Price Alerts
  priceAlerts: PriceAlert[];
  addPriceAlert: (alert: Omit<PriceAlert, 'id' | 'dateCreated' | 'status'>) => void;
  togglePriceAlertStatus: (id: string) => void;
  deletePriceAlert: (id: string) => void;

  // Mortgage & Financial Tracker
  mortgageProgress: {
    stage: 'Pre-Approval' | 'Documents Submitted' | 'Loan Review' | 'Approved' | 'Completed';
    loanAmount: number;
    interestRate: number;
    termYears: number;
    downPayment: number;
    lenderName: string;
    rateLocked: string;
    preApprovalExpiry: string;
    preApprovedAmount: number;
  };
  documents: DocumentItem[];

  // Appointment History & Offers
  appointmentHistory: AppointmentItem[];
  activeOffers: OfferItem[];
  submitOffer: (offer: Omit<OfferItem, 'id' | 'status' | 'dateSubmitted'>) => void;
  updateOfferStatus: (id: string, status: OfferItem['status']) => void;

  // Purchase Timeline & Notifications
  purchaseTimeline: TimelineStep[];
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;

  // Global Lists
  properties: Property[];
  communities: Community[];
  blogArticles: BlogArticle[];

  // Infinite Scroll & Pagination Context
  fetchNextPropertiesPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  totalPropertiesCount: number;

  // Backend Connectivity Status
  backendConnected: boolean;
  backendHealthMessage: string;

  // Toasts
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Static configurations for Generators
const CITIES = [
  'Toronto', 'Brampton', 'Mississauga', 'Milton', 'Oakville', 'Vaughan', 'Hamilton', 
  'Markham', 'Richmond Hill', 'Scarborough', 'Etobicoke', 'Ajax', 'Pickering', 'Whitby'
];

// const PROPERTY_TYPES = [
//   'Detached', 'Semi Detached', 'Townhouse', 'Condo', 'Apartment', 'Bungalow', 'Villa', 'Luxury Estate', 'Commercial', 'Farm', 'Land'
// ];

// const ADJECTIVES = [
//   'The Obsidian Point', 'Aurelia Manor', 'Elysian Canopy', 'Valence Duplex', 'Solaria Pavilion', 'Cascade Lodge', 
//   'Zenith Crown', 'Luminary Tower', 'The Pinnacle', 'Belvedere Court', 'Polaris Ridge', 'Apex Overlook', 
//   'The Sanctuary', 'The Horizon Suite', 'Silverpine Estate', 'Vanguard Villa', 'Infinitum Sky', 'Stellar Crest', 
//   'Nirvana Cove', 'Echo Ridge', 'Somerset Place', 'Grandwood Hall', 'The Peninsula', 'Vanderbilt Keep'
// ];

// const STREET_NAMES = [
//   'Bellevue Drive', 'Radcliffe Ridge', 'Yorkville Ave', 'Bay St', 'Lakeshore Road', 'Forest Hill Rd', 
//   'Creditview Rd', 'Hurontario St', 'Burnhamthorpe Rd', 'Derry Road', 'Dundas St', 'Yonge St', 
//   'Bridle Path', 'Post Road', 'Highland Crescent', 'Belmont Blvd', 'Pine Avenue', 'Heritage Way'
// ];

const BLOG_CATEGORIES = [
  'Market Insights', 'Buying Guides', 'Selling Guides', 'Mortgage Tips', 
  'Investment Articles', 'Community News', 'AI Real Estate Tips', 
  'Interior Design', 'Luxury Home Inspiration'
] as const;

const BLOG_AUTHORS = ['Marcus Aurelius', 'Sébastien LeClerc', 'Laurent de Bourgeois', 'Jean-Pierre Cardin', 'Elena Rostova', 'Michael Anderson'];

const BLOG_TOPICS = [
  { title: 'The Monolithic Basalt Shift in Modern West Coast Architecture', desc: 'Exploring how raw stone seams and triple-paned structural glass insulate cliffs.' },
  { title: 'Toronto Luxury Q3 Market Analytics & Sovereign Yield Vectors', desc: 'An institutional review of high-end home transactions across the Yorkville corridor.' },
  { title: 'AI-Powered Asset Evaluation: Machine Learning in Canada\'s Penthouses', desc: 'Predicting future price deviations using multi-variate spatial modeling algorithms.' },
  { title: 'Sustainable Legacies: Net-Zero Geothermal Paving in Alpine Estates', desc: 'Geothermal snow-melting systems and smart solar microgrids engineered for off-grid operations.' },
  { title: 'The Discretion Standard: Transacting Multi-Million Off-Market Assets', desc: 'Why Canada\'s elite are utilizing private, non-disclosed ledger networks over regional MLS.' },
  { title: 'Acoustic Soundproofing: Orchestrating Sonic Sanctuaries in High-Density Districts', desc: 'Advanced sub-frame construction methods that block external decibels in urban high-rises.' },
  { title: 'Biophilic Integration: Merging Deep Pine Forest Canopies with Glass Enclosures', desc: 'Award-winning architectural concepts that blur boundaries between interior floors and old-growth trees.' },
  { title: 'Bespoke Escrow Protocols: Financial Security Structures in Multi-National Acquisitions', desc: 'Securing legal and monetary clearances across foreign sovereign wealth exchanges safely.' },
  { title: 'The Evolution of Double-Height Concrete Cantilevers in Modernist Villas', desc: 'Structural post-tensioning techniques allowing huge floating living spaces to hover in thin air.' },
  { title: 'Waterfront Foundations: Resisting Seismic Shoreline Seepages in Muskoka Penthouses', desc: 'Hydrophobic cement coatings and deeply anchored micropiles built directly into freshwater channels.' }
];

// 1. Programmatic Luxury Listings Generator (Strictly empty array; 100% live TRREB feed required)
// const generatePropertiesList = (): Property[] => {
//   return [];
// };

// 2. Programmatic Editorial Chronicles (Blog) Generator
const generateBlogArticlesList = (): BlogArticle[] => {
  const articles: BlogArticle[] = [];
  
  for (let i = 1; i <= 50; i++) {
    const topic = BLOG_TOPICS[i % BLOG_TOPICS.length];
    const category = BLOG_CATEGORIES[i % BLOG_CATEGORIES.length];
    const author = BLOG_AUTHORS[i % BLOG_AUTHORS.length];
    const date = `July ${25 - (i % 22)}, 2026`;
    const readTime = `${4 + (i % 6)} min read`;
    const EDITORIAL_IMAGE_POOL = [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80"
    ];

    const imageUrl = EDITORIAL_IMAGE_POOL[i % EDITORIAL_IMAGE_POOL.length];
    const tags = [category.split(' ')[0], 'Luxury', 'Innovation', 'Canada', 'Investments'].slice(0, 2 + (i % 3));

    articles.push({
      id: `blog${i}`,
      title: `${topic.title} (Volume ${i})`,
      excerpt: `${topic.desc} Delving into deep engineering frameworks, localized statistics, and aesthetic design standards.`,
      content: `### Executive Framework Summary\n\nIn this analytical volume, we trace the significant shifts affecting high-end residential holdings across the Canadian corridor. As institutional investors and private sovereign entities re-allocate capital into high-yield tangible assets, the demand for highly bespoke, resilient construction continues to climb to historic peaks.\n\n### Localized Case Analysis\n\nTake, for instance, a newly completed estate in ${CITIES[i % CITIES.length]}. Built utilizing hydrophobic carbon-infused structural columns and finished with premium custom terrazzo floors, the property leverages state-of-the-art triple-pane thermal glass layers that insulate against extreme Canadian winter spells while maximizing panoramic natural light angles.\n\nOur computational AI valuation algorithms predict a solid 4.8% annualized capital gain in this neighborhood, insulated by exceptional local walk scores (${70 + (i % 30)}/100) and premier public academic standards. This comprehensive guide outlines the material sourcing, regulatory compliance, and fiscal structuring required to successfully finalize this scale of real estate acquisition...`,
      category,
      readTime,
      date,
      author,
      imageUrl,
      featured: i === 1,
      tags,
      likes: 24 + ((i * 17) % 250),
      shares: 8 + ((i * 11) % 65),
      bookmarks: i % 4 === 0,
      relatedIds: [`blog${(i % 50) + 1}`, `blog${((i + 2) % 50) + 1}`]
    });
  }
  return articles;
};

// 3. Communities List Configuration
const communities: Community[] = [
  {
    name: 'West Vancouver',
    city: 'Vancouver',
    description: 'A spectacular oceanfront hillside municipality framing dramatic panoramic vistas of English Bay and downtown Vancouver. Renowned for multi-million dollar modern properties, pristine waterfront walks, elite public academies, and exceptional safety index scores.',
    averagePrice: '$8.4M',
    walkScore: 84,
    transitScore: 78,
    schoolRating: 9.8,
    lifestyleTags: ['Coastal', 'Private Schools', 'Yachting', 'Hiking'],
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
    marketTrend: 'Upward',
    crimeIndex: 'Minimal'
  },
  {
    name: 'Yorkville',
    city: 'Toronto',
    description: 'The definitive capital of luxury boutique shopping, Michelin dining, and high-fashion living in Canada. Yorkville combines preserved Victorian residential architecture with ultra-luxury skyscraper condominiums containing majestic crown penthouses.',
    averagePrice: '$6.2M',
    walkScore: 98,
    transitScore: 96,
    schoolRating: 9.9,
    lifestyleTags: ['Shopping', 'Michelin Stars', 'Art Galleries', 'Subway Access'],
    imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=800&auto=format&fit=crop',
    marketTrend: 'Stable',
    crimeIndex: 'Extremely Low'
  },
  {
    name: 'Whistler Benchlands',
    city: 'Whistler',
    description: 'Sitting along the sun-bathed northern slopes of Blackcomb Mountain, the Benchlands feature spectacular ski-in, ski-out chalets, majestic pine surroundings, and quick heated footpaths down into the vibrant, European-styled alpine resort village.',
    averagePrice: '$7.8M',
    walkScore: 71,
    transitScore: 68,
    schoolRating: 8.8,
    lifestyleTags: ['Ski-In / Ski-Out', 'Alpine Peak Views', 'Golf Course', 'Spas'],
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop',
    marketTrend: 'Upward',
    crimeIndex: 'Minimal'
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPageRaw] = useState<string>(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace('#', '');
      const [pageName] = hash.split('?');
      if (pageName) return pageName;
    }
    return 'home';
  });

  const [selectedPropertyId, setSelectedPropertyIdRaw] = useState<string | null>(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace('#', '');
      const [, queryStr] = hash.split('?');
      if (queryStr) {
        const params = new URLSearchParams(queryStr);
        return params.get('id');
      }
    }
    return null;
  });

  const [selectedCommunityName, setSelectedCommunityName] = useState<string | null>(null);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);

  // Push history state helper for browser back/forward buttons
  const pushHistory = (page: string, propId: string | null = null) => {
    if (typeof window === 'undefined') return;
    const urlHash = `#${page}${propId ? `?id=${propId}` : ''}`;
    if (window.location.hash !== urlHash) {
      window.history.pushState({ page, selectedPropertyId: propId }, '', urlHash);
    }
  };

  const setCurrentPage = (page: string) => {
    setCurrentPageRaw(page);
    pushHistory(page, page === 'property-detail' ? selectedPropertyId : null);
  };

  const setSelectedPropertyId = (id: string | null) => {
    setSelectedPropertyIdRaw(id);
    if (currentPage === 'property-detail' && id) {
      pushHistory('property-detail', id);
    }
  };

  // Sync with browser Back and Forward arrows (popstate)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.page) {
        setCurrentPageRaw(event.state.page);
        setSelectedPropertyIdRaw(event.state.selectedPropertyId || null);
      } else if (window.location.hash) {
        const hash = window.location.hash.replace('#', '');
        const [pageName, queryStr] = hash.split('?');
        if (pageName) setCurrentPageRaw(pageName);
        if (queryStr) {
          const params = new URLSearchParams(queryStr);
          setSelectedPropertyIdRaw(params.get('id'));
        } else {
          setSelectedPropertyIdRaw(null);
        }
      } else {
        setCurrentPageRaw('home');
        setSelectedPropertyIdRaw(null);
      }
    };

    // Ensure initial entry in history stack
    const initialHash = `#${currentPage}${selectedPropertyId ? `?id=${selectedPropertyId}` : ''}`;
    window.history.replaceState({ page: currentPage, selectedPropertyId }, '', initialHash);

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [backendConnected, setBackendConnected] = useState(false);
  const [backendHealthMessage, setBackendHealthMessage] = useState('Checking backend server connection...');

  // Ping backend API on mount
  useEffect(() => {
    apiService.checkBackendHealth().then(res => {
      setBackendConnected(res.isConnected);
      setBackendHealthMessage(res.message);
    });
  }, []);

  const [user, setUser] = useState<{ name: string; email: string; role: 'buyer' | 'seller' | 'admin' } | null>(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('nova_user');
      if (savedUser) {
        try {
          return JSON.parse(savedUser);
        } catch {
          // ignore parse error
        }
      }
    }
    return null;
  });

  // Sync user changes to localStorage for refresh persistence
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (user) {
        localStorage.setItem('nova_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('nova_user');
      }
    }
  }, [user]);

  const [searchQuery, setSearchQuery] = useState(() => {
    if (typeof window !== 'undefined' && window.location.search) {
      const params = new URLSearchParams(window.location.search);
      return params.get('search') || params.get('q') || params.get('query') || '';
    }
    return '';
  });

  const [activeFilters, setActiveFilters] = useState<{
    city: string;
    beds: string;
    baths?: string;
    propertyType?: string;
    category: string;
    priceRange: [number, number];
    address?: string;
    searchType?: string;
    schoolZone?: boolean;
    postalCode?: string;
    mlsNumber?: string;
    propertyClass?: string;
    homeType?: string;
    status?: string;
    sqftMin?: number;
    sqftMax?: number;
    daysOnMarket?: string;
    showOnly?: string[];
    keywords?: string;
  }>(() => {
    // 1. URL Priority: If URL params exist, URL is source of truth
    if (typeof window !== 'undefined' && window.location.search && window.location.search.length > 1) {
      const params = new URLSearchParams(window.location.search);
      const city = params.get('city') || 'All';

      // Normalize type: 'Any'→'All', 'House'→'Detached'
      const rawCategory = params.get('type') || params.get('category') || 'All';
      const category = rawCategory === 'Any' ? 'All' : rawCategory === 'House' ? 'Detached' : rawCategory;

      // Normalize beds: 'Any'→'All'
      const rawBeds = params.get('beds') || 'All';
      const beds = rawBeds === 'Any' ? 'All' : rawBeds;

      const rawBaths = params.get('baths') || 'All';
      const baths = rawBaths === 'Any' ? 'All' : rawBaths;

      const maxPriceParam = params.get('maxPrice');
      const maxPrice = maxPriceParam ? parseInt(maxPriceParam, 10) : 50000000;
      const minPriceParam = params.get('minPrice');
      const minPrice = minPriceParam ? parseInt(minPriceParam, 10) : 0;

      const postalCode = params.get('postalCode') || params.get('postal') || undefined;
      const mlsNumber = params.get('mls') || params.get('mlsNumber') || undefined;
      const address = params.get('address') || undefined;
      const searchType = params.get('searchType') || undefined;
      const schoolZone = params.get('school') === 'true' || undefined;

      const propertyClass = params.get('propertyClass') || undefined;
      const homeType = params.get('homeType') || undefined;
      const status = params.get('status') || undefined;
      const sqftMinParam = params.get('sqftMin');
      const sqftMin = sqftMinParam ? parseInt(sqftMinParam, 10) : undefined;
      const sqftMaxParam = params.get('sqftMax');
      const sqftMax = sqftMaxParam ? parseInt(sqftMaxParam, 10) : undefined;
      const daysOnMarket = params.get('daysOnMarket') || undefined;
      const showOnlyParam = params.get('showOnly');
      const showOnly = showOnlyParam ? showOnlyParam.split(',') : undefined;
      const keywords = params.get('keywords') || undefined;

      return {
        city,
        beds,
        baths,
        category,
        propertyType: category,
        priceRange: [minPrice, maxPrice],
        postalCode,
        mlsNumber,
        address,
        searchType,
        schoolZone,
        propertyClass,
        homeType,
        status,
        sqftMin,
        sqftMax,
        daysOnMarket,
        showOnly,
        keywords
      };
    }

    // 2. Persisted State Recovery: If no URL params, restore from sessionStorage
    if (typeof window !== 'undefined') {
      const cached = sessionStorage.getItem('trreb_active_filters_cache');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed && typeof parsed === 'object') {
            // Normalize stale values from old cache format
            const rawCat = parsed.category || 'All';
            const normCategory = rawCat === 'Any' ? 'All' : rawCat === 'House' ? 'Detached' : rawCat;
            const rawBeds = parsed.beds || 'All';
            const normBeds = rawBeds === 'Any' ? 'All' : rawBeds;
            return {
              ...parsed,
              category: normCategory,
              propertyType: normCategory,
              beds: normBeds,
              baths: (parsed.baths === 'Any' ? 'All' : parsed.baths) || 'All',
            };
          }
        } catch {}
      }
    }

    // 3. Fallback Default
    return {
      city: 'All',
      beds: 'All',
      baths: 'All',
      category: 'All',
      propertyType: 'All',
      priceRange: [0, 50000000],
    };
  });

  // URL & Session Storage Synchronization
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('trreb_active_filters_cache', JSON.stringify(activeFilters));
      } catch {}

      if (currentPage === 'search') {
        const params = new URLSearchParams();
        if (activeFilters.city && activeFilters.city !== 'All') params.set('city', activeFilters.city);
        if (activeFilters.category && activeFilters.category !== 'All') params.set('type', activeFilters.category);
        if (activeFilters.beds && activeFilters.beds !== 'All') params.set('beds', activeFilters.beds);
        if (activeFilters.baths && activeFilters.baths !== 'All') params.set('baths', activeFilters.baths);
        if (activeFilters.priceRange && activeFilters.priceRange[1] < 50000000) params.set('maxPrice', activeFilters.priceRange[1].toString());
        if (activeFilters.priceRange && activeFilters.priceRange[0] > 0) params.set('minPrice', activeFilters.priceRange[0].toString());
        if (searchQuery) params.set('search', searchQuery);
        
        if (activeFilters.postalCode) params.set('postalCode', activeFilters.postalCode);
        if (activeFilters.mlsNumber) params.set('mls', activeFilters.mlsNumber);
        if (activeFilters.address) params.set('address', activeFilters.address);
        if (activeFilters.searchType) params.set('searchType', activeFilters.searchType);
        if (activeFilters.schoolZone) params.set('school', 'true');

        if (activeFilters.propertyClass) params.set('propertyClass', activeFilters.propertyClass);
        if (activeFilters.homeType) params.set('homeType', activeFilters.homeType);
        if (activeFilters.status) params.set('status', activeFilters.status);
        if (activeFilters.sqftMin !== undefined) params.set('sqftMin', activeFilters.sqftMin.toString());
        if (activeFilters.sqftMax !== undefined) params.set('sqftMax', activeFilters.sqftMax.toString());
        if (activeFilters.daysOnMarket) params.set('daysOnMarket', activeFilters.daysOnMarket);
        if (activeFilters.showOnly && activeFilters.showOnly.length > 0) params.set('showOnly', activeFilters.showOnly.join(','));
        if (activeFilters.keywords) params.set('keywords', activeFilters.keywords);

        const queryString = params.toString();
        const newUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;
        window.history.replaceState(null, '', newUrl);
      }
    }
  }, [activeFilters, searchQuery, currentPage]);

  const [savedProperties, setSavedProperties] = useState<string[]>(['1', '3', '5']);
  const [compareList, setCompareList] = useState<string[]>(['1', '2']);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(['1', '2', '3', '4']);
  const [favoriteCommunities, setFavoriteCommunities] = useState<string[]>(['Yorkville', 'West Vancouver']);

  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([
    {
      id: 'search-1',
      name: 'Toronto Luxury Penthouses',
      city: 'Toronto',
      filters: { city: 'Toronto', beds: 'All', priceRange: [3000000, 25000000], category: 'Penthouse' },
      dateCreated: '2026-07-15',
      matchCount: 14
    },
    {
      id: 'search-2',
      name: 'Oakville Waterfront Estates',
      city: 'Oakville',
      filters: { city: 'Oakville', beds: '4', priceRange: [4000000, 30000000], category: 'Waterfront' },
      dateCreated: '2026-07-20',
      matchCount: 8
    }
  ]);

  const [viewingSchedule, setViewingSchedule] = useState<ViewingSchedule[]>([
    {
      id: 'view-1',
      propertyId: '1',
      date: '2026-08-02',
      time: '11:00 AM',
      tourType: 'in-person',
      agentName: 'Sébastien LeClerc',
      agentPhone: '+1 (604) 555-0199',
      status: 'Upcoming',
      notes: 'Private helicopter landing on roof pad.',
      meetingLocation: '102 Radcliffe Ridge, Toronto, ON'
    },
    {
      id: 'view-2',
      propertyId: '2',
      date: '2026-08-14',
      time: '05:30 PM',
      tourType: 'virtual',
      agentName: 'Michael Anderson',
      agentPhone: '+1 (416) 555-0144',
      status: 'Upcoming',
      notes: 'Interactive 4K streaming tour requested.',
      meetingLocation: 'Private Stream Room'
    }
  ]);

  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([
    {
      id: 'alert-1',
      name: 'Price drop below $900,000 in Toronto',
      conditionType: 'Price Drop',
      targetPrice: 900000,
      city: 'Toronto',
      status: 'Active',
      dateCreated: '2026-07-10'
    },
    {
      id: 'alert-2',
      name: 'New Listing: Luxury Condo in Mississauga',
      conditionType: 'New Listing',
      city: 'Mississauga',
      propertyType: 'Condo',
      status: 'Active',
      dateCreated: '2026-07-18'
    },
    {
      id: 'alert-3',
      name: 'Detached House in Brampton under $2.5M',
      conditionType: 'Price Drop',
      targetPrice: 2500000,
      city: 'Brampton',
      propertyType: 'Detached',
      status: 'Paused',
      dateCreated: '2026-07-22'
    }
  ]);

  const [mortgageProgress] = useState({
    stage: 'Loan Review' as const,
    loanAmount: 3200000,
    interestRate: 4.85,
    termYears: 25,
    downPayment: 800000,
    lenderName: 'Royal Bank of Canada (RBC Private)',
    rateLocked: '4.25% Fixed',
    preApprovalExpiry: 'Sept 30, 2026',
    preApprovedAmount: 4000000,
    percentComplete: 75
  });

  const [documents] = useState<DocumentItem[]>([
    { id: 'doc-1', name: 'Agreement of Purchase and Sale - Draft.pdf', category: 'Purchase Agreement', size: '2.4 MB', date: '2026-07-24', url: '#' },
    { id: 'doc-2', name: 'Bank Pre-Approval Letter & Asset Proof.pdf', category: 'Mortgage Documents', size: '1.8 MB', date: '2026-07-20', url: '#' },
    { id: 'doc-3', name: 'Property Disclosure & Title Search Report.pdf', category: 'Property Reports', size: '4.1 MB', date: '2026-07-18', url: '#' },
    { id: 'doc-4', name: 'Thermal & Structural Inspection Report.pdf', category: 'Inspection Reports', size: '8.5 MB', date: '2026-07-15', url: '#' },
    { id: 'doc-5', name: 'Escrow Deposit Wire Confirmation.pdf', category: 'Receipts', size: '620 KB', date: '2026-07-25', url: '#' }
  ]);

  const [appointmentHistory, setAppointmentHistory] = useState<AppointmentItem[]>([
    { id: 'app-1', propertyTitle: 'The Obsidian Point Villa', agentName: 'Sébastien LeClerc', date: '2026-07-12', time: '02:00 PM', status: 'Completed', feedback: 'Stunning sunset mountain vistas.' },
    { id: 'app-2', propertyTitle: 'Aurelia Crown Penthouse', agentName: 'Michael Anderson', date: '2026-07-19', time: '11:00 AM', status: 'Completed', feedback: 'Needs custom wine cellar modification.' },
    { id: 'app-3', propertyTitle: 'Elysian Canopy Estate', agentName: 'Sébastien LeClerc', date: '2026-07-22', time: '04:00 PM', status: 'Cancelled', feedback: 'Rescheduled due to flight delay.' }
  ]);

  const [activeOffers, setActiveOffers] = useState<OfferItem[]>([
    {
      id: 'offer-101',
      propertyId: '1',
      offerAmount: 4850000,
      deposit: 250000,
      closingDate: '2026-09-30',
      irrevocableDate: '2026-08-10',
      conditions: ['Subject to Financing (5 Days)', 'Subject to Inspection (3 Days)'],
      status: 'Under Review',
      dateSubmitted: '2026-07-25',
      notes: 'Initial formal purchase agreement submitted.'
    }
  ]);

  const [purchaseTimeline] = useState<TimelineStep[]>([
    { stepId: '1', title: 'Property Selected', desc: 'Identified target luxury asset', status: 'completed', dateCompleted: '2026-07-10' },
    { stepId: '2', title: 'Viewing Completed', desc: 'VIP in-person tour verified', status: 'completed', dateCompleted: '2026-07-18' },
    { stepId: '3', title: 'Offer Submitted', desc: 'Agreement transmitted to seller', status: 'active' },
    { stepId: '4', title: 'Offer Accepted', desc: 'Formal binding signature executed', status: 'pending' },
    { stepId: '5', title: 'Mortgage Approved', desc: 'Underwriting loan release', status: 'pending' },
    { stepId: '6', title: 'Legal Review', desc: 'Title search & escrow clearance', status: 'pending' },
    { stepId: '7', title: 'Closing', desc: 'Fund wire & deed transfer', status: 'pending' },
    { stepId: '8', title: 'Move In', desc: 'Key handoff & concierge welcome', status: 'pending' }
  ]);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: 'notif-1', type: 'price_drop', title: 'Price Drop Alert', message: 'The Obsidian Point Villa reduced price by $150,000!', date: '2 hours ago', read: false },
    { id: 'notif-2', type: 'viewing_reminder', title: 'Upcoming Tour Reminder', message: 'VIP Viewing scheduled for tomorrow at 11:00 AM.', date: '1 day ago', read: false },
    { id: 'notif-3', type: 'offer_update', title: 'Offer Status Updated', message: 'Seller agent received offer #101 and marked Under Review.', date: '2 days ago', read: true },
    { id: 'notif-4', type: 'mortgage_update', title: 'Mortgage Review Milestone', message: 'Underwriting review stage 3 completed successfully.', date: '3 days ago', read: true }
  ]);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Instantiated datasets loaded on provider compile
  const [propertiesList, setPropertiesList] = useState<Property[]>(() => {
    if (typeof window !== 'undefined') {
      const cachedSession = sessionStorage.getItem('trreb_properties_cache');
      const cachedLocal = localStorage.getItem('trreb_properties_cache');
      const cached = cachedSession || cachedLocal;
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch {}
      }
    }
    return [];
  });
  const [blogArticles] = useState<BlogArticle[]>(() => generateBlogArticlesList());

  // Pagination & Infinite Scroll Refs & State
  const currentPageRef = useRef(1);
  const totalPagesRef = useRef(1);
  const isFetchingRef = useRef(false);

  const [hasNextPage, setHasNextPage] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [totalPropertiesCount, setTotalPropertiesCount] = useState<number>(0);

  const savePropertiesCache = (data: Property[]) => {
    if (typeof window === 'undefined') return;
    try {
      // Store at most 40 items in storage to stay well under browser 5MB quota
      const cacheSlice = data.slice(0, 40);
      const str = JSON.stringify(cacheSlice);
      sessionStorage.setItem('trreb_properties_cache', str);
      localStorage.setItem('trreb_properties_cache', str);
    } catch {
      // Safely ignore storage quota limits
    }
  };

  // Fetch Next Page (Page 2, 3...)
  const fetchNextPropertiesPage = useCallback(async () => {
    if (isFetchingRef.current || currentPageRef.current >= totalPagesRef.current) return;

    isFetchingRef.current = true;
    setIsFetchingNextPage(true);
    const nextPageToFetch = currentPageRef.current + 1;

    try {
      const cityParam = activeFilters.city && activeFilters.city !== 'All' ? activeFilters.city : undefined;
      const res = await apiService.getProperties({ page: nextPageToFetch, limit: 100, city: cityParam });
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        console.log(`✨ Loaded ${res.data.length} live TRREB MLS properties (Page ${nextPageToFetch}/${res.meta?.totalPages || 1})!`);

        setPropertiesList(prev => {
          const combined = [...prev, ...res.data];
          const seen = new Set<string>();
          const unique = combined.filter(p => {
            const key = p.id || p.mlsNumber;
            if (!key || seen.has(key)) return false;
            seen.add(key);
            return true;
          });

          savePropertiesCache(unique);
          return unique;
        });

        if (res.meta) {
          currentPageRef.current = res.meta.page;
          totalPagesRef.current = res.meta.totalPages;
          setHasNextPage(res.meta.page < res.meta.totalPages);
          if (res.meta.total) setTotalPropertiesCount(res.meta.total);
        }
      }
    } catch (err) {
      console.warn(`⚠️ Could not fetch page ${nextPageToFetch} live TRREB properties:`, err);
    } finally {
      isFetchingRef.current = false;
      setIsFetchingNextPage(false);
    }
  }, [activeFilters.city]);

  // Fetch Page 1 whenever activeFilters.city changes (or on initial mount)
  useEffect(() => {
    const cityParam = activeFilters.city && activeFilters.city !== 'All' ? activeFilters.city : undefined;
    currentPageRef.current = 1;

    apiService.getProperties({ page: 1, limit: 100, city: cityParam }).then(res => {
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        console.log(`✨ Loaded ${res.data.length} live TRREB MLS properties from backend for city "${cityParam || 'All'}" (Page 1, Total ${res.meta?.total || res.data.length})!`);
        setPropertiesList(res.data);
        if (res.meta) {
          currentPageRef.current = res.meta.page;
          totalPagesRef.current = res.meta.totalPages;
          setHasNextPage(res.meta.page < res.meta.totalPages);
          if (res.meta.total) setTotalPropertiesCount(res.meta.total);
        }
        savePropertiesCache(res.data);
      }
    }).catch(err => {
      console.warn('⚠️ Could not fetch live TRREB properties from backend:', err);
    });
  }, [activeFilters.city]);

  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([
    { id: 'usr-1', name: 'Baron Von Roth', email: 'baron@swissholding.ch', phone: '+1 (416) 555-0188', role: 'buyer', status: 'Active', registrationDate: '2026-05-12', lastLogin: '10 mins ago', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
    { id: 'usr-2', name: 'Lady Genevieve', email: 'genevieve@londonre.co.uk', phone: '+1 (416) 555-0199', role: 'buyer', status: 'Active', registrationDate: '2026-06-04', lastLogin: '2 hours ago', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80' },
    { id: 'usr-3', name: 'Dimitri Leonov', email: 'dimitri@cyprusventures.com', phone: '+1 (604) 555-0122', role: 'seller', status: 'Active', registrationDate: '2026-06-18', lastLogin: '1 day ago', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
    { id: 'usr-4', name: 'Sophia Sterling', email: 'sophia@sterlingcapital.ca', phone: '+1 (416) 555-0144', role: 'seller', status: 'Active', registrationDate: '2026-07-01', lastLogin: '3 days ago', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80' },
    { id: 'usr-5', name: 'Alexander Vance', email: 'alex@vanceholding.ca', phone: '+1 (416) 555-0177', role: 'buyer', status: 'Suspended', registrationDate: '2026-04-10', lastLogin: '12 days ago' }
  ]);

  const [adminAgents, setAdminAgents] = useState<AdminAgent[]>([
    { id: 'agt-1', name: 'Elena Rostova', email: 'elena@novaestate.ca', phone: '+1 (416) 555-0199', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80', experience: '18 Years', rating: 4.98, propertiesCount: 12, status: 'Active', commissionRate: '2.5%' },
    { id: 'agt-2', name: 'Sébastien LeClerc', email: 'sebastien@novaestate.ca', phone: '+1 (514) 555-0188', photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80', experience: '14 Years', rating: 4.95, propertiesCount: 9, status: 'Active', commissionRate: '2.5%' },
    { id: 'agt-3', name: 'Victoria Lin', email: 'victoria@novaestate.ca', phone: '+1 (604) 555-0166', photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80', experience: '10 Years', rating: 4.92, propertiesCount: 8, status: 'Active', commissionRate: '2.0%' },
    { id: 'agt-4', name: 'Julian Drake', email: 'julian@novaestate.ca', phone: '+1 (416) 555-0133', photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80', experience: '6 Years', rating: 4.88, propertiesCount: 5, status: 'Pending Approval', commissionRate: '2.0%' }
  ]);

  const [adminAppointments, setAdminAppointments] = useState<AdminAppointment[]>([
    { id: 'app-1', buyerName: 'Baron Von Roth', sellerName: 'Elena Rostova', agentName: 'Elena Rostova', propertyTitle: '102 Radcliffe Ridge', propertyAddress: '102 Radcliffe Ridge, Toronto, ON', date: '2026-08-02', time: '11:00 AM', status: 'Approved', meetingType: 'In-Person Viewing' },
    { id: 'app-2', buyerName: 'Lady Genevieve', sellerName: 'Dimitri Leonov', agentName: 'Sébastien LeClerc', propertyTitle: 'The Obsidian Point Villa', propertyAddress: '88 Highland Cres, Toronto, ON', date: '2026-08-04', time: '02:00 PM', status: 'Upcoming', meetingType: 'Virtual 3D Tour' },
    { id: 'app-3', buyerName: 'Sophia Sterling', sellerName: 'Sophia Sterling', agentName: 'Victoria Lin', propertyTitle: 'Belgravia Waterfront Manor', propertyAddress: '42 Lakeshore Blvd, Oakville, ON', date: '2026-08-05', time: '10:00 AM', status: 'Upcoming', meetingType: 'Seller Valuation Inspection' }
  ]);

  const updateListingStatus = (id: string, status: 'active' | 'pending' | 'sold' | 'rejected' | 'archived') => {
    setPropertiesList(prev => prev.map(p => p.id === id ? { ...p, featured: status === 'active' ? p.featured : p.featured } : p));
    showToast(`Property listing status updated to ${status.toUpperCase()}.`, 'success');
  };

  const toggleFeatureListing = (id: string) => {
    setPropertiesList(prev => prev.map(p => p.id === id ? { ...p, featured: !p.featured } : p));
    showToast(`Property featured status toggled.`, 'info');
  };

  const deleteListing = (id: string) => {
    setPropertiesList(prev => prev.filter(p => p.id !== id));
    showToast(`Property listing removed from registry.`, 'warning');
  };

  const updateUserStatus = (id: string, status: 'Active' | 'Suspended') => {
    setAdminUsers(prev => prev.map(u => u.id === id ? { ...u, status } : u));
    showToast(`User account status updated to ${status}.`, 'info');
  };

  const deleteUser = (id: string) => {
    setAdminUsers(prev => prev.filter(u => u.id !== id));
    showToast(`User account deleted.`, 'warning');
  };

  const updateAgentStatus = (id: string, status: 'Active' | 'Pending Approval' | 'Suspended') => {
    setAdminAgents(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    showToast(`Agent credentials status updated to ${status}.`, 'success');
  };

  const deleteAgent = (id: string) => {
    setAdminAgents(prev => prev.filter(a => a.id !== id));
    showToast(`Agent profile removed.`, 'warning');
  };

  const updateAppointmentStatus = (id: string, status: 'Upcoming' | 'Approved' | 'Completed' | 'Cancelled') => {
    setAdminAppointments(prev => prev.map(ap => ap.id === id ? { ...ap, status } : ap));
    showToast(`Appointment status changed to ${status}.`, 'info');
  };

  const rescheduleAppointment = (id: string, date: string, time: string) => {
    setAdminAppointments(prev => prev.map(ap => ap.id === id ? { ...ap, date, time } : ap));
    showToast(`Appointment rescheduled to ${date} at ${time}.`, 'success');
  };

  const [pendingSearchFilters, setPendingSearchFilters] = useState<any>(null);
  const [pendingPropertyAction, setPendingPropertyAction] = useState<PendingPropertyAction | null>(null);
  const [autoOpenPropertyModal, setAutoOpenPropertyModal] = useState<'book' | 'buy' | 'offer' | 'contact' | null>(null);

  const [roleSwitchModal, setRoleSwitchModal] = useState<RoleSwitchModalState>({
    isOpen: false,
    currentRole: null,
    targetRole: null,
    targetPage: ''
  });

  const triggerRoleSwitchWarning = (targetRole: 'buyer' | 'seller' | 'admin', targetPage: string) => {
    setRoleSwitchModal({
      isOpen: true,
      currentRole: user?.role || null,
      targetRole,
      targetPage
    });
  };

  const closeRoleSwitchModal = () => {
    setRoleSwitchModal({
      isOpen: false,
      currentRole: null,
      targetRole: null,
      targetPage: ''
    });
  };

  const confirmRoleSwitch = () => {
    const { targetRole, targetPage } = roleSwitchModal;
    closeRoleSwitchModal();
    setUser(null);
    showToast('Switched user persona.', 'info');
    if (targetRole) {
      login(targetRole, targetPage);
    } else {
      setCurrentPage(targetPage || 'home');
    }
  };

  const [pendingValuationData, setPendingValuationData] = useState<ValuationData | null>(null);
  const [currentValuationData, setCurrentValuationData] = useState<ValuationData>({
    address: '102 Radcliffe Ridge',
    postalCode: 'M5H 2N2',
    city: 'Toronto',
    province: 'Ontario',
    propertyType: 'Detached',
    beds: 5,
    baths: 6,
    garage: 3,
    sqft: 6800,
    lotSize: '65 x 140 ft',
    yearBuilt: 2022,
    basementType: 'Finished Walkout',
    renovations: ['Custom Kitchen', 'Primary Suite Spa', 'Wine Cellar', 'Smart Home Tech'],
    additionalFeatures: 'Heated infinity pool, rooftop terrace, elevator, motorized glass walls.',
    estimatedValue: 4850000,
    suggestedSellingPrice: 4750000,
    priceRangeMin: 4600000,
    priceRangeMax: 5100000,
    confidenceScore: 96,
    demandScore: 94,
    daysOnMarket: 18
  });

  const [sellerEvaluationBookings, setSellerEvaluationBookings] = useState<SellerEvaluationBooking[]>([
    {
      id: 'eval-1',
      date: '2026-08-05',
      time: '10:00 AM',
      address: '102 Radcliffe Ridge, Toronto, ON',
      notes: 'Focus on recent kitchen renovation and wine cellar pricing impact.',
      status: 'Upcoming'
    }
  ]);

  const [pendingRedirectPage, setPendingRedirectPage] = useState<string>('search');
  const [selectedMapMarkerId, setSelectedMapMarkerId] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const savePendingSearch = (filters: any, redirectPage = 'search') => {
    setPendingSearchFilters(filters);
    setPendingRedirectPage(redirectPage);
  };

  const savePendingValuation = (data: ValuationData, redirectPage = 'valuation-report') => {
    setPendingValuationData(data);
    setPendingRedirectPage(redirectPage);
  };

  const addSellerEvaluationBooking = (booking: Omit<SellerEvaluationBooking, 'id' | 'status'>) => {
    const newBooking: SellerEvaluationBooking = {
      ...booking,
      id: `eval-${Date.now()}`,
      status: 'Upcoming'
    };
    setSellerEvaluationBookings(prev => [newBooking, ...prev]);
    showToast('In-person home evaluation successfully scheduled!', 'success');
  };

  const cancelSellerEvaluationBooking = (id: string) => {
    setSellerEvaluationBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'Cancelled' as const } : b));
    showToast('Evaluation booking cancelled.', 'info');
  };

  const rescheduleSellerEvaluationBooking = (id: string, date: string, time: string) => {
    setSellerEvaluationBookings(prev => prev.map(b => b.id === id ? { ...b, date, time } : b));
    showToast('Evaluation appointment rescheduled.', 'success');
  };

  const login = (role: 'buyer' | 'seller' | 'admin', targetPage?: string) => {
    const names = {
      buyer: 'Laurent de Bourgeois',
      seller: 'Elena Rostova',
      admin: 'Marcus Aurelius (Director)'
    };
    setUser({
      name: names[role],
      email: `${role}@novaestate.ca`,
      role
    });

    if (pendingPropertyAction && role === 'buyer') {
      const act = pendingPropertyAction;
      setPendingPropertyAction(null);
      setSelectedPropertyId(act.propertyId);
      
      if (act.type === 'save') {
        setCurrentPage('property-detail');
        toggleSaveProperty(act.propertyId);
        showToast(`Welcome back, ${names[role]}! Property "${act.propertyTitle || 'Luxury Home'}" saved to your collection.`, 'success');
      } else if (act.type === 'book') {
        setCurrentPage('schedule-viewing');
        showToast(`Welcome back! Resuming your tour booking for "${act.propertyTitle || 'Luxury Home'}".`, 'success');
      } else if (act.type === 'buy' || act.type === 'offer') {
        setCurrentPage('purchase-offer');
        showToast(`Welcome back! Resuming purchase offer for "${act.propertyTitle || 'Luxury Home'}".`, 'success');
      } else if (act.type === 'price_alert') {
        setCurrentPage('property-detail');
        addPriceAlert({ name: `Alert: ${act.propertyTitle || 'Property'}`, conditionType: 'Price Drop' });
        showToast(`Price alert activated for "${act.propertyTitle || 'Luxury Home'}".`, 'success');
      } else if (act.type === 'contact_agent') {
        setCurrentPage('property-detail');
        setAutoOpenPropertyModal('contact');
        showToast(`Welcome back! Connecting you with the listing agent.`, 'info');
      } else {
        setCurrentPage('property-detail');
      }
    } else if (pendingValuationData) {
      setCurrentValuationData(pendingValuationData);
      const pageToOpen = pendingRedirectPage || 'valuation-report';
      const addr = pendingValuationData.address;
      setPendingValuationData(null);
      setCurrentPage(pageToOpen);
      showToast(`Welcome back, ${names[role]}! Your property valuation details for ${addr} have been restored and processed.`, 'success');
    } else if (pendingSearchFilters) {
      if (pendingSearchFilters.filters) {
        setActiveFilters(prev => ({ ...prev, ...pendingSearchFilters.filters }));
      }
      if (pendingSearchFilters.searchQuery) {
        setSearchQuery(pendingSearchFilters.searchQuery);
      }
      const pageToOpen = pendingRedirectPage || 'search';
      setPendingSearchFilters(null);
      setCurrentPage(pageToOpen);
      showToast(`Welcome back, ${names[role]}! Your previous search results have been automatically restored.`, 'success');
    } else {
      const pageToOpen = targetPage || (role === 'buyer' ? 'search' : `dashboard-${role}`);
      setCurrentPage(pageToOpen);
      showToast(`Successfully authenticated as ${names[role]}`, 'success');
    }
  };

  const register = (data: { name: string; email: string; phone?: string; role?: 'buyer' | 'seller' | 'admin' }) => {
    const role = data.role || 'buyer';
    setUser({
      name: data.name || 'Valued Client',
      email: data.email,
      role
    });

    if (pendingValuationData) {
      setCurrentValuationData(pendingValuationData);
      const pageToOpen = pendingRedirectPage || 'valuation-report';
      const addr = pendingValuationData.address;
      setPendingValuationData(null);
      setCurrentPage(pageToOpen);
      showToast(`Account registered successfully! Restored property valuation for ${addr}.`, 'success');
    } else if (pendingSearchFilters) {
      if (pendingSearchFilters.filters) {
        setActiveFilters(prev => ({ ...prev, ...pendingSearchFilters.filters }));
      }
      if (pendingSearchFilters.searchQuery) {
        setSearchQuery(pendingSearchFilters.searchQuery);
      }
      const pageToOpen = pendingRedirectPage || 'search';
      setPendingSearchFilters(null);
      setCurrentPage(pageToOpen);
      showToast(`Account registered successfully! Restored your search criteria.`, 'success');
    } else {
      const pageToOpen = pendingRedirectPage || (role === 'buyer' ? 'search' : `dashboard-${role}`);
      setPendingRedirectPage('');
      setCurrentPage(pageToOpen);
      showToast(`Welcome to NovaEstate, ${data.name}! Account created.`, 'success');
    }
  };

  const logout = () => {
    const wasAdmin = user?.role === 'admin' || currentPage.includes('admin');
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('nova_user');
    }
    if (wasAdmin) {
      setCurrentPage('admin-login');
      showToast('Admin session terminated. Signed out of Enterprise Portal.', 'info');
    } else {
      setCurrentPage('home');
      showToast('Signed out of NovaEstate Secure Gateway', 'info');
    }
  };

  const toggleSaveProperty = (id: string) => {
    setSavedProperties(prev => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('Property removed from saved collection', 'info');
        return prev.filter(item => item !== id);
      } else {
        showToast('Property saved to Saved Homes & Recently Viewed', 'success');
        addToRecentlyViewed(id);
        return [...prev, id];
      }
    });
  };

  const toggleCompare = (id: string) => {
    setCompareList(prev => {
      if (prev.includes(id)) {
        showToast('Property removed from comparison grid', 'info');
        return prev.filter(i => i !== id);
      } else {
        if (prev.length >= 4) {
          showToast('You can compare up to 4 properties at once', 'warning');
          return prev;
        }
        showToast('Property added to side-by-side comparison', 'success');
        return [...prev, id];
      }
    });
  };

  const addToRecentlyViewed = (id: string) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(i => i !== id);
      return [id, ...filtered].slice(0, 10);
    });
  };

  const addSavedSearch = (name: string, city: string, filters: any, matchCount: number) => {
    const newSearch: SavedSearch = {
      id: `search-${Date.now()}`,
      name,
      city,
      filters,
      dateCreated: new Date().toISOString().split('T')[0],
      matchCount
    };
    setSavedSearches(prev => [newSearch, ...prev]);
    showToast(`Saved search criteria "${name}" to your workspace`, 'success');
  };

  const deleteSavedSearch = (id: string) => {
    setSavedSearches(prev => prev.filter(s => s.id !== id));
    showToast('Saved search removed', 'info');
  };

  const toggleFavoriteCommunity = (name: string) => {
    setFavoriteCommunities(prev => {
      if (prev.includes(name)) {
        showToast(`Removed ${name} from favorite communities`, 'info');
        return prev.filter(c => c !== name);
      } else {
        showToast(`Added ${name} to favorite communities`, 'success');
        return [...prev, name];
      }
    });
  };

  const bookViewing = (viewing: Omit<ViewingSchedule, 'id' | 'status'>) => {
    const newId = `view-${Date.now()}`;
    const targetProp = propertiesList.find(p => p.id === viewing.propertyId);
    const title = targetProp ? targetProp.title : 'Luxury Property';

    const newViewing: ViewingSchedule = {
      ...viewing,
      id: newId,
      status: 'Upcoming'
    };

    const newAppt: AppointmentItem = {
      id: `appt-${Date.now()}`,
      propertyTitle: title,
      agentName: viewing.agentName,
      date: viewing.date,
      time: viewing.time,
      status: 'Upcoming',
      feedback: viewing.notes
    };

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      type: 'viewing_reminder',
      title: 'Viewing Tour Scheduled',
      message: `Your VIP tour for ${title} with ${viewing.agentName} is confirmed for ${viewing.date} at ${viewing.time}.`,
      date: 'Just now',
      read: false
    };

    setViewingSchedule(prev => [newViewing, ...prev]);
    setAppointmentHistory(prev => [newAppt, ...prev]);
    setNotifications(prev => [newNotif, ...prev]);
    addToRecentlyViewed(viewing.propertyId);
    showToast('Viewing tour successfully scheduled!', 'success');
  };

  const rescheduleViewing = (id: string, newDate: string, newTime: string) => {
    setViewingSchedule(prev => prev.map(v => v.id === id ? { ...v, date: newDate, time: newTime } : v));
    showToast('Viewing appointment rescheduled', 'success');
  };

  const cancelViewing = (id: string) => {
    setViewingSchedule(prev => prev.map(v => v.id === id ? { ...v, status: 'Cancelled' as const } : v));
    showToast('Viewing appointment cancelled', 'info');
  };

  const addViewingNote = (id: string, note: string) => {
    setViewingSchedule(prev => prev.map(v => v.id === id ? { ...v, notes: note } : v));
    showToast('Appointment note updated', 'success');
  };

  const addPriceAlert = (alert: Omit<PriceAlert, 'id' | 'dateCreated' | 'status'>) => {
    const newAlert: PriceAlert = {
      ...alert,
      id: `alert-${Date.now()}`,
      status: 'Active',
      dateCreated: new Date().toISOString().split('T')[0]
    };
    setPriceAlerts(prev => [newAlert, ...prev]);
    showToast(`Price alert "${alert.name}" created!`, 'success');
  };

  const togglePriceAlertStatus = (id: string) => {
    setPriceAlerts(prev => prev.map(a => a.id === id ? { ...a, status: a.status === 'Active' ? 'Paused' : 'Active' } : a));
    showToast('Price alert status updated', 'info');
  };

  const deletePriceAlert = (id: string) => {
    setPriceAlerts(prev => prev.filter(a => a.id !== id));
    showToast('Price alert deleted', 'info');
  };

  const submitOffer = (offer: Omit<OfferItem, 'id' | 'status' | 'dateSubmitted'>) => {
    const newOffer: OfferItem = {
      ...offer,
      id: `offer-${Date.now()}`,
      status: 'Under Review',
      dateSubmitted: new Date().toISOString().split('T')[0]
    };
    setActiveOffers(prev => [newOffer, ...prev]);
    showToast('Formal purchase offer transmitted to listing agent!', 'success');
  };

  const updateOfferStatus = (id: string, status: OfferItem['status']) => {
    setActiveOffers(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    showToast(`Offer status updated to ${status}`, 'info');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = () => {
    setNotifications([]);
    showToast('Notification center cleared', 'info');
  };

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <AppContext.Provider value={{
      currentPage,
      setCurrentPage,
      selectedPropertyId,
      setSelectedPropertyId,
      selectedCommunityName,
      setSelectedCommunityName,
      selectedBlogId,
      setSelectedBlogId,
      user,
      login,
      register,
      logout,
      pendingPropertyAction,
      setPendingPropertyAction,
      autoOpenPropertyModal,
      setAutoOpenPropertyModal,
      roleSwitchModal,
      triggerRoleSwitchWarning,
      closeRoleSwitchModal,
      confirmRoleSwitch,
      pendingValuationData,
      currentValuationData,
      savePendingValuation,
      setCurrentValuationData,
      sellerEvaluationBookings,
      addSellerEvaluationBooking,
      cancelSellerEvaluationBooking,
      rescheduleSellerEvaluationBooking,
      pendingSearchFilters,
      savePendingSearch,
      selectedMapMarkerId,
      setSelectedMapMarkerId,
      searchQuery,
      setSearchQuery,
      activeFilters,
      setActiveFilters,
      savedProperties,
      toggleSaveProperty,
      compareList,
      toggleCompare,
      recentlyViewed,
      addToRecentlyViewed,
      savedSearches,
      addSavedSearch,
      deleteSavedSearch,
      favoriteCommunities,
      toggleFavoriteCommunity,
      viewingSchedule,
      bookViewing,
      rescheduleViewing,
      cancelViewing,
      addViewingNote,
      priceAlerts,
      addPriceAlert,
      togglePriceAlertStatus,
      deletePriceAlert,
      mortgageProgress,
      documents,
      appointmentHistory,
      activeOffers,
      submitOffer,
      updateOfferStatus,
      purchaseTimeline,
      notifications,
      markNotificationAsRead,
      clearNotifications,
      properties: propertiesList,
      communities,
      blogArticles,
      fetchNextPropertiesPage,
      hasNextPage,
      isFetchingNextPage,
      totalPropertiesCount,
      adminUsers,
      adminAgents,
      adminAppointments,
      updateListingStatus,
      toggleFeatureListing,
      deleteListing,
      updateUserStatus,
      deleteUser,
      updateAgentStatus,
      deleteAgent,
      updateAppointmentStatus,
      rescheduleAppointment,
      toasts,
      showToast,
      removeToast,
      backendConnected,
      backendHealthMessage
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
