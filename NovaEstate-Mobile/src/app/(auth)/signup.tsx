/**
 * NovaEstate Mobile - Production Signup / Registration Screen Component
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography, BorderRadius } from '@/theme';
import { useAuthStore } from '@/store';
import { triggerHaptic } from '@/utils';
import { UserRole } from '@/types';

export default function SignupScreen() {
  const router = useRouter();
  const { signup, isLoading, error, clearError } = useAuthStore();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [brokerageName, setBrokerageName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    if (!firstName || !lastName || !email || !password) {
      triggerHaptic.error();
      return;
    }

    triggerHaptic.medium();
    try {
      await signup({
        firstName,
        lastName,
        email,
        phone,
        brokerageName: brokerageName || 'NovaEstate Realty Brokerage',
        licenseNumber: licenseNumber || 'RECO-#884920',
        password,
        role: 'AGENT',
      });
      router.replace('/(tabs)' as any);
    } catch {
      triggerHaptic.error();
    }
  };

  const navigateToLogin = () => {
    triggerHaptic.light();
    clearError();
    router.push('/(auth)/login' as any);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <TouchableOpacity onPress={navigateToLogin} style={styles.backBtn}>
              <Text style={styles.backText}>← Back to Login</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Realtor Onboarding</Text>
            <Text style={styles.subtitle}>Join NovaEstate's Exclusive Realtor Network</Text>
          </View>

          <View style={styles.card}>
            {error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.flex1]}>
                <Text style={styles.label}>First Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Marcus"
                  placeholderTextColor={Colors.textMuted}
                  value={firstName}
                  onChangeText={setFirstName}
                />
              </View>
              <View style={[styles.inputGroup, styles.flex1]}>
                <Text style={styles.label}>Last Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Vance"
                  placeholderTextColor={Colors.textMuted}
                  value={lastName}
                  onChangeText={setLastName}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Professional Email *</Text>
              <TextInput
                style={styles.input}
                placeholder="realtor@brokerage.com"
                placeholderTextColor={Colors.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="(416) 555-0199"
                placeholderTextColor={Colors.textMuted}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Brokerage Name</Text>
              <TextInput
                style={styles.input}
                placeholder="NovaEstate Realty Brokerage"
                placeholderTextColor={Colors.textMuted}
                value={brokerageName}
                onChangeText={setBrokerageName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>RECO / License Number</Text>
              <TextInput
                style={styles.input}
                placeholder="RECO-#99201"
                placeholderTextColor={Colors.textMuted}
                value={licenseNumber}
                onChangeText={setLicenseNumber}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password *</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••••••"
                placeholderTextColor={Colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={handleSignup} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#000000" />
              ) : (
                <Text style={styles.submitBtnText}>Create Realtor Profile</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  backBtn: {
    marginBottom: Spacing.md,
  },
  backText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.textGold,
    fontWeight: '600',
  },
  title: {
    fontSize: Typography.fontSizes.xl + 2,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.textMuted,
    marginTop: 4,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: Colors.danger,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
  },
  errorText: {
    color: Colors.danger,
    fontSize: Typography.fontSizes.sm,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  flex1: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  input: {
    backgroundColor: Colors.backgroundElevated,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: Typography.fontSizes.md,
    color: Colors.textPrimary,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  submitBtnText: {
    fontSize: Typography.fontSizes.md,
    fontWeight: '700',
    color: '#000000',
  },
});
