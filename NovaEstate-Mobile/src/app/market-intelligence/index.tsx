/**
 * NovaEstate Mobile - Market Intelligence Executive Dashboard
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, RefreshControl } from 'react-native';
import { Colors, Spacing, Typography } from '@/theme';
import { triggerHaptic } from '@/utils';

import { MarketAIHeader } from '@/features/market-intelligence/MarketAIHeader';
import { MarketStatsGrid } from '@/features/market-intelligence/MarketStatsGrid';
import { PriceTrendChart } from '@/features/market-intelligence/PriceTrendChart';
import { HotAreasSection } from '@/features/market-intelligence/HotAreasSection';
import { SavedReportsSection } from '@/features/market-intelligence/SavedReportsSection';

export default function MarketIntelligenceScreen() {
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    triggerHaptic.medium();
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      >
        <Text style={styles.screenTitle}>MARKET INTELLIGENCE</Text>

        {/* AI Market Advisor Summary */}
        <MarketAIHeader />

        {/* Key Real Estate Stats Grid */}
        <MarketStatsGrid />

        {/* Interactive Price Trend Chart */}
        <PriceTrendChart />

        {/* Hot Areas & Growth Zones */}
        <HotAreasSection />

        {/* Offline PDF Market Reports */}
        <SavedReportsSection />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  screenTitle: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textSecondary,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: Spacing.sm,
  },
});
