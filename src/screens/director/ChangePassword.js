import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import { Api } from '../../services/api';
import { COLORS, Card, PrimaryBtn } from '../../components';

export default function ChangePassword() {
  const [old,     setOld]     = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const user = Api.getUser();

  async function submit() {
    if (!old || !newPass || !confirm) { Alert.alert('Error', 'All fields are required.'); return; }
    if (newPass.length < 6) { Alert.alert('Error', 'New password must be at least 6 characters.'); return; }
    if (newPass !== confirm) { Alert.alert('Error', 'Passwords do not match.'); return; }
    if (old === newPass) { Alert.alert('Error', 'New password must be different.'); return; }

    setLoading(true);
    try {
      const res = await Api.changePassword(old, newPass);
      if (res.success) {
        Alert.alert('Success ✅', 'Password changed successfully!');
        setOld(''); setNewPass(''); setConfirm('');
      } else {
        Alert.alert('Error', res.message || 'Failed to change password.');
      }
    } catch { Alert.alert('Error', 'Connection failed.'); }
    setLoading(false);
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.bg }} contentContainerStyle={{ padding: 20 }}>
      {/* User info */}
      <Card style={styles.userCard}>
        <Text style={styles.userName}>{user?.fullName || ''}</Text>
        <Text style={styles.userRole}>{user?.role || ''}  •  {user?.username || ''}</Text>
      </Card>

      <Card>
        <Text style={styles.label}>CURRENT PASSWORD</Text>
        <TextInput style={styles.input} value={old} onChangeText={setOld}
          secureTextEntry placeholder="Enter current password" placeholderTextColor="#aaa" />

        <Text style={styles.label}>NEW PASSWORD</Text>
        <TextInput style={styles.input} value={newPass} onChangeText={setNewPass}
          secureTextEntry placeholder="Minimum 6 characters" placeholderTextColor="#aaa" />

        <Text style={styles.label}>CONFIRM NEW PASSWORD</Text>
        <TextInput style={styles.input} value={confirm} onChangeText={setConfirm}
          secureTextEntry placeholder="Re-enter new password" placeholderTextColor="#aaa"
          onSubmitEditing={submit} />

        <PrimaryBtn title={loading ? 'Saving...' : 'Change Password'}
          onPress={submit} loading={loading} style={{ marginTop: 8 }} />
      </Card>

      {/* Tips */}
      <Card style={styles.tipsCard}>
        <Text style={styles.tipsHead}>💡 Password Tips</Text>
        {['Use at least 6 characters',
          'Mix letters and numbers',
          'Do not use your mobile number',
          'Do not share your password'].map((t, i) => (
          <Text key={i} style={styles.tip}>•  {t}</Text>
        ))}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  userCard: { flexDirection: 'row', alignItems: 'center',
    borderLeftWidth: 4, borderLeftColor: COLORS.primary },
  userName: { fontSize: 16, fontWeight: 'bold', color: COLORS.dark },
  userRole: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  label: { fontSize: 11, color: COLORS.muted, fontWeight: '700',
    letterSpacing: 0.8, marginBottom: 6, marginTop: 4 },
  input: {
    borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 10,
    padding: 13, fontSize: 14, color: COLORS.dark,
    backgroundColor: COLORS.bg, marginBottom: 14,
  },
  tipsCard: { backgroundColor: '#FFFDE7', borderLeftWidth: 4, borderLeftColor: COLORS.gold },
  tipsHead: { fontWeight: 'bold', color: COLORS.gold, marginBottom: 8, fontSize: 14 },
  tip: { fontSize: 13, color: COLORS.dark, marginVertical: 2 },
});
