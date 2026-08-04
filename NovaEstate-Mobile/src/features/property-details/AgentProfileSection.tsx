/**
 * Property Details - Listing Brokerage & TRREB Member Dossier
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Image } from 'expo-image';
import { GlassCard } from '@/components/ui/GlassCard';
import { Colors, Spacing, Typography, BorderRadius } from '@/theme';
import { triggerHaptic } from '@/utils';

interface AgentProfileProps {
  listOfficeName?: string;
  mlsNumber?: string;
}

export function AgentProfileSection({ listOfficeName, mlsNumber }: AgentProfileProps) {
  const brokerage = listOfficeName || 'TRREB Member Brokerage';
  const mlsId = mlsNumber || 'MLS® Official';

  const agent = {
    name: 'Official TRREB Listing Member',
    brokerage: brokerage,
    license: `TRREB MLS® #${mlsId}`,
    phone: '+1 (416) 555-0199',
    email: 'inquiries@novaestate.ca',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400',
  };

  const handleCall = () => {
    triggerHaptic.light();
    Linking.openURL(`tel:${agent.phone}`);
  };

  const handleEmail = () => {
    triggerHaptic.light();
    Linking.openURL(`mailto:${agent.email}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>LISTING BROKERAGE & MEMBER DOSSIER</Text>

      <GlassCard style={styles.card}>
        <View style={styles.agentRow}>
          <Image source={{ uri: agent.avatar }} style={styles.avatar} contentFit="cover" />
          <View style={styles.infoCol}>
            <Text style={styles.agentName}>{agent.name}</Text>
            <Text style={styles.brokerageText}>{agent.brokerage}</Text>
            <Text style={styles.licenseText}>{agent.license}</Text>
          </View>
        </View>

        <View style={styles.contactRow}>
          <TouchableOpacity style={styles.contactBtn} onPress={handleCall}>
            <Text style={styles.contactBtnText}>📞 Call Brokerage</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.contactBtn, styles.emailBtn]} onPress={handleEmail}>
            <Text style={styles.contactBtnText}>✉️ Email Brokerage</Text>
          </TouchableOpacity>
        </View>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.xxl,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textSecondary,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  card: {
    padding: Spacing.md,
  },
  agentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: Colors.borderActive,
  },
  infoCol: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  agentName: {
    fontSize: Typography.fontSizes.md,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  brokerageText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.primaryLight,
    marginTop: 1,
    fontWeight: '600',
  },
  licenseText: {
    fontSize: Typography.fontSizes.xs - 1,
    color: Colors.textMuted,
    marginTop: 1,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contactBtn: {
    flex: 1,
    backgroundColor: Colors.cardHover,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xs,
    alignItems: 'center',
    marginRight: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  emailBtn: {
    marginRight: 0,
    marginLeft: Spacing.xs,
  },
  contactBtnText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
});

export default AgentProfileSection;

