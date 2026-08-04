import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography } from '@/theme';
import { usePropertyCompareStore } from '@/store';
import { formatCurrency, triggerHaptic } from '@/utils';
import { FastPropertyImage } from '@/components/ui/FastPropertyImage';

interface PropertyCompareModalProps {
  visible: boolean;
  onClose: () => void;
}

export function PropertyCompareModal({ visible, onClose }: PropertyCompareModalProps) {
  const { comparedProperties, removeCompareProperty, clearCompare } = usePropertyCompareStore();

  if (comparedProperties.length === 0) return null;

  const handleRemove = (id: string) => {
    triggerHaptic.light();
    removeCompareProperty(id);
  };

  const handleClearAll = () => {
    triggerHaptic.medium();
    clearCompare();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Property Side-by-Side Comparison</Text>
              <Text style={styles.modalSub}>Comparing {comparedProperties.length} of 4 properties</Text>
            </View>
            <View style={styles.headerRightBtns}>
              <TouchableOpacity onPress={handleClearAll} style={styles.clearBtn}>
                <Text style={styles.clearBtnText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator style={styles.horizontalScroll}>
            <View style={styles.matrixContainer}>
              {/* Properties Headers Row */}
              <View style={styles.rowHeader}>
                <Text style={[styles.fieldLabelCell, styles.headerLabelCell]}>FEATURE / FIELD</Text>
                {comparedProperties.map((p) => (
                  <View key={p.id} style={styles.propertyHeaderCell}>
                    <TouchableOpacity style={styles.removePropBtn} onPress={() => handleRemove(p.id)}>
                      <Text style={styles.removePropText}>✕ Remove</Text>
                    </TouchableOpacity>
                    <FastPropertyImage uri={p.images?.[0] || ''} style={styles.compareImage} />
                    <Text style={styles.propMls} numberOfLines={1}>MLS® #{p.mlsNumber}</Text>
                    <Text style={styles.propTitle} numberOfLines={2}>{p.title}</Text>
                    <Text style={styles.propPrice}>{formatCurrency(p.price)}</Text>
                  </View>
                ))}
              </View>

              {/* Comparison Metric Rows */}
              <View style={styles.dataRow}>
                <Text style={styles.fieldLabelCell}>Bedrooms</Text>
                {comparedProperties.map((p) => (
                  <Text key={p.id} style={styles.fieldValueCell}>{p.bedrooms} Beds</Text>
                ))}
              </View>

              <View style={[styles.dataRow, styles.altRow]}>
                <Text style={styles.fieldLabelCell}>Bathrooms</Text>
                {comparedProperties.map((p) => (
                  <Text key={p.id} style={styles.fieldValueCell}>{p.bathrooms} Baths</Text>
                ))}
              </View>

              <View style={styles.dataRow}>
                <Text style={styles.fieldLabelCell}>Square Footage</Text>
                {comparedProperties.map((p) => (
                  <Text key={p.id} style={styles.fieldValueCell}>{p.sqft ? `${p.sqft.toLocaleString()} sqft` : 'N/A'}</Text>
                ))}
              </View>

              <View style={[styles.dataRow, styles.altRow]}>
                <Text style={styles.fieldLabelCell}>Property Type</Text>
                {comparedProperties.map((p) => (
                  <Text key={p.id} style={styles.fieldValueCell}>{p.propertyType}</Text>
                ))}
              </View>

              <View style={styles.dataRow}>
                <Text style={styles.fieldLabelCell}>Location / City</Text>
                {comparedProperties.map((p) => (
                  <Text key={p.id} style={styles.fieldValueCell}>{p.city}</Text>
                ))}
              </View>

              <View style={[styles.dataRow, styles.altRow]}>
                <Text style={styles.fieldLabelCell}>Days on Market</Text>
                {comparedProperties.map((p) => (
                  <Text key={p.id} style={styles.fieldValueCell}>{p.daysOnMarket || 3} days</Text>
                ))}
              </View>

              <View style={styles.dataRow}>
                <Text style={styles.fieldLabelCell}>Walk Score</Text>
                {comparedProperties.map((p) => (
                  <Text key={p.id} style={styles.fieldValueCell}>⚡ {p.walkScore || 85}/100</Text>
                ))}
              </View>

              <View style={[styles.dataRow, styles.altRow]}>
                <Text style={styles.fieldLabelCell}>Listing Status</Text>
                {comparedProperties.map((p) => (
                  <Text key={p.id} style={[styles.fieldValueCell, { color: Colors.success, fontWeight: '700' }]}>{p.status}</Text>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: Colors.backgroundElevated,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.md,
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.xs,
  },
  modalTitle: {
    fontSize: Typography.fontSizes.md + 2,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  modalSub: {
    fontSize: Typography.fontSizes.xs - 1,
    color: Colors.textGold,
    fontWeight: '600',
  },
  headerRightBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  clearBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    borderColor: Colors.danger,
  },
  clearBtnText: {
    fontSize: 10,
    color: Colors.danger,
    fontWeight: '700',
  },
  closeBtn: {
    padding: Spacing.xs,
  },
  closeBtnText: {
    fontSize: 16,
    color: Colors.textMuted,
  },
  horizontalScroll: {
    marginBottom: Spacing.sm,
  },
  matrixContainer: {
    flexDirection: 'column',
  },
  rowHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: Colors.borderGlass,
    paddingBottom: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  fieldLabelCell: {
    width: 120,
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '700',
    justifyContent: 'center',
    paddingRight: 8,
  },
  headerLabelCell: {
    color: Colors.textGold,
    fontSize: 10,
    letterSpacing: 0.8,
  },
  propertyHeaderCell: {
    width: 140,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  removePropBtn: {
    marginBottom: 4,
  },
  removePropText: {
    fontSize: 9,
    color: Colors.danger,
    fontWeight: '700',
  },
  compareImage: {
    width: 128,
    height: 72,
    borderRadius: BorderRadius.xs,
    marginBottom: 6,
  },
  propMls: {
    fontSize: 9,
    color: Colors.textGold,
    fontWeight: '800',
  },
  propTitle: {
    fontSize: 11,
    color: Colors.textPrimary,
    fontWeight: '700',
    textAlign: 'center',
    height: 28,
  },
  propPrice: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '900',
    marginTop: 2,
  },
  dataRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  altRow: {
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  fieldValueCell: {
    width: 140,
    textAlign: 'center',
    fontSize: 11,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
});
