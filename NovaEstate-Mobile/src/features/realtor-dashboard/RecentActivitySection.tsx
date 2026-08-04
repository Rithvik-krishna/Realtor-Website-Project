import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { GlassCard } from '@/components/ui/GlassCard';
import { Colors, Spacing, BorderRadius } from '@/theme';
import { normalizeFont } from '@/utils';

const ACTIVITIES = [
  {
    id: '1',
    user: 'Alexander Wright',
    action: 'saved property',
    target: '188 Yorkville Ave PH1',
    time: '12 mins ago',
  },
  {
    id: '2',
    user: 'Sophia Vance',
    action: 'requested a showing for',
    target: '45 Forest Hill Rd',
    time: '45 mins ago',
  },
  {
    id: '3',
    user: 'Nova AI Agent',
    action: 'generated CMA valuation for',
    target: '22 Bridle Path',
    time: '2 hours ago',
  },
];

export function RecentActivitySection() {
  return (
    <Animated.View entering={FadeInDown.duration(400).delay(450)} style={styles.container}>
      <Text style={styles.sectionTitle}>RECENT ACTIVITY STREAM</Text>

      <GlassCard style={styles.card}>
        {ACTIVITIES.map((act, index) => (
          <View key={act.id}>
            <View style={styles.itemRow}>
              <View style={styles.bullet} />
              <View style={styles.textCol}>
                <Text style={styles.activityText}>
                  <Text style={styles.boldUser}>{act.user}</Text> {act.action}{' '}
                  <Text style={styles.boldTarget}>{act.target}</Text>
                </Text>
                <Text style={styles.timeText}>{act.time}</Text>
              </View>
            </View>
            {index < ACTIVITIES.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </GlassCard>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: normalizeFont(11),
    color: Colors.textSecondary,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
    paddingHorizontal: 2,
  },
  card: {
    width: '100%',
    padding: 16,
    borderRadius: BorderRadius.md,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 6,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginTop: 6,
    marginRight: 10,
  },
  textCol: {
    flex: 1,
  },
  activityText: {
    fontSize: normalizeFont(12),
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  boldUser: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  boldTarget: {
    color: Colors.textGold,
    fontWeight: '600',
  },
  timeText: {
    fontSize: normalizeFont(10),
    color: Colors.textMuted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderGlass,
    marginVertical: 6,
  },
});

export default RecentActivitySection;

