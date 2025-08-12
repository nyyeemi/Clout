import React from 'react';
import {Pressable, Text} from 'react-native';

import style from './style';

type Props = {
  title: string;
  isDisabled?: boolean;
  onPress?: () => void;
};

const Button = ({
  title,
  isDisabled = false,
  onPress = () => {}, //default value is empty function
}: Props) => {
  return (
    <Pressable
      disabled={isDisabled}
      style={[style.button, isDisabled && style.disabled]}
      onPress={() => onPress()}>
      <Text style={style.title}>{title}</Text>
    </Pressable>
  );
};

export default Button;
