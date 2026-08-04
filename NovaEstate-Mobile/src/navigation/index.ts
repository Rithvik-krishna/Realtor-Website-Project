/**
 * NovaEstate Mobile - Navigation Types & Route Helpers
 */

export * from './ProtectedRoute';
export * from './deepLinking';

export type RootTabParamList = {
  index: undefined;          // Dashboard / Command Center
  properties: undefined;     // MLS Properties & Search
  leads: undefined;          // Active Lead Pipeline CRM
  clients: undefined;        // Client Dossier & Directory
  'ai-assistant': undefined; // AI Property Matcher & Advisor
  profile: undefined;        // Realtor Profile & Settings
};

export type RootStackParamList = {
  '(tabs)': undefined;
  '(auth)/login': undefined;
  'property/[id]': { id: string };
  'appointment/[id]': { id: string };
  'notification/[id]': { id: string };
  'saved-properties/index': undefined;
  'market-intelligence/index': undefined;
  'settings/index': undefined;
  'bottom-sheet': undefined;
};

export const TAB_ROUTES = [
  { name: 'index', title: 'Dashboard', icon: 'square.grid.2x2.fill' },
  { name: 'properties', title: 'Properties', icon: 'building.2.fill' },
  { name: 'leads', title: 'Leads', icon: 'chart.bar.doc.horizontal.fill' },
  { name: 'clients', title: 'Clients', icon: 'person.2.fill' },
  { name: 'ai-assistant', title: 'AI Assistant', icon: 'sparkles' },
  { name: 'profile', title: 'Profile', icon: 'person.crop.circle.fill' },
] as const;
