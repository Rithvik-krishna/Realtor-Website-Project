/**
 * Market Intelligence - Downloadable Market Reports & Offline PDF Library
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { GlassCard } from '@/components/ui/GlassCard';
import { Colors, Spacing, Typography, BorderRadius } from '@/theme';
import { triggerHaptic } from '@/utils';

interface ReportItem {
  id: string;
  title: string;
  fileSize: string;
  isDownloaded: boolean;
}

const INITIAL_REPORTS: ReportItem[] = [
  { id: 'rep-1', title: 'Q3 2026 GTA Luxury Real Estate Market Report.pdf', fileSize: '4.2 MB', isDownloaded: true },
  { id: 'rep-2', title: 'Commercial Development & Cap Rate Analysis 2026.pdf', fileSize: '6.8 MB', isDownloaded: false },
  { id: 'rep-3', title: 'Bank of Canada Interest Rate Outlook & Mortgages.pdf', fileSize: '2.1 MB', isDownloaded: false },
];

export function SavedReportsSection() {
  const [reports, setReports] = useState(INITIAL_REPORTS);

  const handleDownload = (id: string) => {
    triggerHaptic.medium();
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isDownloaded: true } : r))
    );
    alert('Report downloaded to local device for offline reading.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>MARKET REPORTS & OFFLINE PDFS</Text>

      {reports.map((report) => (
        <GlassCard key={report.id} style={styles.card}>
          <View style={styles.row}>
            <View style={styles.infoCol}>
              <Text style={styles.reportTitle}>{report.title}</Text>
              <Text style={styles.sizeText}>PDF • {report.fileSize}</Text>
            </View>

            <TouchableOpacity
              style={[styles.dlBtn, report.isDownloaded && styles.downloadedBtn]}
              onPress={() => handleDownload(report.id)}
            >
              <Text style={styles.dlBtnText}>
                {report.isDownloaded ? '✓ Saved' : '📥 Save PDF'}
              </Text>
            </TouchableOpacity>
          </View>
        </GlassCard>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.xs - 2,
    color: Colors.textMuted,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: Spacing.xs + 2,
  },
  card: {
    padding: Spacing.md,
    marginBottom: Spacing.xs + 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoCol: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  reportTitle: {
    fontSize: Typography.fontSizes.xs + 1,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  sizeText: {
    fontSize: Typography.fontSizes.xs - 2,
    color: Colors.textMuted,
    marginTop: 2,
  },
  dlBtn: {
    backgroundColor: Colors.cardHover,
    paddingVertical: 6,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  downloadedBtn: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  dlBtnText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
});

export default SavedReportsSection;
