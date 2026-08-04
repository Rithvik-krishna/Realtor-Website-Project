/**
 * Property Details - Dynamic Neighborhood Information & Local Schools
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassCard } from '@/components/ui/GlassCard';
import { Colors, Spacing, Typography, BorderRadius } from '@/theme';

interface NeighborhoodProps {
  city?: string;
}

const CITY_SCHOOL_MAPPING: Record<string, Array<{ name: string; type: string; score: string }>> = {
  Oakville: [
    { name: 'Oakville Trafalgar High School', type: 'Public • 9-12', score: '9.3/10' },
    { name: "St. Mildred's-Lightbourn School", type: 'Private • K-12', score: '9.7/10' },
    { name: 'Sheridan College Oakville Campus', type: 'Higher Education', score: 'Top Rated' },
  ],
  Brampton: [
    { name: 'Turner Fenton Secondary School (IB World)', type: 'Public • 9-12', score: '9.1/10' },
    { name: 'Brampton Centennial Secondary', type: 'Public • 9-12', score: '8.8/10' },
    { name: 'Algoma University Brampton Campus', type: 'Higher Education', score: 'Top College' },
  ],
  Toronto: [
    { name: 'University of Toronto Schools (UTS)', type: 'Private • 7-12', score: '9.9/10' },
    { name: 'Northern Secondary School', type: 'Public • 9-12', score: '9.2/10' },
    { name: 'University of Toronto St. George', type: 'Higher Education', score: 'Top 20 Global' },
  ],
  Mississauga: [
    { name: 'John Fraser Secondary School', type: 'Public • 9-12', score: '9.2/10' },
    { name: 'Gordon Graydon Memorial', type: 'Public • 9-12', score: '9.0/10' },
    { name: 'University of Toronto Mississauga (UTM)', type: 'Higher Education', score: 'Top Rated' },
  ],
  Vaughan: [
    { name: 'Stephen Lewis Secondary School', type: 'Public • 9-12', score: '9.0/10' },
    { name: 'Vaughan Secondary School', type: 'Public • 9-12', score: '8.7/10' },
    { name: 'York University Keele Campus', type: 'Higher Education', score: 'Top University' },
  ],
};

export function NeighborhoodSection({ city = 'Oakville' }: NeighborhoodProps) {
  const localSchools = CITY_SCHOOL_MAPPING[city] || [
    { name: `${city} Central Public School`, type: 'Public • K-8', score: '9.0/10' },
    { name: `${city} Collegiate Institute`, type: 'Public • 9-12', score: '9.2/10' },
    { name: `University Campus near ${city}`, type: 'Higher Education', score: 'Top Rated' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>NEIGHBORHOOD & LOCAL SCHOOLS ({city.toUpperCase()})</Text>

      <GlassCard style={styles.card}>
        {localSchools.map((school, idx) => (
          <View key={idx}>
            <View style={styles.schoolRow}>
              <View style={styles.textCol}>
                <Text style={styles.schoolName}>{school.name}</Text>
                <Text style={styles.schoolType}>{school.type}</Text>
              </View>
              <View style={styles.scoreBadge}>
                <Text style={styles.scoreText}>{school.score}</Text>
              </View>
            </View>
            {idx < localSchools.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textSecondary,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  card: {
    padding: Spacing.md,
  },
  schoolRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  textCol: {
    flex: 1,
  },
  schoolName: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  schoolType: {
    fontSize: Typography.fontSizes.xs - 1,
    color: Colors.textMuted,
    marginTop: 2,
  },
  scoreBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: Spacing.xs + 2,
    paddingVertical: 4,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  scoreText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.success,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderGlass,
    marginVertical: Spacing.xs,
  },
});

export default NeighborhoodSection;

