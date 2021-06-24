import React, { useState } from 'react';

import { Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons'

import { Background } from '../../components/Background'
import { Header } from '../../components/Header';
import { CategorySelect } from '../../components/CategorySelect';
import { GuildIcon } from '../../components/GuildIcon';
import { SmallInput } from '../../components/SmallInput';

import { theme } from '../../global/styles/theme';
import { styles } from './styles';
import { RectButton } from 'react-native-gesture-handler';

export function AppointmentCreate() {
  const [category, setCategory] = useState('');
  return (
    <Background>
      <Header
        title="Agendar partida"
      />

      <Text style={[styles.label, { marginLeft: 24, marginTop: 36, marginBottom: 18}]}>
        Categoria
      </Text>

      <CategorySelect hasCheckbox categorySelected={category} setCategory={setCategory} />

      <View style={styles.form}>
        <RectButton>
          <View style={styles.select}>
            {
              <GuildIcon />
              //<View style={styles.image} />
            }

            <View style={styles.selectBody}>
              <Text style={styles.label}>
                Selecione um servidor
              </Text>
            </View>

            <Feather
              name="chevron-right"
              color={theme.colors.heading}
              size={18}
            />
          </View>
        </RectButton>

        <View style={styles.field}>
          <View>
            <Text style={styles.label}>
              Dia e mês
            </Text>
          </View>

          <View style={styles.column}>
            <SmallInput maxLength={2}/>
            <Text style={styles.divider}>
              /
            </Text>
            <SmallInput maxLength={2}/>
          </View>
            
        </View>
      </View>
    </Background>
  )
}