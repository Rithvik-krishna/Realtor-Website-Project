import React, { useState, useMemo } from 'react';
import { FlatList, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing } from '@/theme';
import { useClientsQuery } from '@/hooks';
import { triggerHaptic } from '@/utils';
import { EmptyState, FloatingActionButton } from '@/components/ui';

import { ClientListHeader } from '@/features/clients/ClientListHeader';
import { ClientCard } from '@/features/clients/ClientCard';

export default function ClientsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showVipOnly, setShowVipOnly] = useState(false);

  const { data: response, isLoading, refetch, isRefetching } = useClientsQuery();
  const clients = response?.data || [];

  const filteredClients = useMemo(() => {
    let result = clients;

    if (showVipOnly) {
      result = result.filter((c) => c.isVip);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.preferredCities.some((city) => city.toLowerCase().includes(q))
      );
    }

    return result;
  }, [clients, searchQuery, showVipOnly]);

  const handleClientPress = (id: string) => {
    triggerHaptic.light();
    router.push(`/client/${id}` as any);
  };

  const handleRefresh = async () => {
    triggerHaptic.medium();
    await refetch();
  };

  const handleAddClient = () => {
    triggerHaptic.medium();
    router.push('/bottom-sheet' as any);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      {/* Search Bar & VIP Toggle */}
      <ClientListHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showVipOnly={showVipOnly}
        onToggleVip={() => setShowVipOnly((prev) => !prev)}
      />

      {/* Client Cards List */}
      <FlatList
        data={filteredClients}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ClientCard client={item} onPress={() => handleClientPress(item.id)} />
        )}
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
            icon="💼"
            title="No Clients Found"
            description="Your VIP client directory is empty or no contacts match your current search query."
            primaryActionLabel="Add Client"
            onPrimaryAction={handleAddClient}
            secondaryActionLabel="Sync Phone Contacts"
            onSecondaryAction={handleAddClient}
          />
        }
      />

      <FloatingActionButton icon="👤" label="Add Client" onPress={handleAddClient} />
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
    paddingTop: Spacing.sm,
    paddingBottom: 110,
  },
});

