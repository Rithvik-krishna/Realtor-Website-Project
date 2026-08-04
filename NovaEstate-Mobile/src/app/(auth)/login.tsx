/**
 * NovaEstate Mobile - Production Login Screen Component
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

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('marcus.vance@novaestate.ca');
  const [password, setPassword] = useState('Password123!');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      triggerHaptic.error();
      return;
    }

    triggerHaptic.medium();
    try {
      await login({ email, password });
      router.replace('/(tabs)' as any);
    } catch {
      triggerHaptic.error();
    }
  };

  const navigateToSignup = () => {
    triggerHaptic.light();
    clearError();
    router.push('/(auth)/signup' as any);
  };

  const navigateToForgotPassword = () => {
    triggerHaptic.light();
    clearError();
    router.push('/(auth)/forgot-password' as any);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Branding */}
          <View style={styles.brandHeader}>
            <Text style={styles.logoTitle}>NovaEstate</Text>
            <Text style={styles.brandTagline}>REALTOR PRODUCTIVITY PLATFORM</Text>
          </View>

          {/* Login Card Container */}
          <View style={styles.loginCard}>
            <Text style={styles.cardHeaderTitle}>Sign In to Command Center</Text>

            {error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Email Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Professional Email</Text>
              <TextInput
                style={styles.input}
                placeholder="realtor@novaestate.ca"
                placeholderTextColor={Colors.textMuted}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (error) clearError();
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Password Field */}
            <View style={styles.inputGroup}>
              <View style={styles.passwordLabelRow}>
                <Text style={styles.label}>Password</Text>
                <TouchableOpacity onPress={navigateToForgotPassword}>
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="••••••••••••"
                  placeholderTextColor={Colors.textMuted}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (error) clearError();
                  }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text style={styles.eyeText}>{showPassword ? 'Hide' : 'Show'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#000000" />
              ) : (
                <Text style={styles.submitBtnText}>Sign In to Dashboard</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer Register Prompt */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>New to NovaEstate Realtor Network? </Text>
            <TouchableOpacity onPress={navigateToSignup}>
              <Text style={styles.signupText}>Create Account</Text>
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
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logoTitle: {
    fontSize: Typography.fontSizes.xxl + 4,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: 1,
  },
  brandTagline: {
    fontSize: Typography.fontSizes.xs - 1,
    fontWeight: '700',
    color: Colors.textGold,
    letterSpacing: 1.5,
    marginTop: 4,
  },
  loginCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  cardHeaderTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
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
    fontWeight: '500',
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
  passwordLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  forgotText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textGold,
    fontWeight: '600',
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
  passwordContainer: {
    position: 'relative',
    justifyContent: 'center',
  },
  passwordInput: {
    paddingRight: 60,
  },
  eyeBtn: {
    position: 'absolute',
    right: Spacing.md,
    padding: Spacing.xs,
  },
  eyeText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textMuted,
    fontWeight: '600',
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
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  footerText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.textMuted,
  },
  signupText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.textGold,
    fontWeight: '700',
  },
});
