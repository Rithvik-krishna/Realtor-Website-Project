import React, { useState, useMemo } from 'react';
import { FlatList, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '@/theme';
import { LeadStatus } from '@/types';
import { triggerHaptic } from '@/utils';
import { EmptyState } from '@/components/ui';
import { useLeadStore } from '@/store/useLeadStore';
import { NotificationService } from '@/services/notificationService';

import { LeadPipelineHeader } from '@/features/leads/LeadPipelineHeader';
import { LeadCard } from '@/features/leads/LeadCard';

export default function LeadsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<LeadStatus | 'ALL'>('ALL');
  const [refreshing, setRefreshing] = useState(false);

  const leads = useLeadStore((state) => state.leads);
  const addLead = useLeadStore((state) => state.addLead);

  const filteredLeads = useMemo(() => {
    let list = leads;

    if (selectedFilter !== 'ALL') {
      list = list.filter((l) => l.status === selectedFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (l) =>
          l.clientName.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          l.phone.includes(q) ||
          (l.propertyAddress && l.propertyAddress.toLowerCase().includes(q)) ||
          (l.message && l.message.toLowerCase().includes(q))
      );
    }

    return list;
  }, [leads, searchQuery, selectedFilter]);

  const handleRefresh = async () => {
    triggerHaptic.medium();
    setRefreshing(true);
    // Simulate real-time website lead fetch & pull to refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  };

  const handleSimulateNewWebsiteLead = () => {
    triggerHaptic.medium();
    const newLeadName = 'Samantha Miller';
    const newLeadAddress = '250 King St W, Suite 1204, Toronto';
    
    addLead({
      clientName: newLeadName,
      email: 'samantha.m@designco.ca',
      phone: '+1 (416) 555-9012',
      propertyAddress: newLeadAddress,
      mlsNumber: 'C8991204',
      message: 'Requesting urgent private showing for King St West condo tonight at 6:30 PM.',
      inquiryType: 'REQUEST_SHOWING',
      status: 'NEW',
      timestamp: 'Just now',
    });

    NotificationService.triggerLeadAlertNotification(newLeadName, newLeadAddress);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      {/* Search Bar & Status Filter */}
      <LeadPipelineHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedStage={selectedFilter}
        onSelectStage={setSelectedFilter}
      />

      {/* Lead Inbox Cards */}
      <FlatList
        data={filteredLeads}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <LeadCard lead={item} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="📥"
            title="Lead Inbox Empty"
            description="No website lead inquiries match your current filter or search criteria."
            primaryActionLabel="Simulate Website Lead Alert"
            onPrimaryAction={handleSimulateNewWebsiteLead}
          />
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
  listContent: {
    paddingHorizontal: 18,
    paddingTop: Spacing.sm,
    paddingBottom: 110,
  },
});
