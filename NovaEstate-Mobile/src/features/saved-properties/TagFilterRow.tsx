/**
 * Saved Properties - Tag Filter Chips Row
 */

import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '@/theme';
import { triggerHaptic } from '@/utils';

const TAGS = ['#Yorkville', '#Penthouses', '#Waterfront', '#Under3M', '#BridlePath'];

interface TagFilterRowProps {
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
}

export function TagFilterRow({ selectedTag, onSelectTag }: TagFilterRowProps) {
  const handleToggleTag = (tag: string) => {
    triggerHaptic.light();
    if (selectedTag === tag) {
      onSelectTag(null);
    } else {
      onSelectTag(tag);
    }
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
      {TAGS.map((tag) => {
        const isSelected = selectedTag === tag;
        return (
          <TouchableOpacity
            key={tag}
            activeOpacity={0.75}
            style={[styles.chip, isSelected && styles.chipSelected]}
            onPress={() => handleToggleTag(tag)}
          >
            <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>{tag}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  chip: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingVertical: 5,
    paddingHorizontal: Spacing.sm + 2,
    borderRadius: BorderRadius.xs,
    marginRight: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  chipSelected: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    borderColor: Colors.borderActive,
  },
  chipText: {
    fontSize: Typography.fontSizes.xs - 1,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: Colors.primaryLight,
    fontWeight: '700',
  },
});

export default TagFilterRow;
