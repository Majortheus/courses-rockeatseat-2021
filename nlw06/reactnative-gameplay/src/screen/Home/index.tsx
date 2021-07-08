import React, { useState } from 'react';
import { Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLLECTION_APPOINTMENTS } from '../../config/database';

import { Background } from '../../components/Background';
import { Profile } from '../../components/Profile';
import { ButtonAdd } from '../../components/ButtonAdd';
import { CategorySelect } from '../../components/CategorySelect';
import { ListHeader } from '../../components/ListHeader';
import { Appointment, AppointmentProps } from '../../components/Appointment';
import { ListDivider } from '../../components/ListDivider';

import { styles } from './styles';
import { FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export function Home() {
  const [category, setCategory] = useState('');
  const [appointments, setAppointments] = useState<AppointmentProps[]>([]);

  const navigation = useNavigation();

  function handleCategorySelect(categoryId: string) {
    categoryId !== category ? setCategory(categoryId) : setCategory('');
  }

  function handleAppointmentDetails() {
    navigation.navigate('AppointmentDetails')
  }

  function handleAppointmentCreate() {
    navigation.navigate('AppointmentCreate')
  }

  async function loadAppointments(){
    const storage = await AsyncStorage.getItem(COLLECTION_APPOINTMENTS);
    const appointments: AppointmentProps[] = storage ? JSON.parse(storage) : [];

    if(category){
      setAppointments(appointments.filter(item => item.category === category));
    } else {
      setAppointments(appointments);
    }
  }

  return (
    <Background>
      <View style={styles.header}>
        <Profile />
        <ButtonAdd onPress={handleAppointmentCreate} />
      </View>

      <CategorySelect categorySelected={category} setCategory={handleCategorySelect} hasCheckbox={false} />

      <ListHeader title="Partidas agendadas" subtitle="Total 6" />
      <FlatList
        data={appointments}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (<Appointment data={item} onPress={handleAppointmentDetails} />)}
        ItemSeparatorComponent={() => <ListDivider />}
        contentContainerStyle={{ paddingBottom: 69 }}
        style={styles.matches}
        showsVerticalScrollIndicator={false}
      />
    </Background>
  )
}