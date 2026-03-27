import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { Api } from './src/services/api';
import { COLORS } from './src/components';

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Api.loadSaved().finally(() => setReady(true));
  }, []);

  if (!ready) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.bg }}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );

  return <AppNavigator />;
}
