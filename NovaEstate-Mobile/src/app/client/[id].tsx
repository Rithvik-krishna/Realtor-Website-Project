/**
 * NovaEstate Mobile - Client Dossier & Lead Management Screen
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, TextInput, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { GoldButton } from '@/components/ui/GoldButton';
import { Colors, Spacing, Typography, BorderRadius } from '@/theme';
import { useLeadDetailsQuery, useAddLeadNoteMutation } from '@/hooks';
import { formatCurrency, triggerHaptic } from '@/utils';

export default function ClientDossierScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'notes' | 'tasks' | 'properties' | 'documents'>('notes');
  const [newNote, setNewNote] = useState('');

  const { data: response, isLoading } = useLeadDetailsQuery(id || 'lead-101');
  const addNoteMutation = useAddLeadNoteMutation();

  const lead = response?.data;

  const handleCall = () => {
    triggerHaptic.light();
    if (lead) Linking.openURL(`tel:${lead.phone}`);
  };

  const handleEmail = () => {
    triggerHaptic.light();
    if (lead) Linking.openURL(`mailto:${lead.email}`);
  };

  const handleAddNote = async () => {
    if (!newNote.trim() || !lead) return;
    triggerHaptic.medium();
    await addNoteMutation.mutateAsync({ id: lead.id, note: newNote });
    setNewNote('');
  };

  if (isLoading || !lead) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Client Dossier...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Client Contact Dossier Header */}
        <GlassCard style={styles.headerCard}>
          <View style={styles.headerTop}>
            <View style={styles.nameCol}>
              <Text style={styles.clientName}>{lead.clientName}</Text>
              <Text style={styles.emailText}>{lead.email}</Text>
              <Text style={styles.phoneText}>{lead.phone}</Text>
            </View>

            <Badge label={lead.status} variant={lead.status === 'NEW' ? 'gold' : 'info'} />
          </View>

          <View style={styles.budgetRow}>
            <Text style={styles.budgetLabel}>Inquiry / Property Target</Text>
            <Text style={styles.budgetValue}>
              {lead.propertyAddress || (lead.budgetMin && lead.budgetMax ? `${formatCurrency(lead.budgetMin)} - ${formatCurrency(lead.budgetMax)}` : 'Website Lead')}
            </Text>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionBtn} onPress={handleCall}>
              <Text style={styles.actionBtnText}>📞 Call</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.emailBtn]} onPress={handleEmail}>
              <Text style={styles.actionBtnText}>✉️ Email</Text>
            </TouchableOpacity>
          </View>
        </GlassCard>

        {/* Tab Switcher */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'notes' && styles.tabBtnActive]}
            onPress={() => setActiveTab('notes')}
          >
            <Text style={[styles.tabText, activeTab === 'notes' && styles.tabTextActive]}>Notes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'tasks' && styles.tabBtnActive]}
            onPress={() => setActiveTab('tasks')}
          >
            <Text style={[styles.tabText, activeTab === 'tasks' && styles.tabTextActive]}>Tasks</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'properties' && styles.tabBtnActive]}
            onPress={() => setActiveTab('properties')}
          >
            <Text style={[styles.tabText, activeTab === 'properties' && styles.tabTextActive]}>Saved Homes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'documents' && styles.tabBtnActive]}
            onPress={() => setActiveTab('documents')}
          >
            <Text style={[styles.tabText, activeTab === 'documents' && styles.tabTextActive]}>Docs</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === 'notes' && (
          <View style={styles.section}>
            <GlassCard style={styles.addNoteCard}>
              <TextInput
                value={newNote}
                onChangeText={setNewNote}
                placeholder="Add client interaction note or voice note summary..."
                placeholderTextColor={Colors.textMuted}
                multiline
                style={styles.noteInput}
              />
              <View style={styles.submitBtnRow}>
                <GoldButton title="Save CRM Note" onPress={handleAddNote} loading={addNoteMutation.isPending} />
              </View>
            </GlassCard>

            <Text style={styles.sectionTitle}>INTERACTION HISTORY</Text>
            {(lead.notes || []).map((note, idx) => (
              <GlassCard key={idx} style={styles.noteItem}>
                <Text style={styles.noteItemText}>{note}</Text>
                <Text style={styles.noteDate}>Added 2 hours ago by Marcus Sterling</Text>
              </GlassCard>
            ))}
          </View>
        )}

        {activeTab === 'tasks' && (
          <View style={styles.section}>
            <GlassCard style={styles.noteItem}>
              <Text style={styles.taskTitle}>☑️ Send CMA Valuation for 188 Yorkville</Text>
              <Text style={styles.noteDate}>Due Tomorrow • High Priority</Text>
            </GlassCard>
            <GlassCard style={styles.noteItem}>
              <Text style={styles.taskTitle}>☑️ Schedule VIP Showing at Forest Hill</Text>
              <Text style={styles.noteDate}>Due Friday, 11:00 AM</Text>
            </GlassCard>
          </View>
        )}

        {activeTab === 'properties' && (
          <View style={styles.section}>
            <GlassCard style={styles.noteItem}>
              <Text style={styles.taskTitle}>🏡 188 Yorkville Ave PH1, Toronto</Text>
              <Text style={styles.noteDate}>Saved 2 days ago • Loved Floor Plan</Text>
            </GlassCard>
          </View>
        )}

        {activeTab === 'documents' && (
          <View style={styles.section}>
            <GlassCard style={styles.noteItem}>
              <Text style={styles.taskTitle}>📄 Buyer Representation Agreement (BRA).pdf</Text>
              <Text style={styles.noteDate}>Signed • Valid until Dec 2026</Text>
            </GlassCard>
            <GlassCard style={styles.noteItem}>
              <Text style={styles.taskTitle}>📄 Mortgage Pre-Approval Letter ($5.5M).pdf</Text>
              <Text style={styles.noteDate}>Verified by RBC Private Banking</Text>
            </GlassCard>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.textMuted,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  headerCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  nameCol: {
    flex: 1,
  },
  clientName: {
    fontSize: Typography.fontSizes.lg,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  emailText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  phoneText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textMuted,
    marginTop: 1,
  },
  budgetRow: {
    marginTop: Spacing.md,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.borderGlass,
  },
  budgetLabel: {
    fontSize: Typography.fontSizes.xs - 2,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  budgetValue: {
    fontSize: Typography.fontSizes.md,
    color: Colors.textGold,
    fontWeight: '700',
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: Spacing.md,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: Colors.cardHover,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xs,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  emailBtn: {
    marginLeft: Spacing.xs,
  },
  actionBtnText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  tabRow: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    backgroundColor: Colors.cardHover,
    borderRadius: BorderRadius.sm,
    padding: 2,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: BorderRadius.xs,
  },
  tabBtnActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  tabTextActive: {
    color: Colors.background,
    fontWeight: '700',
  },
  section: {
    marginBottom: Spacing.md,
  },
  addNoteCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  noteInput: {
    backgroundColor: Colors.cardHover,
    borderRadius: BorderRadius.xs,
    padding: Spacing.md,
    color: Colors.textPrimary,
    fontSize: Typography.fontSizes.sm,
    height: 80,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    textAlignVertical: 'top',
  },
  submitBtnRow: {
    marginTop: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textSecondary,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: Spacing.xs,
  },
  noteItem: {
    padding: Spacing.md,
    marginBottom: Spacing.xs,
  },
  noteItemText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.textPrimary,
    lineHeight: Typography.lineHeights.sm,
  },
  noteDate: {
    fontSize: Typography.fontSizes.xs - 2,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  taskTitle: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
});
