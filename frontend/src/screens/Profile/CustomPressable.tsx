import {useTheme} from '@react-navigation/native';
import React from 'react';
import {StyleProp, ViewStyle, Pressable} from 'react-native';

type CustomPressableProps = {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  pressedStyle?: (pressed: boolean) => StyleProp<ViewStyle>;
};

export const CustomPressable = ({
  onPress,
  style,
  children,
  pressedStyle,
}: CustomPressableProps) => {
  const {colors} = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [
        pressedStyle ? pressedStyle(pressed) : {opacity: pressed ? 0.7 : 1},
        {backgroundColor: colors.background, borderColor: colors.text},
        style,
      ]}>
      {children}
    </Pressable>
  );
};
