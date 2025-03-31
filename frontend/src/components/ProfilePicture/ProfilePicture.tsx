import React from 'react';
import {ImageStyle, StyleProp, StyleSheet} from 'react-native';
import {useTheme} from '@react-navigation/native';
import FastImage, {FastImageProps} from 'react-native-fast-image';

type ProfilePictureProps = Omit<FastImageProps, 'source'> & {
  uri: string;
  style?: StyleProp<ImageStyle>;
  size?: 'small' | 'medium' | 'large';
};

export const ProfilePicture = ({
  uri,
  style,
  size = 'medium',
  ...imageProps
}: ProfilePictureProps) => {
  const {colors} = useTheme();

  return (
    <FastImage
      source={{uri}}
      resizeMode="cover"
      style={[lookupTable[size], {borderColor: colors.border}, style]}
      {...imageProps}
    />
  );
};

const styles = StyleSheet.create({
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
  small: styles.smallImage,
  medium: styles.mediumImage,
  large: styles.largeImage,
};
