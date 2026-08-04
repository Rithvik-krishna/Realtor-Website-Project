/**
 * NovaEstate Mobile - Main Tab: Realtor AI Co-Pilot & Executive Assistant
 */

import React, { useState, useRef } from 'react';
import { View, SafeAreaView, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { Colors, Spacing } from '@/theme';
import { SuggestedPrompts } from '@/features/ai-assistant/SuggestedPrompts';
import { ChatMessageBubble, ChatMessage, TypingIndicator } from '@/features/ai-assistant/ChatMessageBubble';
import { ChatInputBar } from '@/features/ai-assistant/ChatInputBar';

const INITIAL_CONVERSATION: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'ai',
    text: "Welcome Marcus. I'm your Nova Real Estate Co-Pilot. I can summarize listings, generate high-converting client emails, compose WhatsApp pitches, or analyze cap rates. How can I assist your deals today?",
    timestamp: 'Just now',
  },
];

export default function AIAssistantScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CONVERSATION);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const handleSendMessage = (text: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsAiGenerating(true);

    setTimeout(() => {
      let aiResponseText = `Here is your customized response for: "${text}"\n\n1. Highlights: Premium Yorkville Location, Direct Elevator Access, $2,850,000.\n2. Suggested Follow-Up: "Hi Alexander, I secured a private showing slot for Friday at 11:00 AM."`;

      if (text.toLowerCase().includes('email')) {
        aiResponseText = `Subject: Exclusive VIP Opportunity — 188 Yorkville Ave PH1\n\nDear Alexander,\n\nFollowing our discussion regarding luxury penthouses in Yorkville, I wanted to personally highlight a brand new listing at 188 Yorkville Ave. Featuring 3,200 sqft of refined living space, private terrace, and 24/7 concierge service.\n\nWould you be available for a private viewing this Friday at 11:00 AM?\n\nBest regards,\nMarcus Sterling`;
      } else if (text.toLowerCase().includes('whatsapp')) {
        aiResponseText = `Hi Alexander 👋 Just got early access to 188 Yorkville Ave PH1 ($2.85M). 3,200 sqft, stunning terrace views. Let me know if you want to pop in for a private walk-through Friday morning! 🔑`;
      } else if (text.toLowerCase().includes('instagram')) {
        aiResponseText = `✨ Elevate your standard of living in the heart of Yorkville. PH1 at 188 Yorkville Ave offers 3,200 sqft of pure architectural mastery. Private elevator entry, floor-to-ceiling glass, and panoramic city views. 🏙️\n\nListed at $2,850,000.\n📲 DM for private VIP showing details.\n\n#YorkvilleRealEstate #TorontoLuxury #PenthouseLiving #NovaEstate #RealEstateToronto`;
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiResponseText,
        timestamp: 'Now',
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsAiGenerating(false);
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
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
  chatList: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.md,
  },
});
