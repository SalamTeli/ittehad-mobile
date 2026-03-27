import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { Api } from '../../services/api';
import { COLORS, StatCard, Card, Loading } from '../../components';

export default function GroupDashboard({ route }) {
  const { groupId } = route.params;
  const [data, setData]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    try {
      const d = await Api.getGroupDashboard(groupId);
      setData(d);
    } catch {}
    setLoading(false); setRefreshing(false);
  }

  useEffect(() => { load(); }, []);
  const onRefresh = useCallback(() => { setRefreshing(true); load(); }, []);

  if (loading) return <Loading />;
  const s = data?.summary || {};
  const collected = parseFloat(s.collectedThisMonth) || 0;
  const expected  = parseFloat(s.expectedMonthly) || 1;
  const pct = Math.min(100, Math.round((collected / expected) * 100));
  const now = new Date();
  const monthLabel = now.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <ScrollView
      style={styles.bg}
      contentContainerStyle={{ padding: 16 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
    >
      {/* Month badge */}
      <View style={styles.monthBadge}>
        <Text style={styles.monthText}>📅  Collection Month: {monthLabel}</Text>
      </View>

      {/* Stats grid */}
      <View style={styles.grid}>
        <StatCard label="Members"     value={`${s.memberCount || 0}`}    color={COLORS.secondary} />
        <StatCard label="Per Member"  value={Api.fmtCurrency(s.monthlyAmountPerHead || 0)} color={COLORS.primary} />
      </View>
      <View style={styles.grid}>
        <StatCard label="Collected"   value={Api.fmtCurrency(s.collectedThisMonth || 0)} color={COLORS.primary} />
        <StatCard label="Pending"     value={Api.fmtCurrency(s.pendingThisMonth || 0)}   color={COLORS.gold} />
      </View>

      {/* Progress */}
      <Card>
        <Text style={styles.cardTitle}>Monthly Collection Progress</Text>
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${pct}%` }]} />
        </View>
        <Text style={styles.progressLabel}>{pct}% collected this month</Text>
      </Card>

      {/* Loans */}
      <Card>
        <Text style={styles.cardTitle}>Loan Status</Text>
        <View style={styles.grid}>
          <View style={styles.loanStat}>
            <Text style={[styles.loanVal, { color: COLORS.gold }]}>{s.activeLoans || 0}</Text>
            <Text style={styles.loanLbl}>Active Loans</Text>
          </View>
          <View style={styles.loanStat}>
            <Text style={[styles.loanVal, { color: COLORS.red }]}>{Api.fmtCurrency(s.totalOutstanding || 0)}</Text>
            <Text style={styles.loanLbl}>Outstanding</Text>
          </View>
        </View>
        <View style={[styles.grid, { marginTop: 12 }]}>
          <View style={styles.loanStat}>
            <Text style={[styles.loanVal, { color: COLORS.secondary, fontSize: 15 }]}>
              {s.pendingInstCount || 0} ({Api.fmtCurrency(s.pendingInstAmount || 0)})
            </Text>
            <Text style={styles.loanLbl}>Due This Month</Text>
          </View>
          <View style={styles.loanStat}>
            <Text style={[styles.loanVal, { color: COLORS.red, fontSize: 15 }]}>
              {s.overdueCount || 0} ({Api.fmtCurrency(s.overdueAmount || 0)})
            </Text>
            <Text style={styles.loanLbl}>Overdue</Text>
          </View>
        </View>
      </Card>

      {/* All time */}
      <Card style={styles.allTimeCard}>
        <Text style={styles.allTimeLabel}>Total Deposits (All Time)</Text>
        <Text style={styles.allTimeValue}>{Api.fmtCurrency(s.totalDepositsAllTime || 0)}</Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: COLORS.bg },
  monthBadge: {
    backgroundColor: COLORS.primary + '15', borderRadius: 10,
    padding: 12, marginBottom: 12, borderWidth: 1,
    borderColor: COLORS.primary + '40',
  },
  monthText: { color: COLORS.primary, fontWeight: '700', fontSize: 13 },
  grid: { flexDirection: 'row', marginBottom: 4 },
  cardTitle: { fontWeight: 'bold', fontSize: 14, marginBottom: 12, color: COLORS.dark },
  progressBg: { height: 14, backgroundColor: '#FFE0B2', borderRadius: 8, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 8 },
  progressLabel: { fontSize: 12, color: COLORS.muted, marginTop: 6 },
  loanStat: { flex: 1, alignItems: 'center' },
  loanVal: { fontSize: 18, fontWeight: 'bold' },
  loanLbl: { fontSize: 11, color: COLORS.muted, marginTop: 2 },
  allTimeCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  allTimeLabel: { fontSize: 14, color: COLORS.muted },
  allTimeValue: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary },
});
