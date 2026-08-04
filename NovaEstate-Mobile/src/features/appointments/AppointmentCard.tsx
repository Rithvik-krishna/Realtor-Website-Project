/**
 * Appointment Management - Showing & Client Meeting Card
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { GlassCard } from '@/components/ui/GlassCard';
import { Colors, Spacing, Typography, BorderRadius } from '@/theme';
import { ShowingAppointment } from '@/types';
import { formatDate, triggerHaptic } from '@/utils';

interface AppointmentCardProps {
  appointment: ShowingAppointment;
  onPress: () => void;
  onReschedule: (id: string) => void;
  onCancel: (id: string) => void;
}

export function AppointmentCard({ appointment, onPress, onReschedule, onCancel }: AppointmentCardProps) {
  const handleCall = () => {
    triggerHaptic.light();
    Linking.openURL(`tel:${appointment.clientPhone}`);
  };

  return (
    <GlassCard style={styles.card} onPress={onPress}>
      {/* Time & Client Header */}
      <View style={styles.topRow}>
        <View style={styles.timeBox}>
          <Text style={styles.timeText}>11:00 AM</Text>
          <Text style={styles.dateText}>{formatDate(appointment.appointmentDate)}</Text>
        </View>

        <View style={styles.clientCol}>
          <Text style={styles.clientName}>{appointment.clientName}</Text>
          <Text style={styles.propertyAddress}>188 Yorkville Ave PH1, Toronto</Text>
        </View>
      </View>

      {/* Status & Duration Bar */}
      <View style={styles.infoBar}>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{appointment.status}</Text>
        </View>
        <Text style={styles.durationText}>⏱️ {appointment.durationMinutes} mins tour</Text>
        <Text style={styles.syncText}>📅 Google Calendar Synced</Text>
      </View>

      {/* Action Footer */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.callBtn} onPress={handleCall}>
          <Text style={styles.btnText}>📞 Call Client</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={() => onReschedule(appointment.id)}>
          <Text style={styles.btnText}>Reschedule</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionBtn, styles.cancelBtn]} onPress={() => onCancel(appointment.id)}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeBox: {
    paddingRight: Spacing.md,
    borderRightWidth: 1,
    borderRightColor: Colors.borderGlass,
    alignItems: 'center',
  },
  timeText: {
    fontSize: Typography.fontSizes.md,
    color: Colors.textGold,
    fontWeight: '700',
  },
  dateText: {
    fontSize: Typography.fontSizes.xs - 2,
    color: Colors.textMuted,
    marginTop: 2,
  },
  clientCol: {
    flex: 1,
    paddingLeft: Spacing.md,
  },
  clientName: {
    fontSize: Typography.fontSizes.md,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  propertyAddress: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  infoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  statusBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: Spacing.xs + 2,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  statusText: {
    fontSize: Typography.fontSizes.xs - 2,
    color: Colors.success,
    fontWeight: '700',
  },
  durationText: {
    fontSize: Typography.fontSizes.xs - 2,
    color: Colors.textSecondary,
  },
  syncText: {
    fontSize: Typography.fontSizes.xs - 2,
    color: Colors.primaryLight,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
  },
  callBtn: {
    backgroundColor: Colors.cardHover,
    paddingVertical: 6,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  actionBtn: {
    backgroundColor: Colors.cardHover,
    paddingVertical: 6,
    paddingHorizontal: Spacing.sm + 2,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  cancelBtn: {
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  btnText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  cancelText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.danger,
    fontWeight: '600',
  },
});

export default AppointmentCard;
