import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Api } from '../../services/api';
import { COLORS, Loading, Card, InfoRow, EmptyState } from '../../components';

export default function AllGroups({ navigation }) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    try { const g = await Api.getAllGroups(); setGroups(g); }
    catch {} setLoading(false); setRefreshing(false);
  }
  useEffect(() => { load(); }, []);

  if (loading) return <Loading />;

  return (
    <FlatList
      data={groups}
      keyExtractor={g => String(g.GroupID)}
      style={{ backgroundColor: COLORS.bg }}
      contentContainerStyle={{ padding: 12 }}
      refreshControl={<RefreshControl refreshing={refreshing}
        onRefresh={() => { setRefreshing(true); load(); }} tintColor={COLORS.primary} />}
      ListEmptyComponent={<EmptyState icon="🏘️" message="No groups found" />}
      renderItem={({ item: g }) => (
        <TouchableOpacity
          onPress={() => navigation.navigate('GroupDetail', { groupId: g.GroupID, groupName: g.GroupName })}
          activeOpacity={0.85}
        >
          <Card style={{ marginBottom: 10 }}>
            <View style={styles.header}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{g.GroupName?.[0]}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{g.GroupName}</Text>
                <Text style={styles.sub}>{g.Area}  •  {g.ActiveMembers} members</Text>
                <Text style={styles.sub2}>Head: {g.GroupHead}  {g.HeadMobile}</Text>
              </View>
              <Text style={{ color: COLORS.muted, fontSize: 22 }}>›</Text>
            </View>
            <View style={styles.chips}>
              <View style={styles.chip}>
                <Text style={[styles.chipTxt, { color: COLORS.primary }]}>
                  💰 {Api.fmtCurrency(g.TotalDeposits)}
                </Text>
              </View>
              {parseFloat(g.Outstanding) > 0 && (
                <View style={[styles.chip, { backgroundColor: COLORS.red + '15' }]}>
                  <Text style={[styles.chipTxt, { color: COLORS.red }]}>
                    📋 {Api.fmtCurrency(g.Outstanding)}
                  </Text>
                </View>
              )}
            </View>
          </Card>
        </TouchableOpacity>
      )}
    />
  );
}

// ── Group Detail Screen ───────────────────────────────────────────
export function GroupDetailScreen({ route, navigation }) {
  const { groupId, groupName } = route.params;
  const [tab, setTab]   = useState(0);
  const [members, setMembers] = useState([]);
  const [deps, setDeps] = useState(null);
  const [dash, setDash] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({ title: groupName });
    Promise.all([
      Api.getGroupDashboard(groupId),
      Api.getGroupMembers(groupId),
      Api.getGroupDeposits(groupId),
    ]).then(([d, m, dep]) => {
      setDash(d); setMembers(m); setDeps(dep);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  const s = dash?.summary || {};

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <View style={styles2.tabBar}>
        {['Dashboard', 'Members', 'Deposits'].map((t, i) => (
          <TouchableOpacity key={t} style={[styles2.tab, tab === i && styles2.tabActive]} onPress={() => setTab(i)}>
            <Text style={[styles2.tabTxt, tab === i && styles2.tabTxtActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {tab === 0 && (
          <Card>
            <InfoRow label="Members"        value={`${s.memberCount || 0}`} />
            <InfoRow label="Monthly Amt"    value={Api.fmtCurrency(s.monthlyAmountPerHead)} />
            <InfoRow label="Collected"      value={Api.fmtCurrency(s.collectedThisMonth)} valueColor={COLORS.primary} />
            <InfoRow label="Pending"        value={Api.fmtCurrency(s.pendingThisMonth)} valueColor={COLORS.gold} />
            <InfoRow label="All-time Dep."  value={Api.fmtCurrency(s.totalDepositsAllTime)} />
            <InfoRow label="Active Loans"   value={`${s.activeLoans || 0}`} />
            <InfoRow label="Outstanding"    value={Api.fmtCurrency(s.totalOutstanding)} valueColor={COLORS.red} />
          </Card>
        )}
        {tab === 1 && members.map((m, i) => (
          <Card key={i} style={{ marginBottom: 8 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 14 }}>{m.FullName}</Text>
            <Text style={{ color: COLORS.muted, fontSize: 12 }}>{m.MemberID}  •  {m.Mobile}</Text>
            <Text style={{ color: COLORS.primary, marginTop: 4 }}>
              Deposited: {Api.fmtCurrency(m.TotalDeposited)}
              {parseFloat(m.OutstandingLoan) > 0 ? `  |  Loan: ${Api.fmtCurrency(m.OutstandingLoan)}` : ''}
            </Text>
          </Card>
        ))}
        {tab === 2 && (deps?.deposits || []).map((d, i) => (
          <Card key={i} style={{ marginBottom: 8 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontWeight: '600' }}>{d.MemberName}</Text>
              <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>{Api.fmtCurrency(d.Amount)}</Text>
            </View>
            <Text style={{ color: COLORS.muted, fontSize: 12 }}>{Api.fmtDate(d.DepositDate)}  •  {d.PaymentMode}</Text>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 46, height: 46, borderRadius: 23,
    backgroundColor: COLORS.primary + '18', alignItems: 'center',
    justifyContent: 'center', marginRight: 12 },
  avatarText: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },
  name: { fontWeight: 'bold', fontSize: 15, color: COLORS.dark },
  sub:  { fontSize: 12, color: COLORS.muted, marginTop: 1 },
  sub2: { fontSize: 11, color: COLORS.muted },
  chips: { flexDirection: 'row', marginTop: 10, gap: 8 },
  chip: { backgroundColor: COLORS.primary + '15', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  chipTxt: { fontSize: 12, fontWeight: '700' },
});

const styles2 = StyleSheet.create({
  tabBar: { flexDirection: 'row', backgroundColor: COLORS.surface,
    borderBottomWidth: 1, borderBottomColor: COLORS.border },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: COLORS.primary },
  tabTxt: { fontSize: 14, color: COLORS.muted },
  tabTxtActive: { color: COLORS.primary, fontWeight: 'bold' },
});
