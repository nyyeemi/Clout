import React from 'react';
import {StyleProp, ViewStyle, Pressable, PressableProps} from 'react-native';

type OpacityPressableProps = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>; // Allow regular style objects/arrays
  children: React.ReactNode;
  activeOpacity?: number;
};

export const OpacityPressable = ({
  style,
  children,
  activeOpacity = 0.7,
  ...props
}: OpacityPressableProps) => {
  return (
    <Pressable
      {...props}
      style={({pressed}) => [{opacity: pressed ? activeOpacity : 1}, style]}>
      {children}
    </Pressable>
  );
};
