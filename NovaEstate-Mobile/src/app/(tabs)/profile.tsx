import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '@/theme';
import { useAuthStore } from '@/store/useAuthStore';

import { RealtorHeaderCard } from '@/features/profile/RealtorHeaderCard';
import { RealtorPerformanceCard } from '@/features/profile/RealtorPerformanceCard';
import { AchievementsCard } from '@/features/profile/AchievementsCard';
import { ProfileSettingsGroup } from '@/features/profile/ProfileSettingsGroup';

export default function ProfileScreen() {
  const user = useAuthStore((state) => state.user);

  const name = user ? `${user.firstName} ${user.lastName}` : 'Marcus Sterling';
  const title = 'Senior Vice President of Luxury Sales';
  const brokerage = user?.brokerageName || 'NovaEstate Luxury Real Estate Brokerage';
  const licenseNo = user?.licenseNumber || '#RE-8829104';

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Bio Header */}
        <RealtorHeaderCard
          name={name}
          title={title}
          brokerage={brokerage}
          licenseNo={licenseNo}
          avatarUrl={user?.avatarUrl}
        />

        {/* Performance Dashboard */}
        <RealtorPerformanceCard />

        {/* Achievements & Subscription */}
        <AchievementsCard />

        {/* Settings, Security & Logout */}
        <ProfileSettingsGroup />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: Spacing.md,
    paddingBottom: 110,
  },
});

