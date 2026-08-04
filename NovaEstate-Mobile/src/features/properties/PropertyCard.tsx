import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Linking, Platform } from 'react-native';
import { Image } from 'expo-image';
import { GlassCard } from '@/components/ui/GlassCard';
import { Colors, Spacing, BorderRadius } from '@/theme';
import { Property } from '@/types';
import { formatCurrency, triggerHaptic, normalizeFont, getImageUrl } from '@/utils';
import { useSavedPropertiesStore, usePropertyCompareStore, useRecentlyViewedStore } from '@/store';
import { SaveToFolderModal } from './SaveToFolderModal';
import { PropertyNotesModal } from '../property-details/PropertyNotesModal';
import { PDFService } from '@/services/pdfService';

const { width } = Dimensions.get('window');

interface PropertyCardProps {
  property: Property;
  viewMode?: 'list' | 'grid';
  onPress: () => void;
}

export function PropertyCard({ property, viewMode = 'list', onPress }: PropertyCardProps) {
  const { isSaved, removeProperty } = useSavedPropertiesStore();
  const { isPropertyCompared, toggleCompareProperty } = usePropertyCompareStore();
  const addRecentlyViewed = useRecentlyViewedStore((s) => s.addViewedProperty);

  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [notesModalVisible, setNotesModalVisible] = useState(false);
  const [currentImageIndex, setCurrentIndex] = useState(0);

  const isGrid = viewMode === 'grid';
  const cardWidth = isGrid ? (width - 18 * 3) / 2 : width - 18 * 2;
  const saved = isSaved(property.id);
  const compared = isPropertyCompared(property.id);

  const validImages = (property.images || []).map(getImageUrl).filter((url): url is string => Boolean(url));
  const hasImages = validImages.length > 0;
  const currentImageUrl = hasImages ? validImages[Math.min(currentImageIndex, validImages.length - 1)] : null;

  const handleCardPress = () => {
    addRecentlyViewed(property);
    onPress();
  };

  const handleToggleFavorite = (e: any) => {
    e.stopPropagation?.();
    triggerHaptic.light();
    if (saved) {
      removeProperty(property.id);
    } else {
      setSaveModalVisible(true);
    }
  };

  const handleToggleCompare = (e: any) => {
    e.stopPropagation?.();
    triggerHaptic.light();
    toggleCompareProperty(property);
  };

  const handleCallAgent = (e: any) => {
    e.stopPropagation?.();
    triggerHaptic.medium();
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.alert('📞 Karan Homes Listing Agent Phone: +1 (416) 555-0199');
      return;
    }
    Linking.openURL('tel:4165550199');
  };

  const handleEmailAgent = (e: any) => {
    e.stopPropagation?.();
    triggerHaptic.medium();
    const mailUrl = `mailto:agent@karanhomes.ca?subject=Inquiry for MLS ${property.mlsNumber} - ${encodeURIComponent(property.address)}`;
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.location.href = mailUrl;
      return;
    }
    Linking.openURL(mailUrl);
  };

  const handleOpenMaps = (e: any) => {
    e.stopPropagation?.();
    triggerHaptic.medium();
    const query = encodeURIComponent(`${property.address}, ${property.city}, ON`);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.open(mapsUrl, '_blank');
      return;
    }
    Linking.openURL(mapsUrl);
  };

  const handleSharePDF = async (e: any) => {
    e.stopPropagation?.();
    triggerHaptic.medium();
    await PDFService.sharePropertyPDF(property);
  };

  const handleOpenNotes = (e: any) => {
    e.stopPropagation?.();
    triggerHaptic.light();
    setNotesModalVisible(true);
  };

  const handleNextImage = (e: any) => {
    e.stopPropagation?.();
    triggerHaptic.light();
    if (hasImages) {
      setCurrentIndex((prev) => (prev + 1) % validImages.length);
    }
  };

  const handlePrevImage = (e: any) => {
    e.stopPropagation?.();
    triggerHaptic.light();
    if (hasImages) {
      setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
    }
  };

  return (
    <>
      <GlassCard style={[styles.card, { width: cardWidth }]} onPress={handleCardPress}>
        {/* Image & Badges Container */}
        <View style={styles.imageContainer}>
          {hasImages && currentImageUrl ? (
            <Image
              source={{ uri: currentImageUrl }}
              style={[styles.image, { height: isGrid ? 130 : 190 }]}
              contentFit="cover"
              transition={150}
              cachePolicy="memory-disk"
              recyclingKey={`${property.id}-${currentImageIndex}`}
            />
          ) : (
            <View style={[styles.noPhotoContainer, { height: isGrid ? 130 : 190 }]}>
              <Text style={styles.noPhotoIcon}>📷</Text>
              <Text style={styles.noPhotoTitle}>No Photo Available</Text>
              <Text style={styles.noPhotoSubtitle}>Listing photos pending from TRREB MLS®</Text>
            </View>
          )}

          {/* Image Navigation Arrows */}
          {validImages.length > 1 && (
            <>
              <TouchableOpacity style={[styles.cardNavArrow, styles.cardNavLeft]} onPress={handlePrevImage} activeOpacity={0.8}>
                <Text style={styles.cardNavArrowText}>‹</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.cardNavArrow, styles.cardNavRight]} onPress={handleNextImage} activeOpacity={0.8}>
                <Text style={styles.cardNavArrowText}>›</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Photo Count Pill */}
          {validImages.length > 1 && (
            <View style={styles.cardPhotoCount}>
              <Text style={styles.cardPhotoCountText}>{currentImageIndex + 1}/{validImages.length}</Text>
            </View>
          )}{/* Save & Compare Buttons Row */}
          <View style={styles.topRightControls}>
            <TouchableOpacity
              style={[styles.topControlBtn, compared && styles.activeCompareBtn]}
              onPress={handleToggleCompare}
              activeOpacity={0.8}
            >
              <Text style={styles.topControlText}>⚖️</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.topControlBtn, saved && styles.activeSaveBtn]}
              onPress={handleToggleFavorite}
              activeOpacity={0.8}
            >
              <Text style={styles.topControlText}>{saved ? '❤️' : '🤍'}</Text>
            </TouchableOpacity>
          </View>

          {/* Type & Featured Badge Row */}
          <View style={styles.badgeRow}>
            <View style={styles.typeBadge}>
              <Text style={styles.typeText}>{property.propertyType}</Text>
            </View>
            {property.isFeatured && (
              <View style={styles.featuredBadge}>
                <Text style={styles.featuredText}>★ FEATURED</Text>
              </View>
            )}
          </View>
        </View>

        {/* Property Details */}
        <View style={styles.details}>
          <View style={styles.priceRow}>
            <Text style={styles.priceText} numberOfLines={1}>{formatCurrency(property.price)}</Text>
            <Text style={styles.mlsBadge}>MLS® #{property.mlsNumber}</Text>
          </View>
          <Text style={styles.titleText} numberOfLines={1}>{property.title}</Text>
          <Text style={styles.addressText} numberOfLines={1}>📍 {property.address}, {property.city}</Text>

          {/* Specs Row */}
          <View style={styles.specsRow}>
            <Text style={styles.specText}>
              {property.bedrooms} Bed • {property.bathrooms} Bath • {property.sqft} sqft
            </Text>
          </View>

          {/* Realtor Quick Action Toolbar */}
          {!isGrid && (
            <View style={styles.quickActionToolbar}>
              <TouchableOpacity style={styles.actionPill} onPress={handleCallAgent} activeOpacity={0.7}>
                <Text style={styles.actionPillText}>📞 Call</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionPill} onPress={handleEmailAgent} activeOpacity={0.7}>
                <Text style={styles.actionPillText}>✉️ Email</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionPill} onPress={handleOpenMaps} activeOpacity={0.7}>
                <Text style={styles.actionPillText}>🗺️ Maps</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionPill} onPress={handleSharePDF} activeOpacity={0.7}>
                <Text style={styles.actionPillText}>📄 PDF</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionPill, styles.actionPillGold]} onPress={handleOpenNotes} activeOpacity={0.7}>
                <Text style={styles.actionPillGoldText}>📝 Notes</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </GlassCard>

      {/* Modals */}
      <SaveToFolderModal
        visible={saveModalVisible}
        property={property}
        onClose={() => setSaveModalVisible(false)}
      />
      <PropertyNotesModal
        visible={notesModalVisible}
        property={property}
        onClose={() => setNotesModalVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 0,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
  },
  image: {
    width: '100%',
  },
  topRightControls: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    gap: 6,
  },
  topControlBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(7, 8, 10, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  activeSaveBtn: {
    borderColor: Colors.danger,
    backgroundColor: 'rgba(239, 68, 68, 0.25)',
  },
  activeCompareBtn: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(212, 175, 55, 0.25)',
  },
  topControlText: {
    fontSize: 13,
  },
  cardNavArrow: {
    position: 'absolute',
    top: '40%',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(11, 13, 18, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    zIndex: 10,
  },
  cardNavLeft: { left: 6 },
  cardNavRight: { right: 6 },
  cardNavArrowText: {
    fontSize: 20,
    color: Colors.primaryLight,
    fontWeight: '400',
    marginTop: -2,
  },
  cardPhotoCount: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(11, 13, 18, 0.75)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  cardPhotoCountText: {
    fontSize: normalizeFont(9),
    color: Colors.textGold,
    fontWeight: '700',
  },
  badgeRow: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  typeBadge: {
    backgroundColor: 'rgba(7, 8, 10, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  typeText: {
    fontSize: normalizeFont(9),
    color: Colors.primaryLight,
    fontWeight: '700',
  },
  featuredBadge: {
    backgroundColor: 'rgba(212, 175, 55, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  featuredText: {
    fontSize: normalizeFont(9),
    color: Colors.textGold,
    fontWeight: '800',
  },
  details: {
    padding: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: normalizeFont(17),
    color: Colors.textPrimary,
    fontWeight: '800',
  },
  mlsBadge: {
    fontSize: normalizeFont(9),
    color: Colors.textGold,
    fontWeight: '700',
  },
  titleText: {
    fontSize: normalizeFont(13),
    color: Colors.textSecondary,
    marginTop: 2,
    fontWeight: '600',
  },
  addressText: {
    fontSize: normalizeFont(11),
    color: Colors.textMuted,
    marginTop: 1,
  },
  specsRow: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: Colors.borderGlass,
  },
  specText: {
    fontSize: normalizeFont(11),
    color: Colors.textGold,
    fontWeight: '600',
  },
  quickActionToolbar: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  actionPill: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 5,
    borderRadius: BorderRadius.xs,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  actionPillText: {
    fontSize: normalizeFont(9),
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  actionPillGold: {
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    borderColor: Colors.primary,
  },
  actionPillGoldText: {
    fontSize: normalizeFont(9),
    color: Colors.textGold,
    fontWeight: '700',
  },
  noPhotoContainer: {
    backgroundColor: '#0F1218',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    borderRadius: BorderRadius.sm,
    padding: 12,
  },
  noPhotoIcon: {
    fontSize: normalizeFont(24),
    marginBottom: 4,
  },
  noPhotoTitle: {
    fontSize: normalizeFont(13),
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  noPhotoSubtitle: {
    fontSize: normalizeFont(10),
    color: Colors.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },
});

export default PropertyCard;
