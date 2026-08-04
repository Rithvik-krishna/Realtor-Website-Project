import { create } from 'zustand';
import { Property } from '@/types';

export interface ClientNote {
  id: string;
  text: string;
  createdAt: string;
}

export interface RealtorClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  budgetMin?: number;
  budgetMax?: number;
  preferredCities?: string[];
  requirements?: string;
  meetingDate?: string;
  savedPropertyIds: string[];
  savedProperties?: Property[];
  notes: ClientNote[];
  createdAt: string;
}

interface ClientCollectionsState {
  clients: RealtorClient[];
  addClient: (client: Omit<RealtorClient, 'id' | 'createdAt' | 'notes' | 'savedPropertyIds'>) => void;
  updateClient: (id: string, updates: Partial<RealtorClient>) => void;
  deleteClient: (id: string) => void;
  assignPropertyToClient: (clientId: string, property: Property) => void;
  removePropertyFromClient: (clientId: string, propertyId: string) => void;
  addClientNote: (clientId: string, noteText: string) => void;
  deleteClientNote: (clientId: string, noteId: string) => void;
}

const INITIAL_CLIENTS: RealtorClient[] = [
  {
    id: 'cli-1',
    name: 'David & Sarah Jenkins',
    email: 'david.jenkins@example.com',
    phone: '(416) 555-0192',
    budgetMin: 1200000,
    budgetMax: 1800000,
    preferredCities: ['Oakville', 'Burlington'],
    requirements: 'Detached 4 bed, modern kitchen, large backyard for kids',
    meetingDate: '2026-08-02',
    savedPropertyIds: [],
    notes: [
      { id: 'cn-1', text: 'Prefers quiet cul-de-sac over main roads', createdAt: new Date().toISOString() },
      { id: 'cn-2', text: 'Pre-approved with TD Bank for $1.75M', createdAt: new Date().toISOString() },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cli-2',
    name: 'Marcus Vance (Investor)',
    email: 'm.vance@investcorp.ca',
    phone: '(647) 555-0841',
    budgetMin: 800000,
    budgetMax: 1400000,
    preferredCities: ['Toronto', 'Mississauga'],
    requirements: 'High cap rate condo or duplex near subway line',
    meetingDate: '2026-08-05',
    savedPropertyIds: [],
    notes: [
      { id: 'cn-3', text: 'Looking to purchase 2 units before Q4', createdAt: new Date().toISOString() },
    ],
    createdAt: new Date().toISOString(),
  },
];

export const useClientCollectionsStore = create<ClientCollectionsState>((set) => ({
  clients: INITIAL_CLIENTS,

  addClient: (newClientData) => {
    set((state) => {
      const newClient: RealtorClient = {
        ...newClientData,
        id: `cli-${Date.now()}`,
        savedPropertyIds: [],
        notes: [],
        createdAt: new Date().toISOString(),
      };
      return { clients: [newClient, ...state.clients] };
    });
  },

  updateClient: (id, updates) => {
    set((state) => ({
      clients: state.clients.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));
  },

  deleteClient: (id) => {
    set((state) => ({
      clients: state.clients.filter((c) => c.id !== id),
    }));
  },

  assignPropertyToClient: (clientId, property) => {
    set((state) => ({
      clients: state.clients.map((c) => {
        if (c.id === clientId) {
          if (!c.savedPropertyIds.includes(property.id)) {
            const updatedProperties = [...(c.savedProperties || []), property];
            return {
              ...c,
              savedPropertyIds: [...c.savedPropertyIds, property.id],
              savedProperties: updatedProperties,
            };
          }
        }
        return c;
      }),
    }));
  },

  removePropertyFromClient: (clientId, propertyId) => {
    set((state) => ({
      clients: state.clients.map((c) => {
        if (c.id === clientId) {
          return {
            ...c,
            savedPropertyIds: c.savedPropertyIds.filter((id) => id !== propertyId),
            savedProperties: (c.savedProperties || []).filter((p) => p.id !== propertyId),
          };
        }
        return c;
      }),
    }));
  },

  addClientNote: (clientId, noteText) => {
    if (!noteText.trim()) return;
    set((state) => ({
      clients: state.clients.map((c) => {
        if (c.id === clientId) {
          const newNote: ClientNote = {
            id: `cn-${Date.now()}`,
            text: noteText.trim(),
            createdAt: new Date().toISOString(),
          };
          return { ...c, notes: [newNote, ...c.notes] };
        }
        return c;
      }),
    }));
  },

  deleteClientNote: (clientId, noteId) => {
    set((state) => ({
      clients: state.clients.map((c) => {
        if (c.id === clientId) {
          return { ...c, notes: c.notes.filter((n) => n.id !== noteId) };
        }
        return c;
      }),
    }));
  },
}));
