import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { AppRouter } from './app.routes';
import { useAuth } from '../hooks/auth';
import { SignIn } from '../screen/SignIn';

export function Routes() {
  const { user, } = useAuth();

  return (
    <NavigationContainer>
      {
        user?.id
          ? <AppRouter />
          : <SignIn />
      }
    </NavigationContainer>
  )
}