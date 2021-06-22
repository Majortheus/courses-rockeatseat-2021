import React from 'react';
import { View, Text, Image } from 'react-native';

import { styles } from './styles'

import IllustrationImg from '../../assets/illustration.png'

export function SignIn() {
  return (
    <View style={styles.container}>
      <Image source={IllustrationImg} />
    </View>
  )
}