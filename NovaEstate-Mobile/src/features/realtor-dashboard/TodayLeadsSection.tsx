import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Dimensions } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Colors, Spacing, BorderRadius } from '@/theme';
import { Lead } from '@/types';
import { formatCurrency, triggerHaptic, normalizeFont } from '@/utils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = Math.min(SCREEN_WIDTH * 0.75, 290);

interface TodayLeadsProps {
  leads: Lead[];
}

export function TodayLeadsSection({ leads }: TodayLeadsProps) {
  const router = useRouter();

  const handleCall = (phone: string) => {
    triggerHaptic.light();
    Linking.openURL(`tel:${phone}`);
  };

  const handleLeadPress = (id: string) => {
    triggerHaptic.light();
    router.push(`/client/${id}` as any);
  };

  return (
    <Animated.View entering={FadeInDown.duration(400).delay(300)} style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>TODAY'S HIGH-PRIORITY LEADS</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/leads' as any)}>
          <Text style={styles.viewAllText}>View Pipeline →</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {leads.map((lead) => (
          <GlassCard key={lead.id} style={styles.leadCard} onPress={() => handleLeadPress(lead.id)}>
            <View style={styles.cardHeader}>
              <Text style={styles.clientName} numberOfLines={1}>
                {lead.clientName}
              </Text>
              <Badge
                label={lead.status}
                variant={lead.status === 'NEW' ? 'gold' : 'muted'}
              />
            </View>

            <Text style={styles.budgetText} numberOfLines={1}>
              {lead.propertyAddress ? `📍 ${lead.propertyAddress}` : `Inquiry: ${lead.inquiryType}`}
            </Text>

            <View style={styles.cityRow}>
              <Text style={styles.cityText} numberOfLines={2}>
                {lead.message || (lead.preferredCities ? `Preferred: ${lead.preferredCities.join(', ')}` : 'Website lead')}
              </Text>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.callBtn} onPress={() => handleCall(lead.phone)}>
                <Text style={styles.callBtnText}>📞 Call Client</Text>
              </TouchableOpacity>
            </View>
          </GlassCard>
        ))}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: Spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: normalizeFont(11),
    color: Colors.textSecondary,
    fontWeight: '700',
    letterSpacing: 1,
  },
  viewAllText: {
    fontSize: normalizeFont(11),
    color: Colors.primary,
    fontWeight: '600',
  },
  scrollContent: {
    paddingRight: 16,
  },
  leadCard: {
    width: CARD_WIDTH,
    marginRight: 12,
    padding: 16,
    borderRadius: BorderRadius.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    gap: 6,
  },
  clientName: {
    flex: 1,
    fontSize: normalizeFont(14),
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  budgetText: {
    fontSize: normalizeFont(12),
    color: Colors.textGold,
    fontWeight: '600',
    marginTop: 2,
  },
  cityRow: {
    marginTop: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  cityText: {
    fontSize: normalizeFont(11),
    color: Colors.textMuted,
    lineHeight: 16,
  },
  actionRow: {
    marginTop: Spacing.xs,
  },
  callBtn: {
    backgroundColor: Colors.cardHover,
    paddingVertical: 8,
    borderRadius: BorderRadius.xs,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  callBtnText: {
    fontSize: normalizeFont(11),
    color: Colors.textPrimary,
    fontWeight: '600',
  },
});

export default TodayLeadsSection;

