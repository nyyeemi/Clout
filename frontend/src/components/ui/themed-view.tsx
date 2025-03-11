import React from 'react';
import {useTheme} from '@react-navigation/native';
import {StyleProp, View, ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type ThemedViewProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export const ThemedView = ({children, style}: ThemedViewProps): JSX.Element => {
  //const insets = useSafeAreaInsets();
  const theme = useTheme();
  return (
    <View style={[{backgroundColor: theme.colors.background}, style]}>
      {children}
    </View>
  );
};

export const ThemedSafeAreaView = ({
  children,
  style,
}: ThemedViewProps): JSX.Element => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  return (
    <View
      style={[
        {
          paddingBottom: insets.bottom,
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          backgroundColor: theme.colors.background,
        },
        style,
      ]}>
      {children}
    </View>
  );
};

export const CardView = ({children, style}: ThemedViewProps): JSX.Element => {
  //const insets = useSafeAreaInsets();
  const {colors} = useTheme();
  return (
    <View style={[{backgroundColor: colors.card}, style]}>{children}</View>
  );
};
