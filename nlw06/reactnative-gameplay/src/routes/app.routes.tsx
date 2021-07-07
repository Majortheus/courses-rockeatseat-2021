import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { Home } from '../screen/Home';
import { SignIn } from '../screen/SignIn';
import { AppointmentDetails } from '../screen/AppointmentDetails';
import { AppointmentCreate } from '../screen/AppointmentCreate';

import { theme } from '../global/styles/theme';

const { Navigator, Screen } = createStackNavigator();

export function AppRouter() {
  return (
    <Navigator headerMode="none" screenOptions={{ cardStyle: { backgroundColor: theme.colors.secondary100 } }}>
      <Screen name="Home" component={Home} />
      <Screen name="AppointmentDetails" component={AppointmentDetails} />
      <Screen name="AppointmentCreate" component={AppointmentCreate} />
    </Navigator>
  )
}