import React from 'react';
import {
  View, Text, TouchableOpacity, ActivityIndicator,
  StyleSheet, ScrollView,
} from 'react-native';

export const COLORS = {
  primary:  '#00946C',
  secondary:'#1E6EDC',
  gold:     '#C88200',
  red:      '#C82828',
  purple:   '#6E46D2',
  bg:       '#F5F6FA',
  surface:  '#FFFFFF',
  muted:    '#5A6980',
  dark:     '#191E2D',
  border:   '#DDE2EE',
};

// ── Stat Card ─────────────────────────────────────────────────────
export function StatCard({ label, value, color, icon }) {
  return (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Text style={[styles.statLabel]}>{label}</Text>
      <Text style={[styles.statValue, { color }]} numberOfLines={2} adjustsFontSizeToFit>{value}</Text>
    </View>
  );
}

// ── Info Row ──────────────────────────────────────────────────────
export function InfoRow({ label, value, valueColor }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, valueColor ? { color: valueColor } : {}]}>{value || '--'}</Text>
    </View>
  );
}

// ── Card ──────────────────────────────────────────────────────────
export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

// ── Section Header ────────────────────────────────────────────────
export function SectionHeader({ title, action }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action}
    </View>
  );
}

// ── Primary Button ────────────────────────────────────────────────
export function PrimaryBtn({ title, onPress, color, loading, disabled, style }) {
  const bg = color || COLORS.primary;
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading || disabled}
      style={[styles.primaryBtn, { backgroundColor: disabled ? '#aaa' : bg }, style]}
      activeOpacity={0.8}
    >
      {loading
        ? <ActivityIndicator color="#fff" size="small" />
        : <Text style={styles.primaryBtnText}>{title}</Text>
      }
    </TouchableOpacity>
  );
}

// ── Empty State ───────────────────────────────────────────────────
export function EmptyState({ icon, message }) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>{icon || '📭'}</Text>
      <Text style={styles.emptyText}>{message || 'No data found'}</Text>
    </View>
  );
}

// ── Loading ───────────────────────────────────────────────────────
export function Loading() {
  return (
    <View style={styles.loadingWrap}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
}

// ── Badge ─────────────────────────────────────────────────────────
export function Badge({ label, color }) {
  return (
    <View style={[styles.badge, { backgroundColor: (color || COLORS.primary) + '20',
        borderColor: (color || COLORS.primary) + '60' }]}>
      <Text style={[styles.badgeText, { color: color || COLORS.primary }]}>{label}</Text>
    </View>
  );
}

// ── Status Chip ───────────────────────────────────────────────────
export function StatusChip({ status }) {
  const map = {
    'Pending':       COLORS.gold,
    'Board Voting':  COLORS.secondary,
    'Board Approved':COLORS.primary,
    'Disbursed':     '#666',
    'Rejected':      COLORS.red,
    'Active':        COLORS.primary,
    'Closed':        '#888',
  };
  const color = map[status] || COLORS.muted;
  return (
    <View style={[styles.chip, { backgroundColor: color }]}>
      <Text style={styles.chipText}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    flex: 1,
    margin: 5,
  },
  statLabel: { fontSize: 11, color: COLORS.muted, fontWeight: '700',
    letterSpacing: 0.5, marginBottom: 6, textTransform: 'uppercase' },
  statValue: { fontSize: 17, fontWeight: 'bold' },

  infoRow: { flexDirection: 'row', paddingVertical: 5,
    borderBottomWidth: 1, borderBottomColor: COLORS.border },
  infoLabel: { width: 130, fontSize: 13, color: COLORS.muted },
  infoValue: { flex: 1, fontSize: 13, fontWeight: '600', color: COLORS.dark },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginVertical: 12 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: COLORS.dark },

  primaryBtn: {
    borderRadius: 10, paddingVertical: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  primaryBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },

  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 15, color: COLORS.muted, textAlign: 'center' },

  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  badge: { paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 6, borderWidth: 1, alignSelf: 'flex-start', marginRight: 6 },
  badgeText: { fontSize: 11, fontWeight: '700' },

  chip: { paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 6, alignSelf: 'flex-start' },
  chipText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
});
