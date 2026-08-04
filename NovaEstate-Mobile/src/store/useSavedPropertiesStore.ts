import { create } from 'zustand';
import { Property } from '@/types';

export interface SavedFolder {
  id: string;
  name: string;
  propertyIds: string[];
  createdAt: string;
}

interface SavedPropertiesState {
  savedProperties: Record<string, Property>; // propertyId -> Property
  folders: SavedFolder[];
  saveProperty: (property: Property, folderName?: string) => void;
  removeProperty: (propertyId: string, folderName?: string) => void;
  isSaved: (propertyId: string) => boolean;
  createFolder: (name: string) => void;
  deleteFolder: (folderId: string) => void;
  getPropertiesInFolder: (folderName: string) => Property[];
}

const DEFAULT_FOLDERS: SavedFolder[] = [
  { id: 'f-fav', name: 'Favorites', propertyIds: [], createdAt: new Date().toISOString() },
  { id: 'f-lux', name: 'Luxury Homes', propertyIds: [], createdAt: new Date().toISOString() },
  { id: 'f-com', name: 'Commercial', propertyIds: [], createdAt: new Date().toISOString() },
  { id: 'f-inv', name: 'Investment', propertyIds: [], createdAt: new Date().toISOString() },
  { id: 'f-cli', name: 'Client Prospects', propertyIds: [], createdAt: new Date().toISOString() },
];

export const useSavedPropertiesStore = create<SavedPropertiesState>((set, get) => ({
  savedProperties: {},
  folders: DEFAULT_FOLDERS,

  saveProperty: (property: Property, folderName = 'Favorites') => {
    set((state) => {
      const updatedSaved = { ...state.savedProperties, [property.id]: property };
      const updatedFolders = state.folders.map((f) => {
        if (f.name.toLowerCase() === folderName.toLowerCase()) {
          if (!f.propertyIds.includes(property.id)) {
            return { ...f, propertyIds: [...f.propertyIds, property.id] };
          }
        }
        return f;
      });
      return { savedProperties: updatedSaved, folders: updatedFolders };
    });
  },

  removeProperty: (propertyId: string, folderName?: string) => {
    set((state) => {
      let updatedFolders = state.folders;
      if (folderName) {
        updatedFolders = state.folders.map((f) => {
          if (f.name.toLowerCase() === folderName.toLowerCase()) {
            return { ...f, propertyIds: f.propertyIds.filter((id) => id !== propertyId) };
          }
          return f;
        });
      } else {
        // Remove from all folders
        updatedFolders = state.folders.map((f) => ({
          ...f,
          propertyIds: f.propertyIds.filter((id) => id !== propertyId),
        }));
      }

      // Check if property is still in any folder
      const isStillInAnyFolder = updatedFolders.some((f) => f.propertyIds.includes(propertyId));
      const updatedSaved = { ...state.savedProperties };
      if (!isStillInAnyFolder) {
        delete updatedSaved[propertyId];
      }

      return { savedProperties: updatedSaved, folders: updatedFolders };
    });
  },

  isSaved: (propertyId: string) => {
    const { savedProperties } = get();
    return !!savedProperties[propertyId];
  },

  createFolder: (name: string) => {
    if (!name.trim()) return;
    set((state) => {
      if (state.folders.some((f) => f.name.toLowerCase() === name.trim().toLowerCase())) {
        return state;
      }
      const newFolder: SavedFolder = {
        id: `f-${Date.now()}`,
        name: name.trim(),
        propertyIds: [],
        createdAt: new Date().toISOString(),
      };
      return { folders: [...state.folders, newFolder] };
    });
  },

  deleteFolder: (folderId: string) => {
    set((state) => ({
      folders: state.folders.filter((f) => f.id !== folderId),
    }));
  },

  getPropertiesInFolder: (folderName: string) => {
    const { folders, savedProperties } = get();
    const folder = folders.find((f) => f.name.toLowerCase() === folderName.toLowerCase());
    if (!folder) return [];
    return folder.propertyIds.map((id) => savedProperties[id]).filter(Boolean);
  },
}));
