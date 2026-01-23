import React from 'react';
import {
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';

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
      style={({pressed}) => [
        {opacity: pressed ? activeOpacity : 1},
        style,
        props.disabled && styles.disabled,
      ]}>
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.4,
  },
});
