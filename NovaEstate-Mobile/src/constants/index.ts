/**
 * NovaEstate Mobile - App Constants & Defaults
 */

export const APP_CONFIG = {
  appName: 'NovaEstate Mobile',
  realtorEdition: 'Realtor Command Center v1.0',
  defaultRegion: 'GTA',
  defaultCurrency: 'CAD',
  supportEmail: 'realtors@novaestate.ca',
  brokerageSplitDefault: 0.85, // 85% to Agent, 15% to Brokerage
};

export const CITIES = [
  'Toronto',
  'Mississauga',
  'Brampton',
  'Oakville',
  'Vaughan',
  'Markham',
  'Richmond Hill',
  'Burlington',
];

export const PROPERTY_TYPES = [
  { label: 'Detached Home', value: 'DETACHED' },
  { label: 'Semi-Detached', value: 'SEMI_DETACHED' },
  { label: 'Townhouse', value: 'TOWNHOUSE' },
  { label: 'Luxury Condo', value: 'CONDO' },
  { label: 'Commercial Estate', value: 'COMMERCIAL' },
];

export * from './theme';
