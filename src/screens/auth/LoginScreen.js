import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Animated, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Api } from '../../services/api';
import { COLORS } from '../../components';
import { randomQuote } from '../../services/quotes';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [showPass, setShowPass] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1, duration: 800, useNativeDriver: true,
    }).start();
  }, []);

  async function handleLogin() {
    if (!username.trim() || !password) {
      setError('Enter username and password.'); return;
    }
    setLoading(true); setError('');
    try {
      const result = await Api.login(username.trim(), password);
      if (result.success) {
        // Show quote splash then navigate
        navigation.replace('QuoteSplash');
      } else {
        setError(result.message || 'Invalid username or password.');
      }
    } catch (e) {
      setError('Cannot connect to server.\nCheck if API is running on PC.');
    }
    setLoading(false);
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>

          {/* Logo */}
          <View style={styles.logoBox}>
            <Text style={styles.logoIcon}>🏦</Text>
          </View>
          <Text style={styles.appName}>Ittehad Financial Services</Text>
          <Text style={styles.tagline}>Directors & Group Heads Portal</Text>
          <Text style={styles.tagline2}>Interest-Free Community Finance</Text>

          {/* Form */}
          <View style={styles.card}>
            <Text style={styles.fieldLabel}>USERNAME</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Enter username"
              placeholderTextColor="#aaa"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={[styles.fieldLabel, { marginTop: 16 }]}>PASSWORD</Text>
            <View style={styles.passRow}>
              <TextInput
                style={[styles.input, { flex: 1, marginBottom: 0 }]}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter password"
                placeholderTextColor="#aaa"
                secureTextEntry={!showPass}
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
                <Text style={{ fontSize: 18 }}>{showPass ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>

            {!!error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>⚠️  {error}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.loginBtn, loading && { opacity: 0.7 }]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              <Text style={styles.loginBtnText}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.hint}>💡 Default: admin / admin123</Text>
          </View>

        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  container: { alignItems: 'center' },
  logoBox: {
    width: 88, height: 88, borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16, elevation: 6,
  },
  logoIcon: { fontSize: 44 },
  appName: { fontSize: 22, fontWeight: 'bold', color: COLORS.dark,
    textAlign: 'center', marginBottom: 4 },
  tagline: { fontSize: 13, color: COLORS.muted, marginBottom: 2 },
  tagline2: { fontSize: 12, color: COLORS.primary, marginBottom: 28, fontStyle: 'italic' },

  card: {
    width: '100%', backgroundColor: COLORS.surface,
    borderRadius: 16, padding: 24, elevation: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 8,
  },
  fieldLabel: { fontSize: 11, color: COLORS.muted, fontWeight: '700',
    letterSpacing: 1, marginBottom: 6 },
  input: {
    borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 10,
    padding: 13, fontSize: 15, color: COLORS.dark,
    backgroundColor: COLORS.bg, marginBottom: 4,
  },
  passRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  eyeBtn: { padding: 10 },
  errorBox: {
    backgroundColor: '#FFF0F0', borderRadius: 8, padding: 12,
    marginTop: 14, borderWidth: 1, borderColor: '#FFCCCC',
  },
  errorText: { color: COLORS.red, fontSize: 13, lineHeight: 20 },
  loginBtn: {
    backgroundColor: COLORS.primary, borderRadius: 12,
    paddingVertical: 16, alignItems: 'center', marginTop: 20,
    elevation: 3,
  },
  loginBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  hint: { textAlign: 'center', color: COLORS.muted, fontSize: 12, marginTop: 16 },
});
