import { create } from 'zustand';

export interface PropertyPrivateNote {
  id: string;
  propertyId: string;
  text: string;
  createdAt: string;
  updatedAt?: string;
}

interface PropertyNotesState {
  notesMap: Record<string, PropertyPrivateNote[]>; // propertyId -> PropertyPrivateNote[]
  addNote: (propertyId: string, text: string) => void;
  deleteNote: (propertyId: string, noteId: string) => void;
  getNotes: (propertyId: string) => PropertyPrivateNote[];
}

export const usePropertyNotesStore = create<PropertyNotesState>((set, get) => ({
  notesMap: {
    // Initial sample private realtor notes for demonstration
    'prop-1': [
      { id: 'pn-1', propertyId: 'prop-1', text: 'Client liked modern kitchen island and natural light in master bedroom.', createdAt: new Date().toISOString() },
      { id: 'pn-2', propertyId: 'prop-1', text: 'Offer expected Friday around $1.45M.', createdAt: new Date().toISOString() },
    ],
  },

  addNote: (propertyId, text) => {
    if (!text.trim()) return;
    set((state) => {
      const existing = state.notesMap[propertyId] || [];
      const newNote: PropertyPrivateNote = {
        id: `pn-${Date.now()}`,
        propertyId,
        text: text.trim(),
        createdAt: new Date().toISOString(),
      };
      return {
        notesMap: {
          ...state.notesMap,
          [propertyId]: [newNote, ...existing],
        },
      };
    });
  },

  deleteNote: (propertyId, noteId) => {
    set((state) => {
      const existing = state.notesMap[propertyId] || [];
      return {
        notesMap: {
          ...state.notesMap,
          [propertyId]: existing.filter((n) => n.id !== noteId),
        },
      };
    });
  },

  getNotes: (propertyId) => {
    const { notesMap } = get();
    return notesMap[propertyId] || [];
  },
}));
