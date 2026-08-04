/**
 * NovaEstate Mobile - First-time Realtor Onboarding Screen (2 Clean Distinct Pages)
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  LayoutChangeEvent,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography, BorderRadius, LuxuryPalette } from '@/theme';
import { useOnboardingStore } from '@/store';
import { triggerHaptic } from '@/utils';

const { width: windowWidth } = Dimensions.get('window');

const ONBOARDING_PAGES = [
  {
    step: 'ONBOARDING 1 OF 2',
    badge: '⚡ MLS® & MARKET INTELLIGENCE',
    title: 'Live TRREB Data & Instant CMA Valuations',
    description: 'Welcome to your real estate command center. Get direct access to 100% active TRREB MLS listings, interactive market analytics, and instant comparative market analysis reports.',
    features: [
      { icon: '📡', title: 'Live TRREB Feed', desc: 'Direct connection to Ontario MLS listings updated every 10 minutes.' },
      { icon: '📊', title: 'Market Analytics', desc: 'Days-on-market metrics, neighborhood school scores, and price trends.' },
      { icon: '📄', title: 'Instant CMA Reports', desc: 'Generate professional property valuation dossiers for your buyers in seconds.' },
    ],
  },
  {
    step: 'ONBOARDING 2 OF 2',
    badge: '🤖 AI COPILOT & CLIENT CRM',
    title: 'Automate Leads, Showings & AI Search',
    description: 'Supercharge your realtor workflow. Use natural language AI to find target properties, automate showing requests, and manage client pipelines effortlessly.',
    features: [
      { icon: '💬', title: 'AI Assistant', desc: 'Ask natural language queries like "Find 4 bed homes in Oakville under $1.5M".' },
      { icon: '📅', title: 'Showing Scheduler', desc: 'Book and manage client property showings with instant notifications.' },
      { icon: '👥', title: 'VIP Client Pipeline', desc: 'Track buyer budgets, saved searches, and lead stages in one unified CRM.' },
    ],
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(windowWidth);
  const flatListRef = useRef<FlatList>(null);
  const completeOnboarding = useOnboardingStore((state) => state.completeOnboarding);

  const handleLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0 && w !== containerWidth) {
      setContainerWidth(w);
    }
  };

  const handleNext = async () => {
    triggerHaptic.light();
    if (currentIndex === 0) {
      setCurrentIndex(1);
      flatListRef.current?.scrollToIndex({ index: 1, animated: true });
    } else {
      await completeOnboarding();
      router.replace('/(auth)/login' as any);
    }
  };

  const handleSkip = async () => {
    triggerHaptic.medium();
    await completeOnboarding();
    router.replace('/(auth)/login' as any);
  };

  return (
    <SafeAreaView style={styles.container} onLayout={handleLayout}>
      {/* Top Navigation Bar */}
      <View style={styles.headerRow}>
        <View style={styles.logoRow}>
          <Text style={styles.logoText}>NovaEstate</Text>
          <View style={styles.proBadge}>
            <Text style={styles.proText}>PRO</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.skipBtn} onPress={handleSkip} activeOpacity={0.7}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Pages Carousel */}
      <FlatList
        ref={flatListRef}
        data={ONBOARDING_PAGES}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / (containerWidth || windowWidth));
          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          <View style={[styles.slideContainer, { width: containerWidth }]}>
            <View style={styles.contentBox}>
              {/* Main Badge & Title */}
              <Text style={styles.badgeText}>{item.badge}</Text>
              <Text style={styles.titleText}>{item.title}</Text>
              <Text style={styles.descriptionText}>{item.description}</Text>

              {/* Feature Rich Content List */}
              <View style={styles.featuresList}>
                {item.features.map((feat: any, idx: number) => (
                  <View key={idx} style={styles.featureCard}>
                    <Text style={styles.featureIcon}>{feat.icon}</Text>
                    <View style={styles.featureTextCol}>
                      <Text style={styles.featureTitle}>{feat.title}</Text>
                      <Text style={styles.featureDesc}>{feat.desc}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
      />

      {/* Bottom Control Bar */}
      <View style={styles.footerContainer}>
        <View style={styles.paginationRow}>
          {ONBOARDING_PAGES.map((_, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => {
                triggerHaptic.light();
                setCurrentIndex(i);
                flatListRef.current?.scrollToIndex({ index: i, animated: true });
              }}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.dot,
                  i === currentIndex ? styles.activeDot : styles.inactiveDot,
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.primaryBtn} onPress={handleNext} activeOpacity={0.85}>
          <Text style={styles.primaryBtnText}>
            {currentIndex === 1 ? 'Get Started' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  logoText: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
  proBadge: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    borderColor: Colors.borderActive,
  },
  proText: {
    fontSize: Typography.fontSizes.xs - 2,
    color: Colors.textGold,
    fontWeight: '800',
  },
  skipBtn: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  skipText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  slideContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  contentBox: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  stepTag: {
    backgroundColor: 'rgba(212, 175, 55, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.borderActive,
    marginBottom: 10,
  },
  stepTagText: {
    fontSize: 10,
    color: Colors.textGold,
    fontWeight: '800',
    letterSpacing: 1,
  },
  badgeText: {
    fontSize: 11,
    color: Colors.primaryLight,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
  },
  titleText: {
    fontSize: Typography.fontSizes.xl + 2,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: Typography.fontSizes.xs + 1,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: Spacing.lg,
  },
  featuresList: {
    width: '100%',
    gap: 10,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LuxuryPalette.obsidian800,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  featureTextCol: {
    flex: 1,
  },
  featureTitle: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: Typography.fontSizes.xs - 1,
    color: Colors.textMuted,
    lineHeight: 16,
  },
  footerContainer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    gap: Spacing.lg,
  },
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    width: 28,
    backgroundColor: Colors.primary,
  },
  inactiveDot: {
    width: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  primaryBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  primaryBtnText: {
    fontSize: Typography.fontSizes.md,
    color: '#000000',
    fontWeight: '700',
  },
});



