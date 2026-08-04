/**
 * NovaEstate Mobile - Appointment Details & Schedule View
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, FlatList, RefreshControl } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Spacing, Typography } from '@/theme';
import { useAppointmentsQuery } from '@/hooks';
import { triggerHaptic } from '@/utils';

import { AppointmentCalendarHeader } from '@/features/appointments/AppointmentCalendarHeader';
import { AppointmentCard } from '@/features/appointments/AppointmentCard';

export default function AppointmentDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState('2026-07-29');

  const { data: response, isLoading, refetch, isRefetching } = useAppointmentsQuery();
  const appointments = response?.data || [];

  const handleRefresh = async () => {
    triggerHaptic.medium();
    await refetch();
  };

  const handleReschedule = (apptId: string) => {
    triggerHaptic.light();
    alert(`Reschedule requested for showing #${apptId}. Client notification sent.`);
  };

  const handleCancel = (apptId: string) => {
    triggerHaptic.light();
    alert(`Showing #${apptId} cancelled.`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 1. Day Strip Calendar */}
      <AppointmentCalendarHeader selectedDate={selectedDate} onSelectDate={setSelectedDate} />

      {/* 2. Today's Appointments List */}
      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <AppointmentCard
            appointment={item}
            onPress={() => {}}
            onReschedule={handleReschedule}
            onCancel={handleCancel}
          />
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
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No appointments scheduled for this date.</Text>
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
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xs,
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
