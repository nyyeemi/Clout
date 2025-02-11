import React from 'react';
import {KeyboardTypeOptions, Text, TextInput, View} from 'react-native';
import style from './style';

type Props = {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (val: string) => void;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  style?: object;
};

const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  secureTextEntry = false,
  style: inputStyle,
}: Props): JSX.Element => {
  return (
    <View style={inputStyle}>
      <Text style={style.label}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        style={style.input}
        value={value}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
      />
    </View>
  );
};

export default Input;
