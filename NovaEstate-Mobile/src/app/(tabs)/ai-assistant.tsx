import React, { useState, useRef } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '@/theme';
import { SuggestedPrompts } from '@/features/ai-assistant/SuggestedPrompts';
import { ChatMessageBubble, ChatMessage, TypingIndicator } from '@/features/ai-assistant/ChatMessageBubble';
import { ChatInputBar } from '@/features/ai-assistant/ChatInputBar';
import { triggerHaptic, normalizeFont } from '@/utils';

const INITIAL_CONVERSATION: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'ai',
    text: "Welcome Marcus. I'm your Nova Real Estate Co-Pilot. I can summarize listings, generate high-converting client emails, compose WhatsApp pitches, analyze cap rates, or generate social media teasers. How can I assist your deals today?",
    timestamp: 'Just now',
  },
];

export default function AIAssistantTab() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CONVERSATION);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const handleSendMessage = (text: string) => {
    triggerHaptic.light();
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsAiGenerating(true);

    setTimeout(() => {
      let aiResponseText = `Here is your customized analysis for: "${text}"\n\n1. Highlights: Premium Yorkville Location, Direct Elevator Access, $2,850,000.\n2. Suggested Follow-Up: "Hi Alexander, I secured a private showing slot for Friday at 11:00 AM."`;

      if (text.toLowerCase().includes('email')) {
        aiResponseText = `Subject: Exclusive VIP Opportunity — 188 Yorkville Ave PH1\n\nDear Alexander,\n\nFollowing our discussion regarding luxury penthouses in Yorkville, I wanted to personally highlight a brand new listing at 188 Yorkville Ave. Featuring 3,200 sqft of refined living space, private terrace, and 24/7 concierge service.\n\nWould you be available for a private viewing this Friday at 11:00 AM?\n\nBest regards,\nMarcus Sterling`;
      } else if (text.toLowerCase().includes('whatsapp')) {
        aiResponseText = `Hi Alexander 👋 Just got early access to 188 Yorkville Ave PH1 ($2.85M). 3,200 sqft, stunning terrace views. Let me know if you want to pop in for a private walk-through Friday morning! 🔑`;
      } else if (text.toLowerCase().includes('instagram') || text.toLowerCase().includes('listing')) {
        aiResponseText = `✨ Elevate your standard of living in the heart of Yorkville. PH1 at 188 Yorkville Ave offers 3,200 sqft of pure architectural mastery. Private elevator entry, floor-to-ceiling glass, and panoramic city views. 🏙️\n\nListed at $2,850,000.\n📲 DM for private VIP showing details.\n\n#YorkvilleRealEstate #TorontoLuxury #PenthouseLiving #NovaEstate`;
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiResponseText,
        timestamp: 'Now',
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsAiGenerating(false);
    }, 1000);
  };

  const handleClearHistory = () => {
    triggerHaptic.medium();
    setMessages(INITIAL_CONVERSATION);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      {/* Header Bar */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>AI Real Estate Co-Pilot</Text>
          <Text style={styles.subtitle}>GPT-4o Luxury Advisor • Active</Text>
        </View>
        <TouchableOpacity style={styles.clearBtn} onPress={handleClearHistory}>
          <Text style={styles.clearText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Suggested Prompts Carousel */}
        <SuggestedPrompts onSelectPrompt={handleSendMessage} />

        {/* Chat Conversation History */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chatList}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <ChatMessageBubble message={item} />}
          ListFooterComponent={isAiGenerating ? <TypingIndicator /> : null}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {/* Voice & Text Input Bar */}
        <ChatInputBar onSend={handleSendMessage} isLoading={isAiGenerating} />
      </KeyboardAvoidingView>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderGlass,
  },
  title: {
    fontSize: normalizeFont(16),
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: normalizeFont(10),
    color: Colors.textGold,
    fontWeight: '600',
    marginTop: 2,
  },
  clearBtn: {
    backgroundColor: Colors.cardHover,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  clearText: {
    fontSize: normalizeFont(11),
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  chatList: {
    paddingHorizontal: 18,
    paddingTop: Spacing.xs,
    paddingBottom: 110,
  },
});

