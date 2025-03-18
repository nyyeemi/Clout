import React from 'react';
import {View, Image, ImageStyle, StyleProp} from 'react-native';
import {style} from '../style';
import {useTheme} from '@react-navigation/native';

type ProfilePictureProps = {
  uri: string;
  style?: StyleProp<ImageStyle>;
};

export const ProfilePicture = ({
  uri,
  style: customStyle,
}: ProfilePictureProps) => {
  const {colors} = useTheme();

  return (
    <View>
      <Image
        source={{uri}}
        resizeMode="cover"
        style={[style.image, {borderColor: colors.border}, customStyle]}
      />
    </View>
  );
};
