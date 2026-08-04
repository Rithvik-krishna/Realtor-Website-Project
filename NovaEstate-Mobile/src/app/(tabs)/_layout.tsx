import React from 'react';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet, Text, View, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Colors } from '@/theme';
import { triggerHaptic } from '@/utils/haptics';

import { ProtectedRoute } from '@/navigation/ProtectedRoute';

function FloatingTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isSmallDevice = width < 360;
  const bottomPosition = Math.max(insets.bottom, Platform.OS === 'ios' ? 12 : 10);

  // Exact 4 Primary Tabs Filter
  const allowedRoutes = ['leads', 'properties', 'saved', 'profile'];
  const routesToRender = state.routes.filter((route: any) => {
    const { options } = descriptors[route.key];
    return options.href !== null && allowedRoutes.includes(route.name);
  });

  return (
    <View style={[styles.floatingWrapper, { bottom: bottomPosition }]}>
      <View style={styles.floatingContainer}>
        <BlurView
          intensity={Platform.OS === 'ios' ? 80 : 90}
          tint="dark"
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.tabItemsRow}>
          {routesToRender.map((route: any) => {
            const { options } = descriptors[route.key];
            const routeIndex = state.routes.findIndex((r: any) => r.key === route.key);
            const isFocused = state.index === routeIndex;

            const rawTitle = options.title || route.name;
            const title = rawTitle.replace(/^[^\w\s]+\s*/, '');

            const onPress = () => {
              triggerHaptic.light();
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                activeOpacity={0.75}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={title}
                style={styles.tabColumn}
              >
                <View style={[styles.tabPill, isFocused && styles.activeTabPill]}>
                  {options.tabBarIcon ? (
                    options.tabBarIcon({
                      focused: isFocused,
                      color: isFocused ? Colors.primary : Colors.textMuted,
                      size: isFocused ? 18 : 16,
                    })
                  ) : null}
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={[
                      styles.tabLabel,
                      isSmallDevice && styles.smallDeviceText,
                      isFocused ? styles.activeTabLabel : styles.inactiveTabLabel,
                    ]}
                  >
                    {title}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <ProtectedRoute>
      <Tabs
        initialRouteName="leads"
        tabBar={(props) => <FloatingTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* 1. Lead Inbox */}
        <Tabs.Screen
          name="leads"
          options={{
            title: '⚡ Inbox',
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size || 16, color }}>⚡</Text>
            ),
          }}
        />

        {/* 2. Properties (TRREB MLS Search) */}
        <Tabs.Screen
          name="properties"
          options={{
            title: '🏡 Properties',
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size || 16, color }}>🏡</Text>
            ),
          }}
        />

        {/* 3. Saved Properties */}
        <Tabs.Screen
          name="saved"
          options={{
            title: '❤️ Saved',
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size || 16, color }}>❤️</Text>
            ),
          }}
        />

        {/* 4. Realtor Profile */}
        <Tabs.Screen
          name="profile"
          options={{
            title: '👤 Profile',
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size || 16, color }}>👤</Text>
            ),
          }}
        />

        {/* Hidden Internal Routes */}
        <Tabs.Screen name="index" options={{ href: null }} />
        <Tabs.Screen name="clients" options={{ href: null }} />
        <Tabs.Screen name="ai-assistant" options={{ href: null }} />
        <Tabs.Screen name="ai" options={{ href: null }} />
      </Tabs>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  floatingWrapper: {
    position: 'absolute',
    left: 14,
    right: 14,
    alignItems: 'center',
    zIndex: 99,
  },
  floatingContainer: {
    width: '100%',
    borderRadius: 24, // Smoother, lighter radius
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.25)', // Subtle gold glass border
    backgroundColor: 'rgba(15, 20, 32, 0.82)', // Lighter glass opacity
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 8,
  },
  tabItemsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  tabColumn: {
    flex: 1, // Equal width for every tab
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 16,
    minHeight: 40,
    gap: 3,
  },
  activeTabPill: {
    backgroundColor: 'rgba(212, 175, 55, 0.16)', // Gold Glass Active Accent
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.45)',
  },
  tabLabel: {
    fontSize: 11,
    letterSpacing: 0.1,
  },
  inactiveTabLabel: {
    fontWeight: '500',
    color: 'rgba(156, 163, 175, 0.75)', // Muted grey
  },
  activeTabLabel: {
    color: '#F5D061', // Warm gold text
    fontWeight: '700',
  },
  smallDeviceText: {
    fontSize: 10,
  },
});
