import React, { useContext } from 'react';
import { View, Text, Image, ActivityIndicator,} from 'react-native';

import { useAuth } from '../../hooks/auth'

import { styles } from './styles'
import { Background } from '../../components/Background';
import { ButtonIcon } from '../../components/ButtonIcon';

import IllustrationImg from '../../assets/illustration.png'
import { theme } from '../../global/styles/theme';

export function SignIn() {
  const { signIn, isLoading } = useAuth();

  async function handleSignIn() {
    await signIn();
  }

  return (
    <Background>
      <View style={styles.container}>
        <Image source={IllustrationImg} style={styles.image} resizeMode="stretch" />
        <View style={styles.content}>
          <Text style={styles.title}>
            Conecte-se{'\n'}
            e organize suas{'\n'}
            jogatinas
          </Text>
          <Text style={styles.subtitle}>
            Crie grupos para jogar seus games {'\n'}
            favoritos com seus amigos
          </Text>

          {
            isLoading
              ? <ActivityIndicator color={theme.colors.primary} />
              : <ButtonIcon title="Entrar com Discord" onPress={handleSignIn} />
          }
          
        </View>
      </View>
    </Background>
  )
}