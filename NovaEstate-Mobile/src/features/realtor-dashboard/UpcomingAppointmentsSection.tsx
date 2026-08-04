import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { GlassCard } from '@/components/ui/GlassCard';
import { Colors, Spacing, BorderRadius } from '@/theme';
import { ShowingAppointment } from '@/types';
import { formatDate, triggerHaptic, normalizeFont } from '@/utils';

interface AppointmentsProps {
  appointments: ShowingAppointment[];
}

export function UpcomingAppointmentsSection({ appointments }: AppointmentsProps) {
  const router = useRouter();

  const handlePress = (id: string) => {
    triggerHaptic.light();
    router.push(`/appointment/${id}` as any);
  };

  return (
    <Animated.View entering={FadeInDown.duration(400).delay(350)} style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>UPCOMING SHOWINGS & SCHEDULE</Text>
      </View>

      {appointments.slice(0, 2).map((appt) => (
        <GlassCard key={appt.id} style={styles.apptCard} onPress={() => handlePress(appt.id)}>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText} numberOfLines={1}>11:00 AM</Text>
            <Text style={styles.dateText} numberOfLines={1}>{formatDate(appt.appointmentDate)}</Text>
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.clientName} numberOfLines={1}>{appt.clientName}</Text>
            <Text style={styles.propertyAddress} numberOfLines={2}>188 Yorkville Ave PH1, Toronto</Text>
            <View style={styles.badgeRow}>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{appt.status}</Text>
              </View>
              <Text style={styles.durationText}>{appt.durationMinutes} mins</Text>
            </View>
          </View>
        </GlassCard>
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: Spacing.md,
  },
  headerRow: {
    marginBottom: Spacing.sm,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: normalizeFont(11),
    color: Colors.textSecondary,
    fontWeight: '700',
    letterSpacing: 1,
  },
  apptCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  timeContainer: {
    paddingRight: 12,
    borderRightWidth: 1,
    borderRightColor: Colors.borderGlass,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 72,
  },
  timeText: {
    fontSize: normalizeFont(13),
    color: Colors.primaryLight,
    fontWeight: '700',
  },
  dateText: {
    fontSize: normalizeFont(10),
    color: Colors.textMuted,
    marginTop: 2,
  },
  detailsContainer: {
    flex: 1,
    paddingLeft: 12,
  },
  clientName: {
    fontSize: normalizeFont(14),
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  propertyAddress: {
    fontSize: normalizeFont(11),
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  statusBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
    marginRight: 6,
  },
  statusText: {
    fontSize: normalizeFont(9),
    color: Colors.success,
    fontWeight: '700',
  },
  durationText: {
    fontSize: normalizeFont(10),
    color: Colors.textMuted,
  },
});

export default UpcomingAppointmentsSection;

