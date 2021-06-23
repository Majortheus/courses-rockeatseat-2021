import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { Home } from '../screen/Home';
import { SignIn } from '../screen/SignIn';
import { theme } from '../global/styles/theme';

const { Navigator, Screen } = createStackNavigator();

export function AuthRouter() {
  return (
    <Navigator headerMode="none" screenOptions={{ cardStyle: { backgroundColor: theme.colors.secondary100 } }}>
      <Screen name="SignIn" component={SignIn} />
      <Screen name="Home" component={Home} />
    </Navigator>
  )
}