import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Platform } from 'react-native';
import { GlassCard } from '@/components/ui/GlassCard';
import { Colors, BorderRadius } from '@/theme';
import { Lead } from '@/types';
import { triggerHaptic, normalizeFont } from '@/utils';
import { useLeadStore } from '@/store/useLeadStore';

interface LeadCardProps {
  lead: Lead;
}

export function LeadCard({ lead }: LeadCardProps) {
  const toggleContactedStatus = useLeadStore((s) => s.toggleContactedStatus);

  const handleCall = (e: any) => {
    e.stopPropagation?.();
    triggerHaptic.light();
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.alert(`📞 Calling ${lead.clientName}\nDirect Phone: ${lead.phone}`);
      return;
    }
    Linking.openURL(`tel:${lead.phone}`);
  };

  const handleSMS = (e: any) => {
    e.stopPropagation?.();
    triggerHaptic.light();
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.alert(`💬 SMS to ${lead.clientName}\nMobile: ${lead.phone}`);
      return;
    }
    Linking.openURL(`sms:${lead.phone.replace(/[^0-9+]/g, '')}`);
  };

  const handleEmail = (e: any) => {
    e.stopPropagation?.();
    triggerHaptic.light();
    const mailUrl = `mailto:${lead.email}?subject=Re: Website Inquiry for ${encodeURIComponent(lead.propertyAddress || 'Property')}`;
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.location.href = mailUrl;
      return;
    }
    Linking.openURL(mailUrl);
  };

  const handleToggleContacted = (e: any) => {
    e.stopPropagation?.();
    triggerHaptic.medium();
    toggleContactedStatus(lead.id);
  };

  const getInquiryBadgeConfig = () => {
    switch (lead.inquiryType) {
      case 'REQUEST_SHOWING':
        return { label: '📅 REQUEST SHOWING', color: Colors.primary, bg: 'rgba(212, 175, 55, 0.15)' };
      case 'ASK_QUESTION':
        return { label: '❓ ASK QUESTION', color: '#60A5FA', bg: 'rgba(96, 165, 250, 0.15)' };
      case 'CONTACT_AGENT':
        return { label: '📞 CONTACT AGENT', color: Colors.success, bg: 'rgba(16, 185, 129, 0.15)' };
      case 'SAVED_SEARCH':
        return { label: '🔎 SAVED SEARCH', color: '#A78BFA', bg: 'rgba(167, 139, 250, 0.15)' };
      default:
        return { label: '⚡ WEBSITE INQUIRY', color: Colors.textGold, bg: 'rgba(212, 175, 55, 0.15)' };
    }
  };

  const badge = getInquiryBadgeConfig();
  const isContacted = lead.status === 'CONTACTED';

  return (
    <GlassCard style={[styles.card, isContacted && styles.contactedCard]}>
      {/* Top Header Row */}
      <View style={styles.cardHeader}>
        <View style={styles.nameCol}>
          <View style={styles.nameRow}>
            <Text style={styles.clientName} numberOfLines={1}>{lead.clientName}</Text>
            <View style={[styles.inquiryBadge, { backgroundColor: badge.bg, borderColor: badge.color }]}>
              <Text style={[styles.inquiryBadgeText, { color: badge.color }]}>{badge.label}</Text>
            </View>
          </View>
          <Text style={styles.timestampText}>🕒 {lead.timestamp}</Text>
        </View>

        {/* Contacted Status Pill */}
        <View style={[styles.statusPill, isContacted ? styles.statusContacted : styles.statusNew]}>
          <Text style={[styles.statusText, isContacted ? styles.textContacted : styles.textNew]}>
            {isContacted ? '✓ CONTACTED' : '🔴 NEW'}
          </Text>
        </View>
      </View>

      {/* Property Address & Contact Information */}
      {lead.propertyAddress && (
        <Text style={styles.propertyAddressText} numberOfLines={1}>
          📍 {lead.propertyAddress} {lead.mlsNumber ? `(MLS® #${lead.mlsNumber})` : ''}
        </Text>
      )}

      <Text style={styles.contactDetailsText} numberOfLines={1}>
        📞 {lead.phone}  •  ✉️ {lead.email}
      </Text>

      {/* Message Text */}
      {lead.message && (
        <View style={styles.messageBox}>
          <Text style={styles.messageText}>"{lead.message}"</Text>
        </View>
      )}

      {/* Speed-to-Lead One-Tap Action Bar */}
      <View style={styles.footerRow}>
        <View style={styles.oneTapGroup}>
          <TouchableOpacity style={styles.actionIconBtn} onPress={handleCall} activeOpacity={0.8}>
            <Text style={styles.btnIcon}>📞 Call</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionIconBtn} onPress={handleSMS} activeOpacity={0.8}>
            <Text style={styles.btnIcon}>💬 SMS</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionIconBtn} onPress={handleEmail} activeOpacity={0.8}>
            <Text style={styles.btnIcon}>✉️ Email</Text>
          </TouchableOpacity>
        </View>

        {/* Mark as Contacted Button */}
        <TouchableOpacity
          style={[styles.markContactedBtn, isContacted && styles.markContactedBtnDone]}
          onPress={handleToggleContacted}
          activeOpacity={0.8}
        >
          <Text style={[styles.markContactedText, isContacted && styles.markContactedTextDone]}>
            {isContacted ? '✓ Contacted' : 'Mark Contacted'}
          </Text>
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
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  contactedCard: {
    opacity: 0.85,
    backgroundColor: 'rgba(11, 13, 18, 0.6)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  nameCol: {
    flex: 1,
    marginRight: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  clientName: {
    fontSize: normalizeFont(16),
    color: Colors.textPrimary,
    fontWeight: '800',
  },
  inquiryBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
  },
  inquiryBadgeText: {
    fontSize: normalizeFont(8),
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  timestampText: {
    fontSize: normalizeFont(10),
    color: Colors.textMuted,
    marginTop: 2,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
  },
  statusNew: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: Colors.danger,
  },
  statusContacted: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: Colors.success,
  },
  statusText: {
    fontSize: normalizeFont(9),
    fontWeight: '800',
  },
  textNew: {
    color: Colors.danger,
  },
  textContacted: {
    color: Colors.success,
  },
  propertyAddressText: {
    fontSize: normalizeFont(12),
    color: Colors.textGold,
    fontWeight: '700',
    marginBottom: 4,
  },
  contactDetailsText: {
    fontSize: normalizeFont(11),
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  messageBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    padding: 10,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    marginBottom: 10,
  },
  messageText: {
    fontSize: normalizeFont(11),
    color: Colors.textPrimary,
    fontStyle: 'italic',
    lineHeight: 16,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.borderGlass,
    gap: 8,
  },
  oneTapGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  actionIconBtn: {
    backgroundColor: Colors.cardHover,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  btnIcon: {
    fontSize: normalizeFont(10),
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  markContactedBtn: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  markContactedBtnDone: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: Colors.borderGlass,
  },
  markContactedText: {
    fontSize: normalizeFont(10),
    color: Colors.success,
    fontWeight: '800',
  },
  markContactedTextDone: {
    color: Colors.textMuted,
    fontWeight: '600',
  },
});

export default LeadCard;
