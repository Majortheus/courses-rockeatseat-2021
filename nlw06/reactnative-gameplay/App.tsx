import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SignIn } from './src/screen/SignIn';

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <SignIn />
    </>
  );
}
