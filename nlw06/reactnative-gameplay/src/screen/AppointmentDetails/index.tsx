import React from 'react';
import { Fontisto } from '@expo/vector-icons';
import { BorderlessButton } from 'react-native-gesture-handler'

import { ImageBackground, Text, View, FlatList } from 'react-native';

import { Background } from '../../components/Background'
import { Header } from '../../components/Header';
import { ListHeader } from '../../components/ListHeader'
import { Member } from '../../components/Member'

import { theme } from '../../global/styles/theme';
import { styles } from './styles';
import BannerImg from '../../assets/banner.png'

export function AppointmentDetails() {
  const members = [
    {
      id: '1',
      username: 'Rodrigo',
      avatar_url: 'https://github.com/majortheus.png',
      status: 'online'
    },
    {
      id: '2',
      username: 'Rodrigo',
      avatar_url: 'https://github.com/rodrigorgtic.png',
      status: 'offline'
    }
  ]

  return (
    <Background>
      <Header
        title="Detalhes"
        action={
          <BorderlessButton>
            <Fontisto name="share" size={24} color={theme.colors.primary} />
          </BorderlessButton>
        }
      />

      <ImageBackground style={styles.banner} source={BannerImg}>
        <View style={styles.bannerContent}>
          <Text style={styles.title}>
            Lendários
          </Text>

          <Text style={styles.subtitle}>
            É hoje que vamos chegar ao challenger sem perder uma partida da md10
          </Text>
        </View>
      </ImageBackground>

      <ListHeader 
        title="Jogadores"
        subtitle="Total 3"
      />

      <FlatList 
        data={members}
        keyExtractor={item => item.id}
        renderItem={({item}) => (<Member data={item}/>)}
        
      />
    </Background>
  )
}