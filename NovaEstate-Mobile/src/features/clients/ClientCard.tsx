import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { GlassCard } from '@/components/ui/GlassCard';
import { Colors, BorderRadius } from '@/theme';
import { Client } from '@/types';
import { formatCurrency, triggerHaptic, normalizeFont } from '@/utils';

interface ClientCardProps {
  client: Client;
  onPress: () => void;
}

export function ClientCard({ client, onPress }: ClientCardProps) {
  const [isVip, setIsVip] = useState(client.isVip || false);

  const toggleVip = () => {
    triggerHaptic.light();
    setIsVip(!isVip);
  };

  const handleCall = () => {
    triggerHaptic.light();
    Linking.openURL(`tel:${client.phone}`);
  };

  const handleEmail = () => {
    triggerHaptic.light();
    Linking.openURL(`mailto:${client.email}`);
  };

  const handleWhatsApp = () => {
    triggerHaptic.medium();
    const cleanPhone = client.phone.replace(/[^0-9]/g, '');
    Linking.openURL(`https://wa.me/${cleanPhone}`);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <GlassCard style={styles.card} onPress={onPress}>
      <View style={styles.cardTop}>
        {/* Avatar Circle */}
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{getInitials(client.name)}</Text>
        </View>

        {/* Info Column */}
        <View style={styles.infoCol}>
          <View style={styles.nameRow}>
            <Text style={styles.clientName} numberOfLines={1}>{client.name}</Text>
            <TouchableOpacity onPress={toggleVip} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.starIcon}>{isVip ? '⭐ VIP' : '☆'}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.emailText} numberOfLines={1}>{client.email}</Text>
          <Text style={styles.budgetText}>
            Max Budget: {formatCurrency(client.budgetMax)}
          </Text>
        </View>
      </View>

      {/* Buying / Selling Status Row */}
      <View style={styles.statusRow}>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>🟢 ACTIVE BUYER</Text>
        </View>
        <View style={styles.mortgageBadge}>
          <Text style={styles.mortgageText}>🏦 PRE-APPROVED</Text>
        </View>
      </View>

      {/* Preferences Footer */}
      <View style={styles.prefRow}>
        <Text style={styles.prefText} numberOfLines={1}>
          Target: {client.preferredCities.join(', ')}
        </Text>
      </View>

      {/* Quick Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={handleCall} activeOpacity={0.8}>
          <Text style={styles.actionIcon}>📞 Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={handleEmail} activeOpacity={0.8}>
          <Text style={styles.actionIcon}>✉️ Email</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.waBtn]} onPress={handleWhatsApp} activeOpacity={0.8}>
          <Text style={styles.waText}>💬 WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: BorderRadius.md,
    marginBottom: 12,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderActive,
  },
  avatarText: {
    fontSize: normalizeFont(14),
    color: Colors.primaryLight,
    fontWeight: '800',
  },
  infoCol: {
    flex: 1,
    marginLeft: 12,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clientName: {
    flex: 1,
    fontSize: normalizeFont(15),
    color: Colors.textPrimary,
    fontWeight: '700',
    marginRight: 6,
  },
  starIcon: {
    fontSize: normalizeFont(11),
    color: Colors.textGold,
    fontWeight: '700',
  },
  emailText: {
    fontSize: normalizeFont(11),
    color: Colors.textSecondary,
    marginTop: 1,
  },
  budgetText: {
    fontSize: normalizeFont(11),
    color: Colors.textGold,
    fontWeight: '600',
    marginTop: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  statusBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.xs,
  },
  statusText: {
    fontSize: normalizeFont(9),
    color: Colors.success,
    fontWeight: '800',
  },
  mortgageBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.xs,
  },
  mortgageText: {
    fontSize: normalizeFont(9),
    color: Colors.info,
    fontWeight: '800',
  },
  prefRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.borderGlass,
  },
  prefText: {
    fontSize: normalizeFont(10),
    color: Colors.textMuted,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 10,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: Colors.cardHover,
    paddingVertical: 8,
    borderRadius: BorderRadius.xs,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  actionIcon: {
    fontSize: normalizeFont(11),
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  waBtn: {
    backgroundColor: 'rgba(37, 211, 102, 0.15)',
    borderColor: 'rgba(37, 211, 102, 0.4)',
  },
  waText: {
    fontSize: normalizeFont(11),
    color: '#25D366',
    fontWeight: '700',
  },
});

export default ClientCard;

