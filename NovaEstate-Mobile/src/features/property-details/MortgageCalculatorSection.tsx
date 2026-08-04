/**
 * Property Details - Interactive Native Mortgage Calculator
 */

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { GlassCard } from '@/components/ui/GlassCard';
import { Colors, Spacing, Typography, BorderRadius } from '@/theme';
import { formatCurrency } from '@/utils';

interface CalculatorProps {
  propertyPrice: number;
}

export function MortgageCalculatorSection({ propertyPrice }: CalculatorProps) {
  const [downPaymentPercent, setDownPaymentPercent] = useState('20');
  const [interestRate, setInterestRate] = useState('5.4');
  const [loanTermYears, setLoanTermYears] = useState('25');

  // Calculate Monthly Payment formula: P * (r * (1 + r)^n) / ((1 + r)^n - 1)
  const downPayment = (propertyPrice * (parseFloat(downPaymentPercent) || 0)) / 100;
  const principal = Math.max(0, propertyPrice - downPayment);
  const monthlyRate = (parseFloat(interestRate) || 0) / 100 / 12;
  const totalMonths = (parseInt(loanTermYears) || 25) * 12;

  const monthlyPayment =
    monthlyRate > 0 && totalMonths > 0
      ? (principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1)
      : principal / Math.max(1, totalMonths);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>MORTGAGE ESTIMATOR</Text>

      <GlassCard style={styles.card}>
        <View style={styles.paymentHeader}>
          <Text style={styles.paymentValue}>{formatCurrency(Math.round(monthlyPayment))}</Text>
          <Text style={styles.paymentLabel}>/ month estimated</Text>
        </View>

        <View style={styles.inputRow}>
          <View style={styles.inputCol}>
            <Text style={styles.inputLabel}>Down Payment (%)</Text>
            <TextInput
              value={downPaymentPercent}
              onChangeText={setDownPaymentPercent}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>
          <View style={styles.inputCol}>
            <Text style={styles.inputLabel}>Interest Rate (%)</Text>
            <TextInput
              value={interestRate}
              onChangeText={setInterestRate}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>
          <View style={styles.inputCol}>
            <Text style={styles.inputLabel}>Amortization</Text>
            <TextInput
              value={loanTermYears}
              onChangeText={setLoanTermYears}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>
        </View>

        <Text style={styles.downPaymentNote}>
          Down Payment Amount: {formatCurrency(Math.round(downPayment))}
        </Text>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textSecondary,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  card: {
    padding: Spacing.md,
  },
  paymentHeader: {
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderGlass,
  },
  paymentValue: {
    fontSize: Typography.fontSizes.xxl,
    color: Colors.textGold,
    fontWeight: '700',
  },
  paymentLabel: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputCol: {
    width: '31%',
  },
  inputLabel: {
    fontSize: Typography.fontSizes.xs - 2,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    backgroundColor: Colors.cardHover,
    borderRadius: BorderRadius.xs,
    paddingHorizontal: Spacing.sm,
    height: 38,
    color: Colors.textPrimary,
    fontSize: Typography.fontSizes.sm,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    textAlign: 'center',
  },
  downPaymentNote: {
    fontSize: Typography.fontSizes.xs - 1,
    color: Colors.textMuted,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
});

export default MortgageCalculatorSection;
