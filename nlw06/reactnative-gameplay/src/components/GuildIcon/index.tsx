import React from 'react';
import { Image } from 'react-native';

import { styles } from './styles';

export function GuildIcon() {
  const uri = 'https://www.freepnglogos.com/uploads/discord-logo-png/discord-icon-flat-style-available-svg-png-eps-10.png';

  return (
    <Image
      source={{ uri }}
      style={styles.image}
      resizeMode="cover"
    />
  )
}