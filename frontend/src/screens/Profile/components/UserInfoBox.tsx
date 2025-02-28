import React from 'react';
import {View, Text} from 'react-native';
import {style} from '../style';

export const UserInfoBox = ({
  count,
  text,
}: {
  count: number;
  text: string;
}): JSX.Element => {
  return (
    <View style={style.box}>
      <Text style={style.boxNumber}>{count}</Text>
      <Text style={style.boxText}>{text}</Text>
    </View>
  );
};
