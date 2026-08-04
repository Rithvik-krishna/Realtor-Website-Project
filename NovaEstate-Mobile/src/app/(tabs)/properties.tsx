import React, { useState, useCallback, useMemo } from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Spacing } from '@/theme';
import { useInfinitePropertiesQuery } from '@/hooks';
import { triggerHaptic } from '@/utils';
import { EmptyState, FloatingActionButton } from '@/components/ui';
import { useFilterStore } from '@/store';

import { PropertyListHeader } from '@/features/properties/PropertyListHeader';
import { PropertyCard } from '@/features/properties/PropertyCard';
import { PropertySkeletonList } from '@/features/properties/PropertySkeleton';
import { PropertyMapView } from '@/features/properties/PropertyMapView';
import { PropertyFilterModal, FilterOptions } from '@/features/properties/PropertyFilterModal';

export default function PropertiesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ city?: string; propertyType?: string; bedrooms?: string; maxPrice?: string; q?: string }>();
  
  const filterStore = useFilterStore();

  const searchQuery = filterStore.searchQuery || (params.q as string) || '';
  const setSearchQuery = (text: string) => filterStore.setSearchQuery(text);

  const selectedCity = filterStore.city || (params.city as string) || 'ALL';
  const setSelectedCity = (city: string) => filterStore.setCity(city);

  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'map'>('list');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const filters: FilterOptions = useMemo(() => ({
    propertyType: filterStore.propertyType || (params.propertyType as string) || 'ALL',
    minPrice: filterStore.minPrice || 0,
    maxPrice: filterStore.maxPrice || (params.maxPrice ? parseInt(params.maxPrice as string, 10) : 10000000),
    bedrooms: filterStore.bedrooms || (params.bedrooms as string) || 'ANY',
    bathrooms: filterStore.bathrooms || 'ANY',
    openHouseOnly: false,
  }), [filterStore, params]);

  const setFilters = useCallback((newFilters: FilterOptions) => {
    filterStore.setFilters({
      propertyType: newFilters.propertyType,
      minPrice: newFilters.minPrice,
      maxPrice: newFilters.maxPrice,
      bedrooms: newFilters.bedrooms,
      bathrooms: newFilters.bathrooms,
    });
  }, [filterStore]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.propertyType !== 'ALL') count++;
    if (filters.bedrooms !== 'ANY') count++;
    if (filters.bathrooms !== 'ANY') count++;
    if (filters.openHouseOnly) count++;
    if (selectedCity !== 'ALL') count++;
    return count;
  }, [filters, selectedCity]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    isRefetching,
  } = useInfinitePropertiesQuery();

  const allProperties = useMemo(() => {
    if (!data?.pages) return [];
    const flat = data.pages.flatMap((page) => page.data || []);
    const seen = new Set<string>();
    return flat.filter((p) => {
      const key = p.id || p.mlsNumber;
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [data]);

  const filteredProperties = useMemo(() => {
    let list = allProperties;

    // Filter by City
    if (selectedCity !== 'ALL') {
      list = list.filter((p) => p.city.toLowerCase() === selectedCity.toLowerCase());
    }

    // Filter by Property Type
    if (filters.propertyType !== 'ALL') {
      list = list.filter((p) => (p.propertyType || '').toUpperCase().includes(filters.propertyType.toUpperCase()));
    }

    // Filter by Bedrooms
    if (filters.bedrooms !== 'ANY') {
      const minBeds = parseInt(filters.bedrooms.replace('+', ''), 10);
      if (!isNaN(minBeds)) {
        list = list.filter((p) => (p.bedrooms || 0) >= minBeds);
      }
    }

    // Filter by Bathrooms
    if (filters.bathrooms !== 'ANY') {
      const minBaths = parseInt(filters.bathrooms.replace('+', ''), 10);
      if (!isNaN(minBaths)) {
        list = list.filter((p) => (p.bathrooms || 0) >= minBaths);
      }
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.city.toLowerCase().includes(query) ||
          p.address.toLowerCase().includes(query) ||
          p.mlsNumber.toLowerCase().includes(query) ||
          (p.propertyType && p.propertyType.toLowerCase().includes(query))
      );
    }

    return list;
  }, [allProperties, searchQuery, selectedCity, filters]);

  const handleRefresh = useCallback(async () => {
    triggerHaptic.medium();
    await refetch();
  }, [refetch]);

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handlePropertyPress = (id: string) => {
    triggerHaptic.light();
    router.push(`/property/${id}` as any);
  };

  const handleVoiceSearch = () => {
    triggerHaptic.medium();
    router.push('/bottom-sheet' as any);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <PropertyListHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCity={selectedCity}
        onSelectCity={setSelectedCity}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenFilters={() => setIsFilterModalOpen(true)}
        activeFilterCount={activeFilterCount}
        onVoiceSearchPress={handleVoiceSearch}
      />

      {isLoading ? (
        <PropertySkeletonList viewMode={viewMode === 'map' ? 'list' : viewMode} count={6} />
      ) : viewMode === 'map' ? (
        <PropertyMapView properties={filteredProperties} />
      ) : (
        <FlatList
          data={filteredProperties}
          key={viewMode}
          numColumns={viewMode === 'grid' ? 2 : 1}
          columnWrapperStyle={viewMode === 'grid' ? styles.gridRow : undefined}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          removeClippedSubviews={true}
          maxToRenderPerBatch={8}
          initialNumToRender={10}
          windowSize={7}
          renderItem={({ item }) => (
            <PropertyCard
              property={item}
              viewMode={viewMode}
              onPress={() => handlePropertyPress(item.id)}
            />
          )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={handleRefresh}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
          ListEmptyComponent={
            <EmptyState
              icon="🏢"
              title="No Properties Found"
              description="We couldn't find any MLS properties matching your search or filters."
              primaryActionLabel="Reset Filters"
              onPrimaryAction={() => {
                setSearchQuery('');
                setSelectedCity('ALL');
                setFilters({
                  propertyType: 'ALL',
                  minPrice: 0,
                  maxPrice: 10000000,
                  bedrooms: 'ANY',
                  bathrooms: 'ANY',
                  openHouseOnly: false,
                });
              }}
            />
          }
        />
      )}

      {/* Property Filter Bottom Sheet Modal */}
      <PropertyFilterModal
        visible={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={(newFilters) => setFilters(newFilters)}
      />

      <FloatingActionButton icon="⚙️" label="Filter" onPress={() => setIsFilterModalOpen(true)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingHorizontal: 18,
    paddingTop: Spacing.xs,
    paddingBottom: 110,
  },
  gridRow: {
    justifyContent: 'space-between',
  },
});
