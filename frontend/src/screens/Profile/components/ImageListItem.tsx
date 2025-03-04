import React from 'react';
import {Pressable, Image, StyleProp, ImageStyle} from 'react-native';
import {CustomImage} from '../../../services/image/images';
import {style} from '../style';
import {useTheme} from '@react-navigation/native';

type ImageBoxProps = {
  image: CustomImage;
  onPress: () => void;
  imageStyle?: StyleProp<ImageStyle>;
};

export const ImageListItem = ({
  image,
  onPress,
  imageStyle,
}: ImageBoxProps): JSX.Element => {
  const {colors} = useTheme();
  return (
    <>
      <Pressable
        style={({pressed}) => [{opacity: pressed ? 0.5 : 1}]}
        onPress={onPress}>
        <Image
          source={{uri: image.image_url}}
          resizeMode="cover"
          style={[
            imageStyle ? imageStyle : style.imageBox,
            {borderColor: colors.border},
          ]}
        />
      </Pressable>
    </>
  );
};
