/**
 * Client Management - List Header & Filter Segment
 */

import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '@/theme';
import { triggerHaptic } from '@/utils';

interface ClientListHeaderProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  showVipOnly: boolean;
  onToggleVip: () => void;
}

export function ClientListHeader({
  searchQuery,
  onSearchChange,
  showVipOnly,
  onToggleVip,
}: ClientListHeaderProps) {
  const handleToggleVip = () => {
    triggerHaptic.light();
    onToggleVip();
  };

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchRow}>
        <View style={styles.searchInputContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            value={searchQuery}
            onChangeText={onSearchChange}
            placeholder="Search VIP clients by name, email, or city..."
            placeholderTextColor={Colors.textMuted}
            style={styles.searchInput}
          />
        </View>

        {/* VIP Filter Toggle Button */}
        <TouchableOpacity
          style={[styles.vipBtn, showVipOnly && styles.vipBtnActive]}
          onPress={handleToggleVip}
        >
          <Text style={styles.vipIcon}>⭐</Text>
          <Text style={[styles.vipText, showVipOnly && styles.vipTextActive]}>VIP</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.background,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardHover,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    height: 44,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  searchIcon: {
    fontSize: Typography.fontSizes.sm,
    marginRight: Spacing.xs,
  },
  searchInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: Typography.fontSizes.sm,
  },
  vipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardHover,
    height: 44,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginLeft: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  vipBtnActive: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    borderColor: Colors.borderActive,
  },
  vipIcon: {
    fontSize: Typography.fontSizes.xs,
    marginRight: 4,
  },
  vipText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  vipTextActive: {
    color: Colors.primaryLight,
    fontWeight: '700',
  },
});

export default ClientListHeader;
