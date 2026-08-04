import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography } from '@/theme';
import { Property } from '@/types';
import { useSavedPropertiesStore } from '@/store';
import { triggerHaptic } from '@/utils';

interface SaveToFolderModalProps {
  visible: boolean;
  property: Property | null;
  onClose: () => void;
}

export function SaveToFolderModal({ visible, property, onClose }: SaveToFolderModalProps) {
  const { folders, saveProperty, createFolder } = useSavedPropertiesStore();
  const [newFolderName, setNewFolderName] = useState('');
  const [showCreateInput, setShowCreateInput] = useState(false);

  if (!property) return null;

  const handleSelectFolder = (folderName: string) => {
    triggerHaptic.light();
    saveProperty(property, folderName);
    onClose();
  };

  const handleCreateAndSave = () => {
    if (!newFolderName.trim()) return;
    triggerHaptic.medium();
    createFolder(newFolderName.trim());
    saveProperty(property, newFolderName.trim());
    setNewFolderName('');
    setShowCreateInput(false);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Save to Realtor Folder</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.propertyTitle} numberOfLines={1}>
            {property.title} ({property.mlsNumber})
          </Text>

          <ScrollView style={styles.folderList} showsVerticalScrollIndicator={false}>
            {folders.map((f) => (
              <TouchableOpacity
                key={f.id}
                style={styles.folderItem}
                onPress={() => handleSelectFolder(f.name)}
                activeOpacity={0.7}
              >
                <Text style={styles.folderIcon}>📁</Text>
                <View style={styles.folderTextCol}>
                  <Text style={styles.folderName}>{f.name}</Text>
                  <Text style={styles.folderCount}>{f.propertyIds.length} properties saved</Text>
                </View>
                <Text style={styles.saveArrow}>＋ Save</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {showCreateInput ? (
            <View style={styles.createInputRow}>
              <TextInput
                style={styles.input}
                placeholder="New Folder Name (e.g. Oakville Buyers)"
                placeholderTextColor={Colors.textMuted}
                value={newFolderName}
                onChangeText={setNewFolderName}
                autoFocus
              />
              <TouchableOpacity style={styles.createBtn} onPress={handleCreateAndSave}>
                <Text style={styles.createBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.newFolderBtn}
              onPress={() => setShowCreateInput(true)}
            >
              <Text style={styles.newFolderBtnText}>＋ Create New Custom Folder</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: Colors.backgroundElevated,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.lg,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  modalTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
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
    color: Colors.textGold,
    marginBottom: Spacing.md,
  },
  folderList: {
    maxHeight: 280,
    marginBottom: Spacing.md,
  },
  folderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xs + 2,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  folderIcon: {
    fontSize: 22,
    marginRight: Spacing.md,
  },
  folderTextCol: {
    flex: 1,
  },
  folderName: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  folderCount: {
    fontSize: Typography.fontSizes.xs - 1,
    color: Colors.textMuted,
    marginTop: 2,
  },
  saveArrow: {
    fontSize: Typography.fontSizes.xs + 1,
    color: Colors.primary,
    fontWeight: '700',
  },
  newFolderBtn: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderActive,
    alignItems: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
  },
  newFolderBtnText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.textGold,
    fontWeight: '700',
  },
  createInputRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.borderActive,
  },
  createBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
  },
  createBtnText: {
    color: '#000',
    fontWeight: '700',
  },
});
