/**
 * Property Listing - Realtor Search Header & GTA City Filter Carousel
 */

import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '@/theme';
import { triggerHaptic } from '@/utils';

const GTA_CITIES = ['ALL', 'Toronto', 'Mississauga', 'Oakville', 'Vaughan', 'Brampton', 'Markham', 'Richmond Hill', 'Barrie'];

interface PropertyListHeaderProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  selectedCity?: string;
  onSelectCity?: (city: string) => void;
  viewMode: 'list' | 'grid' | 'map';
  onViewModeChange: (mode: 'list' | 'grid' | 'map') => void;
  onOpenFilters: () => void;
  activeFilterCount: number;
  onVoiceSearchPress: () => void;
}

export function PropertyListHeader({
  searchQuery,
  onSearchChange,
  selectedCity = 'ALL',
  onSelectCity,
  viewMode,
  onViewModeChange,
  onOpenFilters,
  activeFilterCount,
  onVoiceSearchPress,
}: PropertyListHeaderProps) {
  const handleToggleMode = (mode: 'list' | 'grid' | 'map') => {
    triggerHaptic.light();
    onViewModeChange(mode);
  };

  const handleSelectCity = (city: string) => {
    triggerHaptic.light();
    if (onSelectCity) onSelectCity(city);
  };

  return (
    <View style={styles.container}>
      {/* Title Header */}
      <View style={styles.titleRow}>
        <Text style={styles.titleText}>🏢 Realtor MLS® Property Search</Text>
        <Text style={styles.subtitleText}>Live Greater Toronto Area TRREB Listings</Text>
      </View>

      {/* Search Input & Voice Action */}
      <View style={styles.searchRow}>
        <View style={styles.searchInputContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            value={searchQuery}
            onChangeText={onSearchChange}
            placeholder="Search address, MLS#, city, or property type..."
            placeholderTextColor={Colors.textMuted}
            style={styles.searchInput}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => onSearchChange('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <TouchableOpacity style={styles.voiceBtn} onPress={onVoiceSearchPress}>
          <Text style={styles.voiceIcon}>🎙️</Text>
        </TouchableOpacity>
      </View>

      {/* Quick City Filter Scroll */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cityScroll}>
        {GTA_CITIES.map((city) => {
          const isSelected = selectedCity === city;
          return (
            <TouchableOpacity
              key={city}
              activeOpacity={0.8}
              style={[styles.cityPill, isSelected && styles.cityPillActive]}
              onPress={() => handleSelectCity(city)}
            >
              <Text style={[styles.cityText, isSelected && styles.cityTextActive]}>
                {city === 'ALL' ? '📍 All GTA' : city}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Control Buttons: View Toggle & Filter Badge */}
      <View style={styles.controlRow}>
        {/* View Mode Toggle Segment */}
        <View style={styles.segmentContainer}>
          <TouchableOpacity
            style={[styles.segmentBtn, viewMode === 'list' && styles.segmentBtnActive]}
            onPress={() => handleToggleMode('list')}
          >
            <Text style={[styles.segmentText, viewMode === 'list' && styles.segmentTextActive]}>List</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segmentBtn, viewMode === 'grid' && styles.segmentBtnActive]}
            onPress={() => handleToggleMode('grid')}
          >
            <Text style={[styles.segmentText, viewMode === 'grid' && styles.segmentTextActive]}>Grid</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segmentBtn, viewMode === 'map' && styles.segmentBtnActive]}
            onPress={() => handleToggleMode('map')}
          >
            <Text style={[styles.segmentText, viewMode === 'map' && styles.segmentTextActive]}>Map</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Drawer Button */}
        <TouchableOpacity style={styles.filterBtn} onPress={onOpenFilters}>
          <Text style={styles.filterBtnText}>⚙️ Advanced Filters</Text>
          {activeFilterCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.xs,
    backgroundColor: Colors.background,
  },
  titleRow: {
    marginBottom: Spacing.xs,
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs + 2,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardHover,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    height: 42,
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
  clearIcon: {
    color: Colors.textMuted,
    fontSize: Typography.fontSizes.sm,
    padding: Spacing.xs,
  },
  voiceBtn: {
    width: 42,
    height: 42,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.cardHover,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  voiceIcon: {
    fontSize: Typography.fontSizes.sm,
  },
  cityScroll: {
    paddingBottom: Spacing.xs + 2,
    gap: 6,
  },
  cityPill: {
    backgroundColor: Colors.cardHover,
    paddingVertical: 5,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  cityPillActive: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    borderColor: Colors.primary,
  },
  cityText: {
    fontSize: Typography.fontSizes.xs - 1,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  cityTextActive: {
    color: Colors.textGold,
    fontWeight: '800',
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.cardHover,
    borderRadius: BorderRadius.sm,
    padding: 2,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  segmentBtn: {
    paddingVertical: 5,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.xs,
  },
  segmentBtnActive: {
    backgroundColor: Colors.primary,
  },
  segmentText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  segmentTextActive: {
    color: Colors.background,
    fontWeight: '800',
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardHover,
    paddingVertical: 6,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  filterBtnText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  filterBadge: {
    backgroundColor: Colors.primary,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.xs,
  },
  filterBadgeText: {
    fontSize: Typography.fontSizes.xs - 2,
    color: Colors.background,
    fontWeight: '800',
  },
});

export default PropertyListHeader;
