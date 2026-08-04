import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, BorderRadius } from '@/theme';
import { normalizeFont } from '@/utils/responsive';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFilterPress?: () => void;
  activeFilterCount?: number;
  onVoicePress?: () => void;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search MLS, clients, leads...',
  onFilterPress,
  activeFilterCount = 0,
  onVoicePress,
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {value.length > 0 && (
          <TouchableOpacity
            style={styles.clearBtn}
            onPress={() => onChangeText('')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
        {onVoicePress && (
          <TouchableOpacity style={styles.iconBtn} onPress={onVoicePress}>
            <Text style={styles.actionIcon}>🎙️</Text>
          </TouchableOpacity>
        )}
      </View>

      {onFilterPress && (
        <TouchableOpacity
          style={[styles.filterBtn, activeFilterCount > 0 && styles.filterBtnActive]}
          onPress={onFilterPress}
          activeOpacity={0.8}
        >
          <Text style={styles.filterIcon}>⚙️</Text>
          {activeFilterCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    paddingHorizontal: 12,
    height: 46,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: normalizeFont(13),
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 4,
  },
  clearText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  iconBtn: {
    padding: 4,
    marginLeft: 4,
  },
  actionIcon: {
    fontSize: 15,
  },
  filterBtn: {
    width: 46,
    height: 46,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.cardHover,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBtnActive: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
  },
  filterIcon: {
    fontSize: 16,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: Colors.background,
    fontSize: 10,
    fontWeight: '800',
  },
});

export default SearchBar;
