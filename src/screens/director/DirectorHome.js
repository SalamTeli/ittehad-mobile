import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, TouchableOpacity, Alert } from 'react-native';
import { Api } from '../../services/api';
import { COLORS } from '../../components';
import DirectorDashboard from './DirectorDashboard';
import AllGroups from './AllGroups';
import LoanVoting from './LoanVoting';
import ChangePassword from './ChangePassword';

const Tab = createBottomTabNavigator();

export default function DirectorHome({ navigation }) {
  async function logout() {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: async () => {
        await Api.logout(); navigation.replace('Login');
      }},
    ]);
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          const icons = { Dashboard: '📊', 'All Groups': '🏘️', Voting: '🗳️', 'Password': '🔒' };
          return <Text style={{ fontSize: 18 }}>{icons[route.name]}</Text>;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.muted,
        tabBarStyle: { paddingBottom: 4, height: 58 },
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
        headerRight: () => (
          <TouchableOpacity onPress={logout} style={{ marginRight: 16 }}>
            <Text style={{ color: '#fff', fontSize: 13 }}>Logout</Text>
          </TouchableOpacity>
        ),
      })}
    >
      <Tab.Screen name="Dashboard" component={DirectorDashboard} options={{ title: 'Society Overview' }} />
      <Tab.Screen name="All Groups" component={AllGroups} />
      <Tab.Screen name="Voting" component={LoanVoting} options={{ title: 'Loan Voting' }} />
      <Tab.Screen name="Password" component={ChangePassword} options={{ title: 'Change Password' }} />
    </Tab.Navigator>
  );
}
