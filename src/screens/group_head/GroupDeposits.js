import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { Api } from '../../services/api';
import { COLORS, Card, Loading, EmptyState } from '../../components';

export default function GroupDeposits({ route }) {
  const { groupId } = route.params;
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [month, setMonth]     = useState(Api.currentMonth());

  async function load(m) {
    try {
      const d = await Api.getGroupDeposits(groupId, m || month);
      setData(d);
    } catch {}
    setLoading(false); setRefreshing(false);
  }

  useEffect(() => { load(); }, [month]);
  const onRefresh = useCallback(() => { setRefreshing(true); load(); }, [month]);

  function prevMonth() {
    const [y, m] = month.split('-').map(Number);
    const d = new Date(y, m - 2, 1);
    setMonth(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`);
  }
  function nextMonth() {
    const [y, m] = month.split('-').map(Number);
    const now = new Date();
    if (y >= now.getFullYear() && m >= now.getMonth()+1) return;
    const d = new Date(y, m, 1);
    setMonth(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`);
  }

  if (loading) return <Loading />;
  const deposits = data?.deposits || [];
  const total    = parseFloat(data?.total) || 0;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      {/* Month nav */}
      <View style={styles.monthNav}>
        <TouchableOpacity onPress={prevMonth} style={styles.navBtn}>
          <Text style={styles.navArrow}>‹</Text>
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.monthLabel}>{Api.monthLabel(month)}</Text>
          <Text style={styles.txCount}>{deposits.length} transactions</Text>
        </View>
        <TouchableOpacity onPress={nextMonth} style={styles.navBtn}>
          <Text style={styles.navArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Total */}
      <View style={styles.totalBanner}>
        <Text style={styles.totalLbl}>Total Collected</Text>
        <Text style={styles.totalVal}>{Api.fmtCurrency(total)}</Text>
      </View>

      <FlatList
        data={deposits}
        keyExtractor={(_, i) => String(i)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        contentContainerStyle={{ padding: 12, paddingBottom: 24 }}
        ListEmptyComponent={<EmptyState icon="💳" message={`No deposits in ${Api.monthLabel(month)}`} />}
        renderItem={({ item: d }) => (
          <Card style={styles.depCard}>
            <View style={styles.depRow}>
              <View style={styles.depLeft}>
                <Text style={styles.depName}>{d.MemberName}</Text>
                <Text style={styles.depSub}>{d.MemberID}  •  {Api.fmtDate(d.DepositDate)}</Text>
                <Text style={styles.depSub}>{d.ReceiptNumber}  •  {d.PaymentMode}</Text>
              </View>
              <Text style={styles.depAmt}>{Api.fmtCurrency(d.Amount)}</Text>
            </View>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  monthNav: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.primary + '12', padding: 12,
  },
  navBtn: { padding: 8 },
  navArrow: { fontSize: 28, color: COLORS.primary, fontWeight: 'bold' },
  monthLabel: { fontSize: 17, fontWeight: 'bold', color: COLORS.primary },
  txCount: { fontSize: 12, color: COLORS.muted },
  totalBanner: {
    backgroundColor: COLORS.primary, flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'center', padding: 16,
  },
  totalLbl: { color: 'rgba(255,255,255,0.8)', fontSize: 13 },
  totalVal: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  depCard: { marginBottom: 8 },
  depRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  depLeft: { flex: 1 },
  depName: { fontWeight: '700', fontSize: 14, color: COLORS.dark },
  depSub: { fontSize: 12, color: COLORS.muted, marginTop: 1 },
  depAmt: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary },
});
