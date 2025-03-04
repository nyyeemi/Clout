import React from 'react';
import {View, Image} from 'react-native';
import {style} from '../style';
import {useTheme} from '@react-navigation/native';

export const ProfilePicture = ({uri}: {uri: string}) => {
  const {colors} = useTheme();
  return (
    <View>
      <Image
        source={{uri}}
        resizeMode="cover"
        style={[style.image, {borderColor: colors.border}]}
      />
    </View>
  );
};
