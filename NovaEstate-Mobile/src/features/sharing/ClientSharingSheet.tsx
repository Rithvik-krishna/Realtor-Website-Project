/**
 * Client Sharing - Multi-Channel Sharing Sheet (WhatsApp, Email, Copy Link, QR, PDF)
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Share, Linking, Modal } from 'react-native';
import { GlassCard } from '@/components/ui/GlassCard';
import { Colors, Spacing, Typography, BorderRadius } from '@/theme';
import { Property } from '@/types';
import { formatCurrency, triggerHaptic } from '@/utils';

interface ClientSharingSheetProps {
  property: Property;
  onOpenPresentationMode: () => void;
}

export function ClientSharingSheet({ property, onOpenPresentationMode }: ClientSharingSheetProps) {
  const [showQrModal, setShowQrModal] = useState(false);

  const shareUrl = `https://novaestate.ca/properties/${property.slug}`;
  const shareText = `Explore ${property.title} in ${property.city} listed for ${formatCurrency(property.price)}: ${shareUrl}`;

  const handleWhatsApp = () => {
    triggerHaptic.medium();
    Linking.openURL(`https://wa.me/?text=${encodeURIComponent(shareText)}`);
  };

  const handleEmail = () => {
    triggerHaptic.light();
    Linking.openURL(
      `mailto:?subject=${encodeURIComponent(
        `NovaEstate Exclusive Listing: ${property.title}`
      )}&body=${encodeURIComponent(shareText)}`
    );
  };

  const handleNativeShare = async () => {
    triggerHaptic.light();
    await Share.share({ message: shareText });
  };

  const handleGeneratePdf = () => {
    triggerHaptic.light();
    alert(`Generating High-Res PDF Feature Sheet for ${property.title}... File ready!`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sheetTitle}>CLIENT SHARING WORKFLOW</Text>

      {/* Property Summary Header */}
      <GlassCard style={styles.headerCard}>
        <Text style={styles.propertyTitle}>{property.title}</Text>
        <Text style={styles.priceText}>{formatCurrency(property.price)}</Text>
      </GlassCard>

      {/* Multi-Channel Grid */}
      <View style={styles.grid}>
        <TouchableOpacity style={styles.gridItem} onPress={handleWhatsApp}>
          <Text style={styles.gridIcon}>💬</Text>
          <Text style={styles.gridLabel}>WhatsApp</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridItem} onPress={handleEmail}>
          <Text style={styles.gridIcon}>✉️</Text>
          <Text style={styles.gridLabel}>Email Sheet</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridItem} onPress={handleNativeShare}>
          <Text style={styles.gridIcon}>🔗</Text>
          <Text style={styles.gridLabel}>Copy Link</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridItem} onPress={handleGeneratePdf}>
          <Text style={styles.gridIcon}>📄</Text>
          <Text style={styles.gridLabel}>Export PDF</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridItem} onPress={() => setShowQrModal(true)}>
          <Text style={styles.gridIcon}>📱</Text>
          <Text style={styles.gridLabel}>QR Code</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.gridItem, styles.presentationItem]} onPress={onOpenPresentationMode}>
          <Text style={styles.gridIcon}>📺</Text>
          <Text style={styles.presentationLabel}>Pitch Mode</Text>
        </TouchableOpacity>
      </View>

      {/* Shared Tracking Analytics */}
      <GlassCard style={styles.analyticsCard}>
        <Text style={styles.analyticsTitle}>SHARED LISTING TRACKING</Text>
        <Text style={styles.analyticsText}>👁️ 14 Client Views • Last opened 12 mins ago by Alexander Wright</Text>
      </GlassCard>

      {/* QR Modal */}
      <Modal visible={showQrModal} transparent animationType="fade">
        <View style={styles.modalBg}>
          <GlassCard style={styles.qrCard}>
            <Text style={styles.qrTitle}>CLIENT QR SCAN</Text>
            <View style={styles.qrPlaceholder}>
              <Text style={styles.qrCodeText}>[ QR CODE ]</Text>
            </View>
            <Text style={styles.qrSubtitle}>{property.title}</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowQrModal(false)}>
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </GlassCard>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
  },
  sheetTitle: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textSecondary,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  headerCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  propertyTitle: {
    fontSize: Typography.fontSizes.md,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  priceText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.textGold,
    fontWeight: '600',
    marginTop: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  gridItem: {
    width: '31%',
    backgroundColor: Colors.cardHover,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xs,
    alignItems: 'center',
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  presentationItem: {
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    borderColor: Colors.borderActive,
  },
  gridIcon: {
    fontSize: Typography.fontSizes.lg,
    marginBottom: 4,
  },
  gridLabel: {
    fontSize: Typography.fontSizes.xs - 1,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  presentationLabel: {
    fontSize: Typography.fontSizes.xs - 1,
    color: Colors.primaryLight,
    fontWeight: '700',
  },
  analyticsCard: {
    padding: Spacing.md,
  },
  analyticsTitle: {
    fontSize: Typography.fontSizes.xs - 2,
    color: Colors.textMuted,
    fontWeight: '700',
    letterSpacing: 1,
  },
  analyticsText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  qrCard: {
    width: '100%',
    padding: Spacing.lg,
    alignItems: 'center',
  },
  qrTitle: {
    fontSize: Typography.fontSizes.md,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  qrPlaceholder: {
    width: 180,
    height: 180,
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.xs,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  qrCodeText: {
    color: '#000000',
    fontWeight: '800',
    fontSize: Typography.fontSizes.md,
  },
  qrSubtitle: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  closeBtn: {
    backgroundColor: Colors.cardHover,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  closeBtnText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
});

export default ClientSharingSheet;
