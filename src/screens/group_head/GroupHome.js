import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, TouchableOpacity, Alert } from 'react-native';
import { Api } from '../../services/api';
import { COLORS } from '../../components';
import GroupDashboard from './GroupDashboard';
import GroupMembers from './GroupMembers';
import GroupDeposits from './GroupDeposits';
import LoanApply from './LoanApply';

const Tab = createBottomTabNavigator();

function icon(name, focused) {
  const icons = {
    Dashboard: focused ? '🏠' : '🏠',
    Members:   focused ? '👥' : '👥',
    Deposits:  focused ? '💰' : '💰',
    'Apply Loan': focused ? '📋' : '📋',
  };
  return <Text style={{ fontSize: 20 }}>{icons[name]}</Text>;
}

export default function GroupHome({ navigation }) {
  const gid  = Api.getGroupId();
  const user = Api.getUser();

  async function logout() {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: async () => {
        await Api.logout();
        navigation.replace('Login');
      }},
    ]);
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => icon(route.name, focused),
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
      <Tab.Screen
        name="Dashboard"
        component={GroupDashboard}
        initialParams={{ groupId: gid }}
        options={{ title: Api.getGroupName() }}
      />
      <Tab.Screen
        name="Members"
        component={GroupMembers}
        initialParams={{ groupId: gid }}
      />
      <Tab.Screen
        name="Deposits"
        component={GroupDeposits}
        initialParams={{ groupId: gid }}
      />
      <Tab.Screen
        name="Apply Loan"
        component={LoanApply}
        initialParams={{ groupId: gid }}
      />
    </Tab.Navigator>
  );
}
