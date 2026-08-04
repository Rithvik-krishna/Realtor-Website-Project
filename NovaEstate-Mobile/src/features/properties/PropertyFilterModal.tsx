import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Colors, BorderRadius } from '@/theme';
import { normalizeFont } from '@/utils/responsive';
import { triggerHaptic } from '@/utils/haptics';

interface PropertyFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  propertyType: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: string;
  bathrooms: string;
  openHouseOnly: boolean;
}

const PROPERTY_TYPES = ['ALL', 'CONDO', 'DETACHED', 'TOWNHOUSE', 'COMMERCIAL'];
const BEDROOM_OPTIONS = ['ANY', '1+', '2+', '3+', '4+'];
const BATHROOM_OPTIONS = ['ANY', '1+', '2+', '3+'];

export function PropertyFilterModal({ visible, onClose, onApply }: PropertyFilterModalProps) {
  const [propertyType, setPropertyType] = useState('ALL');
  const [bedrooms, setBedrooms] = useState('ANY');
  const [bathrooms, setBathrooms] = useState('ANY');
  const [openHouseOnly, setOpenHouseOnly] = useState(false);

  const handleApply = () => {
    triggerHaptic.medium();
    onApply({
      propertyType,
      minPrice: 0,
      maxPrice: 10000000,
      bedrooms,
      bathrooms,
      openHouseOnly,
    });
    onClose();
  };

  const handleReset = () => {
    triggerHaptic.light();
    setPropertyType('ALL');
    setBedrooms('ANY');
    setBathrooms('ANY');
    setOpenHouseOnly(false);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>MLS Property Filters</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Property Type */}
            <Text style={styles.sectionTitle}>PROPERTY TYPE</Text>
            <View style={styles.chipRow}>
              {PROPERTY_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[styles.chip, propertyType === type && styles.chipActive]}
                  onPress={() => {
                    triggerHaptic.light();
                    setPropertyType(type);
                  }}
                >
                  <Text style={[styles.chipText, propertyType === type && styles.chipTextActive]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Bedrooms */}
            <Text style={styles.sectionTitle}>BEDROOMS</Text>
            <View style={styles.chipRow}>
              {BEDROOM_OPTIONS.map((bed) => (
                <TouchableOpacity
                  key={bed}
                  style={[styles.chip, bedrooms === bed && styles.chipActive]}
                  onPress={() => {
                    triggerHaptic.light();
                    setBedrooms(bed);
                  }}
                >
                  <Text style={[styles.chipText, bedrooms === bed && styles.chipTextActive]}>
                    {bed}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Bathrooms */}
            <Text style={styles.sectionTitle}>BATHROOMS</Text>
            <View style={styles.chipRow}>
              {BATHROOM_OPTIONS.map((bath) => (
                <TouchableOpacity
                  key={bath}
                  style={[styles.chip, bathrooms === bath && styles.chipActive]}
                  onPress={() => {
                    triggerHaptic.light();
                    setBathrooms(bath);
                  }}
                >
                  <Text style={[styles.chipText, bathrooms === bath && styles.chipTextActive]}>
                    {bath}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Open House Toggle */}
            <TouchableOpacity
              style={styles.toggleRow}
              onPress={() => {
                triggerHaptic.light();
                setOpenHouseOnly((prev) => !prev);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.toggleLabel}>Open House Only</Text>
              <View style={[styles.switchTrack, openHouseOnly && styles.switchTrackActive]}>
                <View style={[styles.switchThumb, openHouseOnly && styles.switchThumbActive]} />
              </View>
            </TouchableOpacity>
          </ScrollView>

          {/* Footer Actions */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
              <Text style={styles.resetText}>Reset All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
              <Text style={styles.applyText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.backgroundElevated,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 18,
    paddingHorizontal: 18,
    paddingBottom: 28,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: normalizeFont(17),
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 6,
  },
  closeText: {
    color: Colors.textMuted,
    fontSize: 16,
    fontWeight: '700',
  },
  content: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: normalizeFont(10),
    color: Colors.textGold,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 12,
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: Colors.cardHover,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  chipActive: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: normalizeFont(11),
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  chipTextActive: {
    color: Colors.textGold,
    fontWeight: '800',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.borderGlass,
    marginTop: 16,
  },
  toggleLabel: {
    fontSize: normalizeFont(13),
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  switchTrack: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.cardHover,
    padding: 2,
  },
  switchTrackActive: {
    backgroundColor: Colors.primary,
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.textMuted,
  },
  switchThumbActive: {
    backgroundColor: Colors.background,
    alignSelf: 'flex-end',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.borderGlass,
  },
  resetBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.cardHover,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  resetText: {
    fontSize: normalizeFont(13),
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  applyBtn: {
    flex: 1.5,
    paddingVertical: 12,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  applyText: {
    fontSize: normalizeFont(13),
    color: Colors.background,
    fontWeight: '800',
  },
});

export default PropertyFilterModal;
