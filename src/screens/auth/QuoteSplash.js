import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Animated, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { Api } from '../../services/api';
import { randomQuote } from '../../services/quotes';

export default function QuoteSplash({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [quote]  = useState(randomQuote());

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    Animated.timing(fadeAnim, {
      toValue: 1, duration: 900, useNativeDriver: true,
    }).start();
  }, []);

  function proceed() {
    const screen = Api.isDirector() ? 'DirectorHome' : 'GroupHome';
    navigation.replace(screen);
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#0D2118" barStyle="light-content" />
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>

        {/* Icon */}
        <View style={styles.iconBox}>
          <Text style={styles.iconText}>📖</Text>
        </View>

        {/* Source */}
        <View style={styles.sourceBadge}>
          <Text style={styles.sourceType}>{quote.source}</Text>
        </View>
        <Text style={styles.ref}>{quote.ref}</Text>

        {/* Arabic */}
        <Text style={styles.arabic}>{quote.arabic}</Text>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Translation */}
        <Text style={styles.translation}>"{quote.translation}"</Text>

        {/* Continue */}
        <TouchableOpacity style={styles.continueBtn} onPress={proceed} activeOpacity={0.8}>
          <Text style={styles.continueText}>Continue  →</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>Ittehad Financial Services — Interest Free</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D2118' },
  content: {
    flex: 1, padding: 28,
    alignItems: 'center', justifyContent: 'center',
  },
  iconBox: {
    width: 72, height: 72, borderRadius: 18,
    backgroundColor: '#2E6B4A',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 20,
  },
  iconText: { fontSize: 36 },
  sourceBadge: {
    backgroundColor: '#2E6B4A', borderRadius: 8,
    paddingHorizontal: 14, paddingVertical: 4, marginBottom: 6,
  },
  sourceType: { color: '#D4AF6A', fontWeight: 'bold', fontSize: 13 },
  ref: { color: '#D4AF6A', fontSize: 14, fontWeight: '600', marginBottom: 24 },
  arabic: {
    color: '#D4AF6A', fontSize: 22, textAlign: 'center',
    lineHeight: 40, fontWeight: '500', marginBottom: 20,
    writingDirection: 'rtl',
  },
  divider: { width: '100%', height: 1, backgroundColor: '#2E6B4A', marginBottom: 20 },
  translation: {
    color: 'rgba(255,255,255,0.88)', fontSize: 15,
    fontStyle: 'italic', textAlign: 'center', lineHeight: 24, marginBottom: 36,
  },
  continueBtn: {
    width: '100%', borderWidth: 1.5, borderColor: '#2E6B4A',
    borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 16,
  },
  continueText: { color: '#fff', fontSize: 16 },
  footer: { color: '#2E6B4A', fontSize: 12 },
});
