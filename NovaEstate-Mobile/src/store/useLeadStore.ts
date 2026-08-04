/**
 * NovaEstate Mobile - Realtor Companion Lead Inbox Store
 */

import { create } from 'zustand';
import { Lead, LeadStatus } from '@/types';

const INITIAL_REAL_LEADS: Lead[] = [
  {
    id: 'lead-1',
    clientName: 'Michael Scott',
    phone: '+14165550192',
    email: 'm.scott@gmail.com',
    inquiryType: 'REQUEST_SHOWING',
    propertyAddress: '690 Dorval Drive 500, Oakville',
    mlsNumber: 'W12260926',
    status: 'NEW',
    timestamp: '10 mins ago',
    message: 'Hi, I would like to schedule an in-person viewing of this property tomorrow at 2 PM.',
  },
  {
    id: 'lead-2',
    clientName: 'Sarah Connor',
    phone: '+14165550183',
    email: 'sarah.connor@yahoo.ca',
    inquiryType: 'ASK_QUESTION',
    propertyAddress: 'Douro-Dummer, ON',
    mlsNumber: 'X12328047',
    status: 'NEW',
    timestamp: '1 hour ago',
    message: 'Are there any recent property tax assessments available for this listing?',
  },
  {
    id: 'lead-3',
    clientName: 'David Miller',
    phone: '+14165550174',
    email: 'dmiller@enterprise.com',
    inquiryType: 'CONTACT_AGENT',
    propertyAddress: 'Perry, ON',
    mlsNumber: 'X12353623',
    status: 'CONTACTED',
    timestamp: 'Yesterday',
    message: 'Looking to sell my commercial lot in Perry. Please call me back.',
  },
];

interface LeadState {
  leads: Lead[];
  activeFilter: LeadStatus | 'ALL';
  setActiveFilter: (filter: LeadStatus | 'ALL') => void;
  toggleContactedStatus: (id: string) => void;
  addLead: (lead: Omit<Lead, 'id'>) => void;
  setLeads: (leads: Lead[]) => void;
}

export const useLeadStore = create<LeadState>((set) => ({
  leads: INITIAL_REAL_LEADS,
  activeFilter: 'ALL',

  setActiveFilter: (filter) => set({ activeFilter: filter }),

  toggleContactedStatus: (id) =>
    set((state) => ({
      leads: state.leads.map((l) => {
        if (l.id === id) {
          const newStatus: LeadStatus = l.status === 'NEW' ? 'CONTACTED' : 'NEW';
          return {
            ...l,
            status: newStatus,
            lastContactedAt: newStatus === 'CONTACTED' ? 'Just now' : undefined,
          };
        }
        return l;
      }),
    })),

  addLead: (leadData) =>
    set((state) => ({
      leads: [{ ...leadData, id: `lead-${Date.now()}` }, ...state.leads],
    })),

  setLeads: (leads) => set({ leads }),
}));

export default useLeadStore;
