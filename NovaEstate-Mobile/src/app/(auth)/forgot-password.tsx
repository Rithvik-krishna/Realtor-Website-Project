/**
 * NovaEstate Mobile - Forgot Password Screen Component
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
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography, BorderRadius } from '@/theme';
import { triggerHaptic } from '@/utils';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      triggerHaptic.error();
      return;
    }

    triggerHaptic.medium();
    setLoading(true);

    // Simulate API request delay
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  const navigateToLogin = () => {
    triggerHaptic.light();
    router.push('/(auth)/login' as any);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity onPress={navigateToLogin} style={styles.backBtn}>
          <Text style={styles.backText}>← Back to Sign In</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          Enter your registered professional email to receive a password reset link.
        </Text>

        <View style={styles.card}>
          {submitted ? (
            <View style={styles.successBox}>
              <Text style={styles.successTitle}>Reset Email Sent</Text>
              <Text style={styles.successText}>
                We have dispatched password reset instructions to <Text style={styles.boldText}>{email}</Text>. Please check your inbox.
              </Text>
              <TouchableOpacity style={styles.submitBtn} onPress={navigateToLogin}>
                <Text style={styles.submitBtnText}>Return to Login</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Professional Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="realtor@novaestate.ca"
                  placeholderTextColor={Colors.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#000000" />
                ) : (
                  <Text style={styles.submitBtnText}>Send Reset Link</Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
    justifyContent: 'center',
  },
  backBtn: {
    marginBottom: Spacing.lg,
  },
  backText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.textGold,
    fontWeight: '600',
  },
  title: {
    fontSize: Typography.fontSizes.xxl,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.textMuted,
    marginTop: 4,
    marginBottom: Spacing.xl,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
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
  },
  submitBtnText: {
    fontSize: Typography.fontSizes.md,
    fontWeight: '700',
    color: '#000000',
  },
  successBox: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  successTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: '700',
    color: Colors.textGold,
  },
  successText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  boldText: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
});
