import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius } from '@/theme';
import { triggerHaptic, normalizeFont } from '@/utils';

interface QuickActionItem {
  id: string;
  title: string;
  icon: string;
  route: string;
}

const ACTIONS: QuickActionItem[] = [
  { id: '1', title: 'Record Voice Note', icon: '🎙️', route: '/bottom-sheet' },
  { id: '2', title: 'AI Home Valuation', icon: '🏡', route: '/market-intelligence' },
  { id: '3', title: 'New Showing', icon: '📅', route: '/appointment/new' },
  { id: '4', title: 'Pitch Listing', icon: '⚡', route: '/saved-properties' },
];

export function QuickActions() {
  const router = useRouter();

  const handlePress = (route: string) => {
    triggerHaptic.medium();
    router.push(route as any);
  };

  return (
    <Animated.View entering={FadeInDown.duration(400).delay(200)} style={styles.container}>
      <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
      <View style={styles.gridContainer}>
        {ACTIONS.map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.75}
            style={styles.actionBtn}
            onPress={() => handlePress(item.route)}
          >
            <Text style={styles.icon}>{item.icon}</Text>
            <Text style={styles.btnTitle} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: normalizeFont(11),
    color: Colors.textSecondary,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
    paddingHorizontal: 2,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  actionBtn: {
    width: '48.5%', // Two equal-width buttons
    backgroundColor: Colors.cardHover,
    borderRadius: BorderRadius.md,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 16,
    marginRight: 8,
  },
  btnTitle: {
    flex: 1,
    fontSize: normalizeFont(12),
    color: Colors.textPrimary,
    fontWeight: '600',
  },
});

export default QuickActions;

