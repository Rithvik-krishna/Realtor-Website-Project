/**
 * NovaEstate Mobile - Native Deep Linking Configuration
 */

export const deepLinkingConfig = {
  prefixes: ['novaestate://', 'https://novaestate.ca', 'https://*.novaestate.ca'],
  config: {
    screens: {
      '(tabs)': {
        screens: {
          index: 'dashboard',
          properties: 'properties',
          leads: 'leads',
          clients: 'clients',
          'ai-assistant': 'ai-assistant',
          profile: 'profile',
        },
      },
      '(auth)': {
        screens: {
          login: 'login',
        },
      },
      'property/[id]': 'property/:id',
      'appointment/[id]': 'appointment/:id',
      'notification/[id]': 'notification/:id',
      'saved-properties/index': 'saved-properties',
      'market-intelligence/index': 'market-intelligence',
      'settings/index': 'settings',
      'bottom-sheet': 'sheet',
    },
  },
};

export default deepLinkingConfig;
