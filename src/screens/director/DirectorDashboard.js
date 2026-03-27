import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, StyleSheet, TouchableOpacity } from 'react-native';
import { Api } from '../../services/api';
import { COLORS, Card, Loading, InfoRow } from '../../components';

export default function DirectorDashboard() {
  const [groups, setGroups]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expanded, setExpanded] = useState(null);

  async function load() {
    try { const g = await Api.getAllGroups(); setGroups(g); }
    catch {} setLoading(false); setRefreshing(false);
  }
  useEffect(() => { load(); }, []);
  const onRefresh = useCallback(() => { setRefreshing(true); load(); }, []);

  if (loading) return <Loading />;

  const totalMembers  = groups.reduce((s, g) => s + (parseInt(g.ActiveMembers) || 0), 0);
  const totalDeposits = groups.reduce((s, g) => s + (parseFloat(g.TotalDeposits) || 0), 0);
  const totalOutstanding = groups.reduce((s, g) => s + (parseFloat(g.Outstanding) || 0), 0);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.bg }}
      contentContainerStyle={{ padding: 16 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
    >
      <Text style={styles.heading}>Society Overview</Text>

      {/* Top stats */}
      <View style={styles.statsRow}>
        <View style={[styles.statBox, { borderLeftColor: COLORS.secondary }]}>
          <Text style={styles.statVal}>{groups.length}</Text>
          <Text style={styles.statLbl}>Groups</Text>
        </View>
        <View style={[styles.statBox, { borderLeftColor: COLORS.primary }]}>
          <Text style={styles.statVal}>{totalMembers}</Text>
          <Text style={styles.statLbl}>Members</Text>
        </View>
      </View>
      <View style={styles.statsRow}>
        <View style={[styles.statBox, { borderLeftColor: COLORS.gold }]}>
          <Text style={[styles.statVal, { fontSize: 14 }]}>{Api.fmtCurrency(totalDeposits)}</Text>
          <Text style={styles.statLbl}>Total Deposits</Text>
        </View>
        <View style={[styles.statBox, { borderLeftColor: COLORS.red }]}>
          <Text style={[styles.statVal, { fontSize: 14, color: COLORS.red }]}>{Api.fmtCurrency(totalOutstanding)}</Text>
          <Text style={styles.statLbl}>Outstanding</Text>
        </View>
      </View>

      <Text style={[styles.heading, { marginTop: 16 }]}>Group-wise Summary</Text>

      {groups.map(g => (
        <Card key={g.GroupID} style={{ marginBottom: 8 }}>
          <TouchableOpacity
            onPress={() => setExpanded(expanded === g.GroupID ? null : g.GroupID)}
            activeOpacity={0.8}
          >
            <View style={styles.groupHeader}>
              <View style={styles.groupAvatar}>
                <Text style={styles.groupAvatarText}>{g.GroupName?.[0]}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.groupName}>{g.GroupName}</Text>
                <Text style={styles.groupSub}>{g.ActiveMembers} members  •  {g.Area}</Text>
              </View>
              <Text style={{ color: COLORS.muted, fontSize: 20 }}>
                {expanded === g.GroupID ? '▲' : '▼'}
              </Text>
            </View>
          </TouchableOpacity>

          {expanded === g.GroupID && (
            <View style={{ marginTop: 12, borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 12 }}>
              <InfoRow label="Group Head"    value={g.GroupHead} />
              <InfoRow label="Head Mobile"   value={g.HeadMobile} />
              <InfoRow label="Total Deposits" value={Api.fmtCurrency(g.TotalDeposits)} valueColor={COLORS.primary} />
              <InfoRow label="Active Loans"  value={`${g.ActiveLoans}`} />
              <InfoRow label="Outstanding"   value={Api.fmtCurrency(g.Outstanding)} valueColor={COLORS.red} />
            </View>
          )}
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 17, fontWeight: 'bold', color: COLORS.dark, marginBottom: 12 },
  statsRow: { flexDirection: 'row', marginBottom: 8, gap: 8 },
  statBox: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: 12,
    padding: 14, borderLeftWidth: 4, elevation: 2,
  },
  statVal: { fontSize: 20, fontWeight: 'bold', color: COLORS.dark },
  statLbl: { fontSize: 11, color: COLORS.muted, marginTop: 3, textTransform: 'uppercase' },
  groupHeader: { flexDirection: 'row', alignItems: 'center' },
  groupAvatar: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: COLORS.primary + '18',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  groupAvatarText: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary },
  groupName: { fontWeight: 'bold', fontSize: 15, color: COLORS.dark },
  groupSub: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
});
