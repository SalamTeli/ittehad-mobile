import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { COLORS } from '../components';

import LoginScreen from '../screens/auth/LoginScreen';
import QuoteSplash from '../screens/auth/QuoteSplash';
import GroupHome   from '../screens/group_head/GroupHome';
import DirectorHome from '../screens/director/DirectorHome';
import { MemberDetailScreen } from '../screens/group_head/GroupMembers';
import { GroupDetailScreen }  from '../screens/director/AllGroups';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          cardStyleInterpolator: ({ current }) => ({
            cardStyle: { opacity: current.progress },
          }),
        }}
      >
        <Stack.Screen name="Login"       component={LoginScreen}    options={{ headerShown: false }} />
        <Stack.Screen name="QuoteSplash" component={QuoteSplash}    options={{ headerShown: false }} />
        <Stack.Screen name="GroupHome"   component={GroupHome}      options={{ headerShown: false }} />
        <Stack.Screen name="DirectorHome" component={DirectorHome}  options={{ headerShown: false }} />
        <Stack.Screen name="MemberDetail" component={MemberDetailScreen} options={{ title: 'Member Details' }} />
        <Stack.Screen name="GroupDetail"  component={GroupDetailScreen}  options={{ title: 'Group Details' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
