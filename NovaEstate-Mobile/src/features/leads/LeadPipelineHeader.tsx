/**
 * Lead Management - Lead Inbox Header & Status Filters
 */

import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '@/theme';
import { LeadStatus } from '@/types';
import { triggerHaptic } from '@/utils';

const STAGES: Array<{ id: LeadStatus | 'ALL'; name: string }> = [
  { id: 'ALL', name: '⚡ All Leads' },
  { id: 'NEW', name: '🔴 Uncontacted (New)' },
  { id: 'CONTACTED', name: '✓ Contacted' },
];

interface LeadPipelineHeaderProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  selectedStage: LeadStatus | 'ALL';
  onSelectStage: (stage: LeadStatus | 'ALL') => void;
}

export function LeadPipelineHeader({
  searchQuery,
  onSearchChange,
  selectedStage,
  onSelectStage,
}: LeadPipelineHeaderProps) {
  const handleSelectStage = (stage: LeadStatus | 'ALL') => {
    triggerHaptic.light();
    onSelectStage(stage);
  };

  return (
    <View style={styles.container}>
      {/* Title Header */}
      <View style={styles.titleRow}>
        <Text style={styles.titleText}>⚡ Instant Website Lead Inbox</Text>
        <Text style={styles.subtitleText}>Speed-to-lead response tracker</Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchRow}>
        <View style={styles.searchInputContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            value={searchQuery}
            onChangeText={onSearchChange}
            placeholder="Search leads by name, phone, email, address..."
            placeholderTextColor={Colors.textMuted}
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* Filter Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stageScroll}>
        {STAGES.map((stage) => {
          const isSelected = selectedStage === stage.id;
          return (
            <TouchableOpacity
              key={stage.id}
              activeOpacity={0.75}
              style={[styles.pill, isSelected && styles.pillSelected]}
              onPress={() => handleSelectStage(stage.id)}
            >
              <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>{stage.name}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xs,
    backgroundColor: Colors.background,
  },
  titleRow: {
    marginBottom: Spacing.xs + 2,
  },
  titleText: {
    fontSize: Typography.fontSizes.md + 2,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  subtitleText: {
    fontSize: Typography.fontSizes.xs - 1,
    color: Colors.textGold,
    fontWeight: '600',
  },
  searchRow: {
    marginVertical: Spacing.xs,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardHover,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    height: 40,
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
    fontSize: Typography.fontSizes.xs + 1,
  },
  stageScroll: {
    paddingVertical: Spacing.xs,
  },
  pill: {
    backgroundColor: Colors.cardHover,
    paddingVertical: 6,
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
    fontWeight: '800',
  },
});

export default LeadPipelineHeader;
