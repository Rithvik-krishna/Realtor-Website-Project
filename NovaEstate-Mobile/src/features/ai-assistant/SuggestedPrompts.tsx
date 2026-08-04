/**
 * AI Assistant - Suggested Action Prompts Carousel
 */

import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '@/theme';
import { triggerHaptic } from '@/utils';

export interface PromptOption {
  id: string;
  icon: string;
  label: string;
  prompt: string;
}

const PROMPTS: PromptOption[] = [
  { id: '1', icon: '📝', label: 'Summarize Listing', prompt: 'Summarize key highlights for 188 Yorkville Ave PH1 in 3 bullet points for a buyer.' },
  { id: '2', icon: '✉️', label: 'Client Email', prompt: 'Draft a luxury follow-up email for Alexander Wright regarding our recent showing.' },
  { id: '3', icon: '💬', label: 'WhatsApp Message', prompt: 'Write a quick WhatsApp message pitching 45 Forest Hill Rd to a VIP buyer.' },
  { id: '4', icon: '📸', label: 'Instagram Caption', prompt: 'Generate an engaging Instagram caption for a $5.4M penthouse listing in Yorkville with luxury hashtags.' },
  { id: '5', icon: '📊', label: 'Investment Analysis', prompt: 'Provide a cap rate and rental yield analysis for a $2.8M luxury condo in Toronto.' },
  { id: '6', icon: '🏙️', label: 'Neighborhood Summary', prompt: 'Summarize private schools and walkability for Forest Hill South.' },
];

interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

export function SuggestedPrompts({ onSelectPrompt }: SuggestedPromptsProps) {
  const handleSelect = (p: PromptOption) => {
    triggerHaptic.light();
    onSelectPrompt(p.prompt);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>SUGGESTED REALTOR AI PROMPTS</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {PROMPTS.map((p) => (
          <TouchableOpacity key={p.id} activeOpacity={0.8} style={styles.pill} onPress={() => handleSelect(p)}>
            <Text style={styles.icon}>{p.icon}</Text>
            <Text style={styles.label}>{p.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.xs,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.xs - 2,
    color: Colors.textMuted,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: Spacing.xs,
    paddingHorizontal: Spacing.md,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardHover,
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.xs + 2,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  icon: {
    fontSize: Typography.fontSizes.xs,
    marginRight: 6,
  },
  label: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
});

export default SuggestedPrompts;
