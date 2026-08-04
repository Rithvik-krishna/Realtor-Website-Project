/**
 * Realtor Profile - Settings & Logout Group
 */

import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { GlassCard } from '@/components/ui/GlassCard';
import { Colors, Spacing, Typography, BorderRadius } from '@/theme';
import { useAuthStore } from '@/store/useAuthStore';
import { triggerHaptic } from '@/utils';

export function ProfileSettingsGroup() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const [darkMode, setDarkMode] = useState(true);
  const [biometrics, setBiometrics] = useState(true);

  const handleLogout = () => {
    triggerHaptic.heavy();
    logout();
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>SETTINGS & SECURITY</Text>

      <GlassCard style={styles.card}>
        {/* Dark Mode */}
        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingLabel}>Dark Luxury Mode</Text>
            <Text style={styles.settingSub}>Obsidian Black Aesthetic Theme</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: Colors.cardHover, true: Colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Biometric Security */}
        <View style={[styles.settingRow, styles.borderTop]}>
          <View>
            <Text style={styles.settingLabel}>Face ID / Touch ID</Text>
            <Text style={styles.settingSub}>Biometric Login Protection</Text>
          </View>
          <Switch
            value={biometrics}
            onValueChange={setBiometrics}
            trackColor={{ false: Colors.cardHover, true: Colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Saved Searches */}
        <TouchableOpacity style={[styles.settingRow, styles.borderTop]} onPress={() => router.push('/saved-properties/index' as any)}>
          <View>
            <Text style={styles.settingLabel}>MLS Saved Searches</Text>
            <Text style={styles.settingSub}>3 Active Search Alerts</Text>
          </View>
          <Text style={styles.chevron}>➔</Text>
        </TouchableOpacity>
      </GlassCard>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>🔒 Secure Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xxl,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.xs - 2,
    color: Colors.textMuted,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: Spacing.xs + 2,
  },
  card: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs + 2,
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderGlass,
    marginTop: Spacing.xs,
    paddingTop: Spacing.sm,
  },
  settingLabel: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  settingSub: {
    fontSize: Typography.fontSizes.xs - 1,
    color: Colors.textMuted,
    marginTop: 2,
  },
  chevron: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.primaryLight,
  },
  logoutBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  logoutText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.danger,
    fontWeight: '700',
  },
});

export default ProfileSettingsGroup;
