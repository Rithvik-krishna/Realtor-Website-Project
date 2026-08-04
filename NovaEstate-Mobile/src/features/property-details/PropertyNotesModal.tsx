import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography } from '@/theme';
import { Property } from '@/types';
import { usePropertyNotesStore } from '@/store';
import { triggerHaptic } from '@/utils';

interface PropertyNotesModalProps {
  visible: boolean;
  property: Property | null;
  onClose: () => void;
}

export function PropertyNotesModal({ visible, property, onClose }: PropertyNotesModalProps) {
  const { notesMap, addNote, deleteNote } = usePropertyNotesStore();
  const [noteInput, setNoteInput] = useState('');

  if (!property) return null;

  const notes = notesMap[property.id] || [];

  const handleAddNote = () => {
    if (!noteInput.trim()) return;
    triggerHaptic.light();
    addNote(property.id, noteInput.trim());
    setNoteInput('');
  };

  const handleDeleteNote = (noteId: string) => {
    triggerHaptic.medium();
    deleteNote(property.id, noteId);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <View style={styles.headerTitleGroup}>
              <Text style={styles.modalTitle}>Private Realtor Notes</Text>
              <Text style={styles.lockBadge}>🔒 Visible only to you</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.propertyTitle} numberOfLines={1}>
            {property.title} ({property.mlsNumber})
          </Text>

          {/* Add Note Input Row */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Client liked kitchen island, offer expected Friday..."
              placeholderTextColor={Colors.textMuted}
              value={noteInput}
              onChangeText={setNoteInput}
              multiline
            />
            <TouchableOpacity style={styles.addBtn} onPress={handleAddNote} activeOpacity={0.8}>
              <Text style={styles.addBtnText}>＋ Add Private Note</Text>
            </TouchableOpacity>
          </View>

          {/* Existing Notes List */}
          <Text style={styles.sectionHeader}>Stored Private Notes ({notes.length})</Text>

          {notes.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>No private notes recorded for this property yet.</Text>
            </View>
          ) : (
            <FlatList
              data={notes}
              keyExtractor={(item) => item.id}
              style={styles.notesList}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.noteItem}>
                  <View style={styles.noteHeader}>
                    <Text style={styles.noteDate}>
                      {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </Text>
                    <TouchableOpacity onPress={() => handleDeleteNote(item.id)}>
                      <Text style={styles.deleteText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.noteText}>{item.text}</Text>
                </View>
              )}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: Colors.backgroundElevated,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.lg,
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  headerTitleGroup: {
    flex: 1,
  },
  modalTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  lockBadge: {
    fontSize: Typography.fontSizes.xs - 1,
    color: Colors.textGold,
    fontWeight: '600',
    marginTop: 2,
  },
  closeBtn: {
    padding: Spacing.xs,
  },
  closeBtnText: {
    fontSize: 16,
    color: Colors.textMuted,
  },
  propertyTitle: {
    fontSize: Typography.fontSizes.xs + 1,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  inputContainer: {
    marginBottom: Spacing.md,
  },
  textInput: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.borderActive,
    minHeight: 70,
    textAlignVertical: 'top',
    fontSize: Typography.fontSizes.sm,
    marginBottom: Spacing.xs + 2,
  },
  addBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  addBtnText: {
    color: '#000',
    fontWeight: '700',
    fontSize: Typography.fontSizes.sm,
  },
  sectionHeader: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textMuted,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: Spacing.xs + 2,
  },
  notesList: {
    maxHeight: 240,
  },
  noteItem: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xs + 2,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  noteDate: {
    fontSize: Typography.fontSizes.xs - 1,
    color: Colors.textGold,
    fontWeight: '600',
  },
  deleteText: {
    fontSize: Typography.fontSizes.xs - 1,
    color: Colors.danger,
    fontWeight: '600',
  },
  noteText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.textPrimary,
    lineHeight: 18,
  },
  emptyBox: {
    padding: Spacing.lg,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: BorderRadius.md,
  },
  emptyText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textMuted,
  },
});
