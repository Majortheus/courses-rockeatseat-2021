import React from 'react';
import { RectButton, RectButtonProps } from 'react-native-gesture-handler';
import { Text } from 'react-native'
import { styles } from './styles';

type Props = RectButtonProps & {
  title: string;
}

export function Button({ title, ...rest }: Props) {
  return (
    <RectButton style={styles.container} activeOpacity={0.8} {...rest}>
      <Text style={styles.title}>
        {title}
      </Text>
    </RectButton>
  )
}