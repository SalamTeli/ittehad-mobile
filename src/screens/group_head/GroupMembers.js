import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StyleSheet, RefreshControl, ScrollView,
} from 'react-native';
import { Api } from '../../services/api';
import { COLORS, Card, Loading, InfoRow, EmptyState, Badge, StatusChip } from '../../components';

// ── Member List ───────────────────────────────────────────────────
export default function GroupMembers({ route, navigation }) {
  const { groupId } = route.params;
  const [all, setAll]         = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch]   = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    try {
      const list = await Api.getGroupMembers(groupId);
      setAll(list); setFiltered(list);
    } catch {}
    setLoading(false); setRefreshing(false);
  }
  useEffect(() => { load(); }, []);
  const onRefresh = useCallback(() => { setRefreshing(true); load(); }, []);

  function doSearch(q) {
    setSearch(q);
    if (!q.trim()) { setFiltered(all); return; }
    const lower = q.toLowerCase();
    setFiltered(all.filter(m =>
      m.FullName?.toLowerCase().includes(lower) ||
      m.MemberID?.toLowerCase().includes(lower) ||
      m.Mobile?.includes(q)
    ));
  }

  if (loading) return <Loading />;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={doSearch}
          placeholder="Search by name, ID or mobile..."
          placeholderTextColor="#aaa"
        />
      </View>
      <Text style={styles.countText}>{filtered.length} members</Text>

      <FlatList
        data={filtered}
        keyExtractor={m => m.MemberID}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        contentContainerStyle={{ padding: 12 }}
        ListEmptyComponent={<EmptyState icon="👤" message="No members found" />}
        renderItem={({ item: m }) => {
          const hasLoan = parseFloat(m.OutstandingLoan) > 0;
          return (
            <TouchableOpacity
              style={[styles.memberCard, hasLoan && styles.memberCardLoan]}
              onPress={() => navigation.navigate('MemberDetail', { memberId: m.MemberID })}
              activeOpacity={0.8}
            >
              <View style={[styles.avatar, { backgroundColor: hasLoan ? '#FFF3E0' : COLORS.primary + '18' }]}>
                <Text style={[styles.avatarText, { color: hasLoan ? COLORS.gold : COLORS.primary }]}>
                  {m.FullName?.[0]?.toUpperCase() || '?'}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.memberName}>{m.FullName}</Text>
                <Text style={styles.memberSub}>{m.MemberID}  •  {m.Mobile || '--'}</Text>
                <View style={{ flexDirection: 'row', marginTop: 4, flexWrap: 'wrap' }}>
                  <Badge label={`Deposit: ${Api.fmtCurrency(m.TotalDeposited)}`} color={COLORS.primary} />
                  {hasLoan && <Badge label={`Loan: ${Api.fmtCurrency(m.OutstandingLoan)}`} color={COLORS.gold} />}
                </View>
              </View>
              <Text style={{ color: COLORS.muted, fontSize: 20 }}>›</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

// ── Member Detail ─────────────────────────────────────────────────
export function MemberDetailScreen({ route }) {
  const { memberId } = route.params;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);

  async function load() {
    try { const d = await Api.getMember(memberId); setData(d); } catch {}
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  if (loading) return <Loading />;
  const member   = data?.member || {};
  const deposits = data?.recentDeposits || [];
  const loans    = data?.loans || [];
  const pending  = data?.pendingInstallments || [];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      {/* Tab bar */}
      <View style={styles.tabBar}>
        {['Profile', 'Contribution', 'Loan'].map((t, i) => (
          <TouchableOpacity key={t} style={[styles.tabBtn, tab === i && styles.tabBtnActive]} onPress={() => setTab(i)}>
            <Text style={[styles.tabTxt, tab === i && styles.tabTxtActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {tab === 0 && (
          <Card>
            <InfoRow label="Member ID"   value={member.MemberID} />
            <InfoRow label="Name"        value={member.FullName} />
            <InfoRow label="Mobile"      value={member.Mobile} />
            <InfoRow label="Group"       value={member.GroupName} />
            <InfoRow label="Designation" value={member.Designation} />
            <InfoRow label="Join Date"   value={Api.fmtDate(member.JoinDate)} />
            <InfoRow label="Status"      value={member.Status}
              valueColor={member.Status === 'Active' ? COLORS.primary : COLORS.red} />
          </Card>
        )}

        {tab === 1 && (
          <>
            <Card style={styles.totalCard}>
              <Text style={styles.totalLabel}>Total Contributions</Text>
              <Text style={styles.totalValue}>
                {Api.fmtCurrency(deposits.reduce((s, d) => s + parseFloat(d.Amount || 0), 0))}
              </Text>
            </Card>
            {deposits.length === 0
              ? <EmptyState icon="💳" message="No deposits recorded yet" />
              : deposits.map((d, i) => (
                <Card key={i} style={styles.depCard}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.depDate}>{Api.fmtDate(d.DepositDate)}</Text>
                    <Text style={styles.depAmt}>{Api.fmtCurrency(d.Amount)}</Text>
                  </View>
                  <Text style={styles.depSub}>{d.ReceiptNumber}  •  {d.PaymentMode}</Text>
                </Card>
              ))
            }
          </>
        )}

        {tab === 2 && (
          loans.length === 0
            ? <EmptyState icon="✅" message="No active loans" />
            : <>
                {loans.map((l, i) => (
                  <Card key={i} style={{ borderLeftWidth: 4, borderLeftColor: COLORS.gold }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                      <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{l.LoanID}</Text>
                      <StatusChip status={l.Status} />
                    </View>
                    <InfoRow label="Loan Amount"  value={Api.fmtCurrency(l.LoanAmount)} />
                    <InfoRow label="Outstanding"  value={Api.fmtCurrency(l.OutstandingAmount)} valueColor={COLORS.red} />
                    <InfoRow label="Installment"  value={Api.fmtCurrency(l.InstallmentAmount)} />
                    <InfoRow label="Months"       value={`${l.RepaymentMonths} months`} />
                    <InfoRow label="Disbursed"    value={Api.fmtDate(l.DisbursementDate)} />
                  </Card>
                ))}
                {pending.length > 0 && <>
                  <Text style={styles.pendingHead}>Pending Installments ({pending.length})</Text>
                  {pending.map((p, i) => (
                    <Card key={i} style={{ borderLeftWidth: 4, borderLeftColor: COLORS.red }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text>{p.LoanID} — Inst #{p.InstallmentNo}</Text>
                        <Text style={{ color: COLORS.red, fontWeight: 'bold' }}>{Api.fmtCurrency(p.DueAmount)}</Text>
                      </View>
                      <Text style={{ color: COLORS.muted, fontSize: 12, marginTop: 2 }}>
                        Due: {Api.fmtDate(p.DueDate)}
                      </Text>
                    </Card>
                  ))}
                </>}
              </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  searchBar: { padding: 12, paddingBottom: 4 },
  searchInput: {
    backgroundColor: COLORS.surface, borderRadius: 10,
    padding: 12, fontSize: 14, borderWidth: 1, borderColor: COLORS.border,
  },
  countText: { paddingHorizontal: 16, fontSize: 12, color: COLORS.muted, marginBottom: 4 },
  memberCard: {
    backgroundColor: COLORS.surface, borderRadius: 12, padding: 14,
    flexDirection: 'row', alignItems: 'center', marginBottom: 8,
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07, shadowRadius: 4,
  },
  memberCardLoan: { borderLeftWidth: 4, borderLeftColor: COLORS.gold },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center',
    justifyContent: 'center', marginRight: 12 },
  avatarText: { fontSize: 18, fontWeight: 'bold' },
  memberName: { fontWeight: '700', fontSize: 15, color: COLORS.dark },
  memberSub: { fontSize: 12, color: COLORS.muted, marginTop: 2 },

  tabBar: { flexDirection: 'row', backgroundColor: COLORS.surface,
    borderBottomWidth: 1, borderBottomColor: COLORS.border },
  tabBtn: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabBtnActive: { borderBottomWidth: 2, borderBottomColor: COLORS.primary },
  tabTxt: { fontSize: 14, color: COLORS.muted },
  tabTxtActive: { color: COLORS.primary, fontWeight: 'bold' },

  totalCard: { flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', backgroundColor: COLORS.primary + '12' },
  totalLabel: { fontSize: 14, color: COLORS.muted },
  totalValue: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary },

  depCard: { paddingVertical: 10 },
  depDate: { fontSize: 14, color: COLORS.dark },
  depAmt: { fontSize: 15, fontWeight: 'bold', color: COLORS.primary },
  depSub: { fontSize: 11, color: COLORS.muted, marginTop: 2 },

  pendingHead: { fontWeight: 'bold', fontSize: 14, marginVertical: 10, color: COLORS.dark },
});
