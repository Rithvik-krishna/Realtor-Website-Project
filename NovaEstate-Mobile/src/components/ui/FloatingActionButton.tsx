import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/theme';
import { triggerHaptic } from '@/utils/haptics';

interface FABProps {
  icon?: string;
  onPress: () => void;
  label?: string;
}

export function FloatingActionButton({ icon = '✨', onPress, label }: FABProps) {
  const insets = useSafeAreaInsets();
  const bottomMargin = Math.max(insets.bottom + 85, 95);

  const handlePress = () => {
    triggerHaptic.medium();
    onPress();
  };

  return (
    <TouchableOpacity
      style={[styles.fab, { bottom: bottomMargin }]}
      onPress={handlePress}
      activeOpacity={0.85}
    >
      <Text style={styles.icon}>{icon}</Text>
      {label && <Text style={styles.label}>{label}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    backgroundColor: Colors.primary,
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  icon: {
    fontSize: 18,
  },
  label: {
    color: Colors.background,
    fontSize: 13,
    fontWeight: '800',
    marginLeft: 6,
  },
});

export default FloatingActionButton;
