/**
 * NovaEstate Mobile - Schedule New Showing / Client Visit
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { GlassCard } from '@/components/ui/GlassCard';
import { GoldButton } from '@/components/ui/GoldButton';
import { Colors, Spacing, Typography, BorderRadius } from '@/theme';
import { useBookShowingMutation } from '@/hooks';
import { triggerHaptic } from '@/utils';

export default function NewAppointmentScreen() {
  const router = useRouter();
  const [clientName, setClientName] = useState('Alexander Wright');
  const [clientPhone, setClientPhone] = useState('+1 (416) 555-0192');
  const [propertyAddress, setPropertyAddress] = useState('188 Yorkville Ave PH1, Toronto');
  const [appointmentDate, setAppointmentDate] = useState('2026-07-30T11:00:00Z');
  const [durationMinutes, setDurationMinutes] = useState('45');
  const [syncGoogleCalendar, setSyncGoogleCalendar] = useState(true);

  const bookShowingMutation = useBookShowingMutation();

  const handleBookShowing = async () => {
    triggerHaptic.medium();
    await bookShowingMutation.mutateAsync({
      propertyId: 'prop-1',
      appointmentDate,
      notes: `Client: ${clientName} (${clientPhone}) - ${propertyAddress}`,
    });
    alert('Showing appointment scheduled & synced with Google Calendar!');
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>SCHEDULE NEW SHOWING / VISIT</Text>

        <GlassCard style={styles.card}>
          <Text style={styles.inputLabel}>CLIENT NAME</Text>
          <TextInput value={clientName} onChangeText={setClientName} style={styles.input} />

          <Text style={styles.inputLabel}>CLIENT PHONE NUMBER</Text>
          <TextInput value={clientPhone} onChangeText={setClientPhone} style={styles.input} keyboardType="phone-pad" />

          <Text style={styles.inputLabel}>PROPERTY ADDRESS</Text>
          <TextInput value={propertyAddress} onChangeText={setPropertyAddress} style={styles.input} />

          <Text style={styles.inputLabel}>SHOWING DURATION (MINUTES)</Text>
          <TextInput value={durationMinutes} onChangeText={setDurationMinutes} style={styles.input} keyboardType="numeric" />

          <View style={styles.switchRow}>
            <View style={styles.switchTextCol}>
              <Text style={styles.switchTitle}>Sync to Google Calendar</Text>
              <Text style={styles.switchSub}>Sends automatic invite & Google Meet link</Text>
            </View>
            <Switch
              value={syncGoogleCalendar}
              onValueChange={setSyncGoogleCalendar}
              trackColor={{ false: Colors.cardHover, true: Colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.btnRow}>
            <GoldButton
              title="Confirm Showing Appointment"
              onPress={handleBookShowing}
              loading={bookShowingMutation.isPending}
            />
          </View>
        </GlassCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.md,
  },
  headerTitle: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textSecondary,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  card: {
    padding: Spacing.md,
  },
  inputLabel: {
    fontSize: Typography.fontSizes.xs - 2,
    color: Colors.textMuted,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
    marginTop: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.cardHover,
    borderRadius: BorderRadius.xs,
    paddingHorizontal: Spacing.md,
    height: 44,
    color: Colors.textPrimary,
    fontSize: Typography.fontSizes.sm,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.lg,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderGlass,
  },
  switchTextCol: {
    flex: 1,
    paddingRight: Spacing.md,
  },
  switchTitle: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  switchSub: {
    fontSize: Typography.fontSizes.xs - 1,
    color: Colors.textMuted,
    marginTop: 2,
  },
  btnRow: {
    marginTop: Spacing.xl,
  },
});
