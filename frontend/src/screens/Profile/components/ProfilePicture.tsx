import React from 'react';
import {View, Image} from 'react-native';
import {style} from '../style';

export const ProfilePicture = ({uri}: {uri: string}) => {
  return (
    <View>
      <Image source={{uri}} resizeMode="cover" style={style.image} />
    </View>
  );
};
