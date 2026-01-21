import React from 'react';
import {ImageStyle, StyleProp, StyleSheet} from 'react-native';

import {useTheme} from '@react-navigation/native';
import {Image, ImageProps} from 'expo-image';

type ProfilePictureProps = Omit<ImageProps, 'source'> & {
  uri: string | undefined;
  style?: StyleProp<ImageStyle>;
  size?: 'minimal' | 'small' | 'medium' | 'large';
};

export const ProfilePicture = ({
  uri,
  style,
  size = 'medium',
  ...imageProps
}: ProfilePictureProps) => {
  const {colors} = useTheme();

  return (
    <Image
      source={{uri}}
      contentFit="cover"
      style={[lookupTable[size], {borderColor: colors.border}, style]}
      {...imageProps}
    />
  );
};

const styles = StyleSheet.create({
  minimalImage: {
    width: 30,
    height: 30,
    borderRadius: 25,
    borderWidth: StyleSheet.hairlineWidth * 3,
  },
  smallImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: StyleSheet.hairlineWidth * 3,
  },
  mediumImage: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    borderWidth: StyleSheet.hairlineWidth * 3,
  },
  largeImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: StyleSheet.hairlineWidth * 3,
    borderColor: '#dedede',
  },
});

const lookupTable = {
  minimal: styles.minimalImage,
  small: styles.smallImage,
  medium: styles.mediumImage,
  large: styles.largeImage,
};
