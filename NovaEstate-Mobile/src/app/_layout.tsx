/**
 * NovaEstate Mobile - Native Expo Router Root Stack Layout
 */

import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AppProvider from '@/providers/AppProvider';
import { Colors } from '@/theme';

export default function RootLayout() {
  return (
    <AppProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.backgroundElevated },
          headerTintColor: Colors.textPrimary,
          headerTitleStyle: { color: Colors.textPrimary, fontWeight: '600' },
          contentStyle: { backgroundColor: Colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Hidden Screens */}
        <Stack.Screen
          name="property/[id]"
          options={{
            title: 'Property Details',
            headerBackTitle: 'Back',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="appointment/[id]"
          options={{
            title: 'Showing Appointment',
            headerBackTitle: 'Schedule',
          }}
        />
        <Stack.Screen
          name="notification/index"
          options={{
            title: 'Notification Center',
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen
          name="notification/[id]"
          options={{
            title: 'Notification Detail',
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen
          name="saved-properties/index"
          options={{
            title: 'Saved Properties',
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen
          name="market-intelligence/index"
          options={{
            title: 'GTA Market Intelligence',
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen
          name="settings/index"
          options={{
            title: 'Account Settings',
            headerBackTitle: 'Profile',
          }}
        />
        <Stack.Screen
          name="bottom-sheet"
          options={{
            presentation: 'modal',
            headerShown: false,
            animation: 'slide_from_bottom',
          }}
        />
      </Stack>
    </AppProvider>
  );
}
