/**
 * Saved Properties - Collections & Folder Filter Pills
 */

import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '@/theme';
import { triggerHaptic } from '@/utils';

export interface CollectionFolder {
  id: string;
  name: string;
  count: number;
}

const DEFAULT_FOLDERS: CollectionFolder[] = [
  { id: 'all', name: 'All Saved', count: 12 },
  { id: 'client-shortlist', name: 'Client Shortlists', count: 5 },
  { id: 'luxury-condos', name: 'Luxury Condos', count: 4 },
  { id: 'investments', name: 'Investments', count: 3 },
  { id: 'archived', name: 'Archived', count: 2 },
];

interface CollectionsBarProps {
  selectedFolderId: string;
  onSelectFolder: (id: string) => void;
}

export function CollectionsBar({ selectedFolderId, onSelectFolder }: CollectionsBarProps) {
  const handleSelect = (id: string) => {
    triggerHaptic.light();
    onSelectFolder(id);
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
      {DEFAULT_FOLDERS.map((folder) => {
        const isSelected = folder.id === selectedFolderId;
        return (
          <TouchableOpacity
            key={folder.id}
            activeOpacity={0.75}
            style={[styles.pill, isSelected && styles.pillSelected]}
            onPress={() => handleSelect(folder.id)}
          >
            <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>
              {folder.name} ({folder.count})
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  pill: {
    backgroundColor: Colors.cardHover,
    paddingVertical: 8,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.xs + 2,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  pillSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.borderActive,
  },
  pillText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  pillTextSelected: {
    color: Colors.background,
    fontWeight: '700',
  },
});

export default CollectionsBar;
