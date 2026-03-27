import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Alert, ActivityIndicator,
} from 'react-native';
import { Api } from '../../services/api';
import { COLORS, Card, PrimaryBtn, Loading } from '../../components';

export default function LoanApply({ route }) {
  const { groupId } = route.params;
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [borrower, setBorrower] = useState(null);
  const [g1, setG1] = useState(null);
  const [g2, setG2] = useState(null);
  const [amount, setAmount]   = useState('');
  const [months,  setMonths]  = useState('12');
  const [purpose, setPurpose] = useState('');

  useEffect(() => {
    Api.getGroupMembers(groupId).then(list => {
      setMembers(list); setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  function MemberPicker({ label, value, setValue, exclude = [] }) {
    const [open, setOpen] = useState(false);
    const available = members.filter(m => !exclude.includes(m.MemberID));
    return (
      <View style={{ marginBottom: 14 }}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <TouchableOpacity style={styles.picker} onPress={() => setOpen(!open)}>
          <Text style={value ? styles.pickerSelected : styles.pickerPlaceholder}>
            {value ? `${value.MemberID} - ${value.FullName}` : `Select ${label}`}
          </Text>
          <Text style={{ color: COLORS.muted }}>{open ? '▲' : '▼'}</Text>
        </TouchableOpacity>
        {open && (
          <View style={styles.dropdown}>
            {available.map(m => (
              <TouchableOpacity
                key={m.MemberID}
                style={styles.dropItem}
                onPress={() => { setValue(m); setOpen(false); }}
              >
                <Text style={styles.dropItemText}>{m.MemberID} - {m.FullName}</Text>
                <Text style={styles.dropItemSub}>Deposit: {Api.fmtCurrency(m.TotalDeposited)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  }

  async function submit() {
    if (!borrower || !g1 || !g2) { Alert.alert('Error', 'Select borrower and both guarantors.'); return; }
    if (!amount || parseFloat(amount) <= 0) { Alert.alert('Error', 'Enter valid loan amount.'); return; }
    if (!purpose.trim()) { Alert.alert('Error', 'Enter purpose of loan.'); return; }
    if (g1.MemberID === g2.MemberID) { Alert.alert('Error', 'Guarantor 1 and 2 must be different.'); return; }

    Alert.alert(
      'Confirm Application',
      `Borrower: ${borrower.FullName}\nAmount: ${Api.fmtCurrency(amount)}\nMonths: ${months}\nPurpose: ${purpose}\n\nGuarantor 1: ${g1.FullName}\nGuarantor 2: ${g2.FullName}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Submit', onPress: doSubmit },
      ]
    );
  }

  async function doSubmit() {
    setSubmitting(true);
    try {
      const res = await Api.applyLoan({
        memberID: borrower.MemberID,
        guarantor1: g1.MemberID,
        guarantor2: g2.MemberID,
        loanAmount: parseFloat(amount),
        purpose: purpose.trim(),
        months: parseInt(months) || 12,
        submittedBy: Api.getUser()?.memberID,
      });
      if (res.success) {
        Alert.alert('Success! ✅', `Application submitted!\nID: ${res.applicationID}`, [
          { text: 'OK', onPress: reset }
        ]);
      } else {
        Alert.alert('Error', res.message || 'Submission failed.');
      }
    } catch {
      Alert.alert('Error', 'Connection failed. Check server.');
    }
    setSubmitting(false);
  }

  function reset() {
    setBorrower(null); setG1(null); setG2(null);
    setAmount(''); setPurpose(''); setMonths('12');
  }

  if (loading) return <Loading />;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.bg }}
      contentContainerStyle={{ padding: 16 }}>

      <View style={styles.infoBanner}>
        <Text style={styles.infoText}>
          ℹ️  Submit loan application on behalf of a group member. Directors will vote to approve or reject.
        </Text>
      </View>

      <Card>
        <MemberPicker label="Borrower *" value={borrower} setValue={setBorrower}
          exclude={[g1?.MemberID, g2?.MemberID].filter(Boolean)} />

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.fieldLabel}>Loan Amount (Rs.) *</Text>
            <TextInput
              style={styles.input} value={amount} onChangeText={setAmount}
              placeholder="0.00" keyboardType="numeric" placeholderTextColor="#aaa"
            />
          </View>
          <View style={{ width: 100 }}>
            <Text style={styles.fieldLabel}>Months *</Text>
            <TextInput
              style={styles.input} value={months} onChangeText={setMonths}
              keyboardType="numeric" placeholderTextColor="#aaa"
            />
          </View>
        </View>

        <Text style={styles.fieldLabel}>Purpose *</Text>
        <TextInput
          style={[styles.input, styles.textArea]} value={purpose}
          onChangeText={setPurpose} multiline numberOfLines={3}
          placeholder="Describe the purpose..." placeholderTextColor="#aaa"
        />

        <MemberPicker label="Guarantor 1 *" value={g1} setValue={setG1}
          exclude={[borrower?.MemberID, g2?.MemberID].filter(Boolean)} />

        <MemberPicker label="Guarantor 2 *" value={g2} setValue={setG2}
          exclude={[borrower?.MemberID, g1?.MemberID].filter(Boolean)} />

        <View style={{ marginTop: 8 }}>
          <PrimaryBtn title={submitting ? 'Submitting...' : 'Submit Application'}
            onPress={submit} loading={submitting} />
        </View>
        <TouchableOpacity onPress={reset} style={{ alignItems: 'center', marginTop: 10 }}>
          <Text style={{ color: COLORS.muted }}>Reset Form</Text>
        </TouchableOpacity>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  infoBanner: {
    backgroundColor: '#E3F2FD', borderRadius: 10, padding: 12,
    marginBottom: 14, borderWidth: 1, borderColor: '#BBDEFB',
  },
  infoText: { color: '#1565C0', fontSize: 13, lineHeight: 20 },
  fieldLabel: { fontSize: 12, color: COLORS.muted, fontWeight: '700',
    marginBottom: 6, letterSpacing: 0.5, textTransform: 'uppercase' },
  input: {
    borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 10,
    padding: 12, fontSize: 14, color: COLORS.dark, backgroundColor: COLORS.bg,
    marginBottom: 14,
  },
  textArea: { height: 80, textAlignVertical: 'top' },
  row: { flexDirection: 'row' },
  picker: {
    borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 10,
    padding: 12, flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', backgroundColor: COLORS.bg, marginBottom: 4,
  },
  pickerSelected: { fontSize: 14, color: COLORS.dark },
  pickerPlaceholder: { fontSize: 14, color: '#aaa' },
  dropdown: {
    borderWidth: 1, borderColor: COLORS.border, borderRadius: 10,
    backgroundColor: COLORS.surface, maxHeight: 200, marginBottom: 14,
    overflow: 'hidden',
  },
  dropItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  dropItemText: { fontSize: 14, color: COLORS.dark, fontWeight: '600' },
  dropItemSub: { fontSize: 11, color: COLORS.muted, marginTop: 1 },
});
