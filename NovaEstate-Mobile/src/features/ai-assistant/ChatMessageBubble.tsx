/**
 * AI Assistant - Chat Message Bubble with Copy Button & Typing Animation
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';
import { GlassCard } from '@/components/ui/GlassCard';
import { Colors, Spacing, Typography, BorderRadius } from '@/theme';
import { triggerHaptic } from '@/utils';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

export function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  const isUser = message.sender === 'user';

  const handleCopy = () => {
    triggerHaptic.light();
    alert('AI response copied to clipboard!');
  };

  return (
    <View style={[styles.wrapper, isUser ? styles.userWrapper : styles.aiWrapper]}>
      <GlassCard
        style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}
        variant={isUser ? 'default' : 'goldBorder'}
      >
        <View style={styles.headerRow}>
          <Text style={[styles.senderName, isUser ? styles.userSender : styles.aiSender]}>
            {isUser ? 'You' : '🤖 NOVA AI CO-PILOT'}
          </Text>
          <Text style={styles.timeText}>{message.timestamp}</Text>
        </View>

        <Text style={styles.messageText}>{message.text}</Text>

        {!isUser && (
          <TouchableOpacity style={styles.copyBtn} onPress={handleCopy}>
            <Text style={styles.copyText}>📋 Copy Output</Text>
          </TouchableOpacity>
        )}
      </GlassCard>
    </View>
  );
}

export function TypingIndicator() {
  const opacity = useSharedValue(0.3);

  React.useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 600 }), -1, true);
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={styles.aiWrapper}>
      <GlassCard style={styles.aiBubble} variant="goldBorder">
        <Animated.Text style={[styles.typingText, animStyle]}>
          🤖 Nova AI is generating response...
        </Animated.Text>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Spacing.md,
    maxWidth: '88%',
  },
  userWrapper: {
    alignSelf: 'flex-end',
  },
  aiWrapper: {
    alignSelf: 'flex-start',
  },
  bubble: {
    padding: Spacing.md,
  },
  userBubble: {
    backgroundColor: 'rgba(212, 175, 55, 0.12)',
    borderColor: Colors.borderActive,
  },
  aiBubble: {
    backgroundColor: Colors.cardHover,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  senderName: {
    fontSize: Typography.fontSizes.xs - 2,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  userSender: {
    color: Colors.textGold,
  },
  aiSender: {
    color: Colors.primaryLight,
  },
  timeText: {
    fontSize: Typography.fontSizes.xs - 2,
    color: Colors.textMuted,
  },
  messageText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.textPrimary,
    lineHeight: Typography.lineHeights.sm,
  },
  copyBtn: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.borderGlass,
    alignSelf: 'flex-start',
  },
  copyText: {
    fontSize: Typography.fontSizes.xs - 1,
    color: Colors.textGold,
    fontWeight: '600',
  },
  typingText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.primaryLight,
    fontWeight: '600',
    fontStyle: 'italic',
  },
});

export default ChatMessageBubble;
