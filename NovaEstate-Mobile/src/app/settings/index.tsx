/**
 * NovaEstate Mobile - Hidden Screen: Settings
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography } from '@/theme';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Settings</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
  },
  title: {
    fontSize: Typography.fontSizes.lg,
    color: Colors.textPrimary,
    fontWeight: 'bold',
  },
});
