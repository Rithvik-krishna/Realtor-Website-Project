import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius } from '@/theme';
import { triggerHaptic, normalizeFont } from '@/utils';

export function MarketAlertBanner() {
  const router = useRouter();

  const handlePress = () => {
    triggerHaptic.light();
    router.push('/market-intelligence/index' as any);
  };

  return (
    <Animated.View entering={FadeInDown.duration(400).delay(250)} style={styles.container}>
      <TouchableOpacity activeOpacity={0.85} style={styles.banner} onPress={handlePress}>
        <View style={styles.leftContent}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>MARKET ALERT</Text>
          </View>
          <Text style={styles.alertText}>
            Yorkville Luxury Condos DOM dropped to <Text style={styles.highlight}>14 Days</Text> • Average GTA Sale Price: <Text style={styles.highlight}>$1,320,000</Text>
          </Text>
        </View>
        <Text style={styles.arrow}>→</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: Spacing.md,
  },
  banner: {
    width: '100%',
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
    borderRadius: BorderRadius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginRight: 8,
  },
  badge: {
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.xs,
  },
  badgeText: {
    fontSize: normalizeFont(9),
    color: Colors.info,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  alertText: {
    flex: 1,
    fontSize: normalizeFont(12),
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  highlight: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  arrow: {
    fontSize: normalizeFont(16),
    color: Colors.info,
    fontWeight: '700',
    alignSelf: 'center',
  },
});

export default MarketAlertBanner;

