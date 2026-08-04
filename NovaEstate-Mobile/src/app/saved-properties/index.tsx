/**
 * NovaEstate Mobile - Saved Properties & Collections Screen
 */

import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography, BorderRadius } from '@/theme';
import { usePropertiesQuery } from '@/hooks';
import { triggerHaptic } from '@/utils';

import { CollectionsBar } from '@/features/saved-properties/CollectionsBar';
import { TagFilterRow } from '@/features/saved-properties/TagFilterRow';
import { SavedPropertyCard } from '@/features/saved-properties/SavedPropertyCard';

export default function SavedPropertiesScreen() {
  const router = useRouter();
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: response, isLoading } = usePropertiesQuery();
  const properties = response?.data || [];

  const filteredProperties = useMemo(() => {
    let result = properties;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q)
      );
    }

    return result;
  }, [properties, searchQuery]);

  const handlePropertyPress = (id: string) => {
    triggerHaptic.light();
    router.push(`/property/${id}` as any);
  };

  const handleArchiveToggle = (id: string) => {
    // Handled in component
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search saved properties & collections..."
            placeholderTextColor={Colors.textMuted}
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* 1. Collection Folders Bar */}
      <CollectionsBar selectedFolderId={selectedFolder} onSelectFolder={setSelectedFolder} />

      {/* 2. Tag Filter Chips */}
      <TagFilterRow selectedTag={selectedTag} onSelectTag={setSelectedTag} />

      {/* 3. Saved Property List */}
      <FlatList
        data={filteredProperties}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <SavedPropertyCard
            property={item}
            onPress={() => handlePropertyPress(item.id)}
            onArchiveToggle={handleArchiveToggle}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No saved properties in this collection.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchContainer: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
  },
  searchInputWrapper: {
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
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xl,
  },
  emptyContainer: {
    padding: Spacing.xxl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
