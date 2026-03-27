import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, TextInput,
  StyleSheet, Alert, RefreshControl, ScrollView,
} from 'react-native';
import { Api } from '../../services/api';
import { COLORS, Card, Loading, InfoRow, EmptyState, StatusChip, PrimaryBtn } from '../../components';

export default function LoanVoting() {
  const [apps, setApps]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState(null);
  const [remarks, setRemarks]   = useState('');
  const [voting, setVoting]     = useState(false);

  async function load() {
    try { const a = await Api.getPendingLoans(); setApps(a); }
    catch {} setLoading(false); setRefreshing(false);
  }
  useEffect(() => { load(); }, []);
  const onRefresh = useCallback(() => { setRefreshing(true); load(); }, []);

  async function castVote(decision) {
    if (!selected) return;
    const myMid = Api.getUser()?.memberID;
    const already = selected.votes?.find(v => v.DirectorID === myMid);
    if (already) { Alert.alert('Already Voted', 'You have already voted on this application.'); return; }

    Alert.alert(
      `Confirm ${decision}`,
      `${decision} application ${selected.ApplicationID}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: decision, style: decision === 'Reject' ? 'destructive' : 'default',
          onPress: async () => {
            setVoting(true);
            try {
              const res = await Api.castVote(selected.ApplicationID, decision, remarks);
              if (res.success) {
                Alert.alert('Vote Cast! ✅', `Decision: ${decision}\nNew Status: ${res.newStatus}`);
                setRemarks(''); setSelected(null); load();
              } else {
                Alert.alert('Error', res.message || 'Vote failed.');
              }
            } catch { Alert.alert('Error', 'Connection failed.'); }
            setVoting(false);
          }},
      ]
    );
  }

  if (loading) return <Loading />;

  const myMid = Api.getUser()?.memberID;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <FlatList
        data={apps}
        keyExtractor={a => a.ApplicationID}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 12 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        ListEmptyComponent={<EmptyState icon="🗳️" message="No pending loan applications" />}
        renderItem={({ item: app }) => {
          const votes    = app.votes || [];
          const approves = votes.filter(v => v.Decision === 'Approve').length;
          const rejects  = votes.filter(v => v.Decision === 'Reject').length;
          const threshold = app.voteThreshold || 3;
          const myVote   = votes.find(v => v.DirectorID === myMid);
          const isSelected = selected?.ApplicationID === app.ApplicationID;

          return (
            <TouchableOpacity onPress={() => { setSelected(isSelected ? null : app); setRemarks(''); }} activeOpacity={0.85}>
              <Card style={[styles.appCard, isSelected && styles.appCardSelected]}>
                {/* Header */}
                <View style={styles.appHeader}>
                  <Text style={styles.appId}>{app.ApplicationID}</Text>
                  <StatusChip status={app.Status} />
                </View>

                <InfoRow label="Borrower" value={`${app.MemberName}  ${app.Mobile || ''}`} />
                <InfoRow label="Group"    value={app.GroupName} />
                <InfoRow label="Amount"   value={Api.fmtCurrency(app.LoanAmount)} valueColor={COLORS.primary} />
                <InfoRow label="Months"   value={`${app.RepaymentMonths} months`} />
                <InfoRow label="Purpose"  value={app.Purpose} />
                <InfoRow label="Applied"  value={Api.fmtDate(app.ApplicationDate)} />

                {/* Guarantors */}
                {(app.guarantors || []).map((g, i) => (
                  <InfoRow key={i} label={`Guarantor ${g.GuarantorOrder}`} value={g.GuarantorName} />
                ))}

                {/* Vote tally */}
                <View style={styles.voteRow}>
                  <View style={[styles.voteBadge, { backgroundColor: COLORS.primary + '18' }]}>
                    <Text style={[styles.voteNum, { color: COLORS.primary }]}>{approves}</Text>
                    <Text style={styles.voteLbl}>Approved</Text>
                  </View>
                  <View style={[styles.voteBadge, { backgroundColor: COLORS.red + '18' }]}>
                    <Text style={[styles.voteNum, { color: COLORS.red }]}>{rejects}</Text>
                    <Text style={styles.voteLbl}>Rejected</Text>
                  </View>
                  <Text style={styles.thresholdTxt}>Need {threshold} to decide</Text>
                </View>

                {/* Votes list */}
                {votes.length > 0 && votes.map((v, i) => (
                  <View key={i} style={styles.voteItem}>
                    <Text style={{ fontSize: 16 }}>{v.Decision === 'Approve' ? '👍' : '👎'}</Text>
                    <Text style={styles.voteItemTxt}>{v.DirectorName} — {v.Decision}</Text>
                  </View>
                ))}

                {/* My vote indicator or buttons */}
                {myVote ? (
                  <View style={styles.myVoteBox}>
                    <Text style={styles.myVoteTxt}>
                      ✅ Your vote: {myVote.Decision}
                    </Text>
                  </View>
                ) : isSelected && (
                  <View style={styles.voteSection}>
                    <TextInput
                      style={styles.remarksInput}
                      value={remarks}
                      onChangeText={setRemarks}
                      placeholder="Remarks (optional)..."
                      placeholderTextColor="#aaa"
                    />
                    <View style={styles.voteButtons}>
                      <TouchableOpacity
                        style={[styles.voteBtn, { backgroundColor: COLORS.primary }]}
                        onPress={() => castVote('Approve')}
                        disabled={voting}
                      >
                        <Text style={styles.voteBtnTxt}>👍  APPROVE</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.voteBtn, { backgroundColor: COLORS.red }]}
                        onPress={() => castVote('Reject')}
                        disabled={voting}
                      >
                        <Text style={styles.voteBtnTxt}>👎  REJECT</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </Card>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  appCard: { marginBottom: 12 },
  appCardSelected: { borderWidth: 2, borderColor: COLORS.primary },
  appHeader: { flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 8 },
  appId: { fontWeight: 'bold', fontSize: 16, color: COLORS.dark },
  voteRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 8 },
  voteBadge: { borderRadius: 8, padding: 8, alignItems: 'center', minWidth: 70 },
  voteNum: { fontSize: 20, fontWeight: 'bold' },
  voteLbl: { fontSize: 11, color: COLORS.muted },
  thresholdTxt: { fontSize: 12, color: COLORS.muted, flex: 1, textAlign: 'right' },
  voteItem: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 6 },
  voteItemTxt: { fontSize: 13, color: COLORS.dark },
  myVoteBox: { backgroundColor: COLORS.primary + '15', borderRadius: 8,
    padding: 10, marginTop: 10 },
  myVoteTxt: { color: COLORS.primary, fontWeight: 'bold', fontSize: 13 },
  voteSection: { marginTop: 12, borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 12 },
  remarksInput: {
    borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 10,
    padding: 10, fontSize: 14, color: COLORS.dark, backgroundColor: COLORS.bg, marginBottom: 10,
  },
  voteButtons: { flexDirection: 'row', gap: 10 },
  voteBtn: { flex: 1, borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  voteBtnTxt: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});
