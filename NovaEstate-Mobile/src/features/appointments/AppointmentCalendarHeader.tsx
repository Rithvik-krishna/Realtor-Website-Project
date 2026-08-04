/**
 * Appointment Management - Day Strip Calendar Header
 */

import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '@/theme';
import { triggerHaptic } from '@/utils';

interface DayItem {
  dayName: string;
  dateNum: number;
  fullDate: string;
  isToday?: boolean;
}

const DAYS: DayItem[] = [
  { dayName: 'MON', dateNum: 27, fullDate: '2026-07-27' },
  { dayName: 'TUE', dateNum: 28, fullDate: '2026-07-28' },
  { dayName: 'WED', dateNum: 29, fullDate: '2026-07-29', isToday: true },
  { dayName: 'THU', dateNum: 30, fullDate: '2026-07-30' },
  { dayName: 'FRI', dateNum: 31, fullDate: '2026-07-31' },
  { dayName: 'SAT', dateNum: 1, fullDate: '2026-08-01' },
  { dayName: 'SUN', dateNum: 2, fullDate: '2026-08-02' },
];

interface CalendarHeaderProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export function AppointmentCalendarHeader({ selectedDate, onSelectDate }: CalendarHeaderProps) {
  const handleSelect = (date: string) => {
    triggerHaptic.light();
    onSelectDate(date);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.monthTitle}>JULY / AUGUST 2026</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stripContent}>
        {DAYS.map((day) => {
          const isSelected = selectedDate === day.fullDate;
          return (
            <TouchableOpacity
              key={day.fullDate}
              activeOpacity={0.75}
              style={[
                styles.dayPill,
                isSelected && styles.dayPillSelected,
                day.isToday && !isSelected && styles.dayPillToday,
              ]}
              onPress={() => handleSelect(day.fullDate)}
            >
              <Text style={[styles.dayName, isSelected && styles.dayNameSelected]}>{day.dayName}</Text>
              <Text style={[styles.dateNum, isSelected && styles.dateNumSelected]}>{day.dateNum}</Text>
              {day.isToday && <View style={styles.todayDot} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.background,
  },
  monthTitle: {
    fontSize: Typography.fontSizes.xs - 1,
    color: Colors.textGold,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: Spacing.sm,
  },
  stripContent: {
    paddingRight: Spacing.md,
  },
  dayPill: {
    width: 50,
    height: 64,
    borderRadius: BorderRadius.xs,
    backgroundColor: Colors.cardHover,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.xs + 2,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  dayPillSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.borderActive,
  },
  dayPillToday: {
    borderColor: Colors.primaryLight,
  },
  dayName: {
    fontSize: Typography.fontSizes.xs - 2,
    color: Colors.textMuted,
    fontWeight: '700',
  },
  dayNameSelected: {
    color: Colors.background,
  },
  dateNum: {
    fontSize: Typography.fontSizes.md,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginTop: 2,
  },
  dateNumSelected: {
    color: Colors.background,
  },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primaryLight,
    marginTop: 2,
  },
});

export default AppointmentCalendarHeader;
