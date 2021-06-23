import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { Home } from '../screen/Home';
import { SignIn } from '../screen/SignIn';

const { Navigator, Screen } = createStackNavigator();

export function AuthRouter() {
  return (
    <Navigator headerMode="none" screenOptions={{ cardStyle: { backgroundColor: 'transparent' } }}>
      <Screen name="SignIn" component={SignIn} />
      <Screen name="Home" component={Home} />
    </Navigator>
  )
}