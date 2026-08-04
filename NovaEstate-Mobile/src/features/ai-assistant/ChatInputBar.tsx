/**
 * AI Assistant - Voice & Text Input Bar
 */

import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '@/theme';
import { triggerHaptic } from '@/utils';

interface ChatInputBarProps {
  onSend: (text: string) => void;
  isLoading: boolean;
}

export function ChatInputBar({ onSend, isLoading }: ChatInputBarProps) {
  const [inputText, setInputText] = useState('');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);

  const handleSend = () => {
    if (!inputText.trim() || isLoading) return;
    triggerHaptic.medium();
    onSend(inputText);
    setInputText('');
  };

  const handleVoiceInput = () => {
    triggerHaptic.heavy();
    if (!isRecordingVoice) {
      setIsRecordingVoice(true);
      setTimeout(() => {
        setIsRecordingVoice(false);
        setInputText('Draft an exclusive WhatsApp message to Alexander Wright pitching 188 Yorkville Ave PH1.');
      }, 2000);
    } else {
      setIsRecordingVoice(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Input Field */}
      <View style={styles.inputBox}>
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder={isRecordingVoice ? '🎙 Listening to voice dictation...' : 'Ask Nova AI to write email, summarize, or analyze...'}
          placeholderTextColor={isRecordingVoice ? Colors.primaryLight : Colors.textMuted}
          style={styles.input}
          multiline
        />

        {/* Voice Dictation Button */}
        <TouchableOpacity
          style={[styles.voiceBtn, isRecordingVoice && styles.recordingBtn]}
          onPress={handleVoiceInput}
        >
          <Text style={styles.voiceIcon}>{isRecordingVoice ? '🔴' : '🎙️'}</Text>
        </TouchableOpacity>
      </View>

      {/* Send Button */}
      <TouchableOpacity
        style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
        onPress={handleSend}
        disabled={!inputText.trim() || isLoading}
      >
        <Text style={styles.sendIcon}>➔</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.backgroundElevated,
    borderTopWidth: 1,
    borderTopColor: Colors.borderGlass,
  },
  inputBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardHover,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    minHeight: 44,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  input: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: Typography.fontSizes.sm,
    paddingVertical: 8,
  },
  voiceBtn: {
    padding: Spacing.xs,
    marginLeft: Spacing.xs,
  },
  recordingBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderRadius: BorderRadius.full,
  },
  voiceIcon: {
    fontSize: Typography.fontSizes.md,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.xs,
  },
  sendBtnDisabled: {
    opacity: 0.4,
  },
  sendIcon: {
    fontSize: Typography.fontSizes.md,
    color: '#000000',
    fontWeight: '800',
  },
});

export default ChatInputBar;
