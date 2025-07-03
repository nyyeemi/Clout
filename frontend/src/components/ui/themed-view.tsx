import React from 'react';
import {StyleProp, StyleSheet, View, ViewProps, ViewStyle} from 'react-native';

import {useTheme} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type ThemedViewProps = ViewProps & {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  bottomBorder?: boolean;
};

type ThemedSafeAreaViewProps = ViewProps & {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export const ThemedView = ({
  children,
  style,
  bottomBorder = false,
  ...props
}: ThemedViewProps) => {
  const theme = useTheme();

  return (
    <View
      style={[
        {backgroundColor: theme.colors.background},
        bottomBorder && {
          borderBottomColor: theme.colors.border,
          borderBottomWidth: StyleSheet.hairlineWidth,
        },
        style,
      ]}
      {...props}>
      {children}
    </View>
  );
};

export const ThemedSafeAreaView = ({
  children,
  style,
  ...props
}: ThemedSafeAreaViewProps) => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  return (
    <View
      style={[
        {
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          backgroundColor: theme.colors.background,
        },
        style,
      ]}
      {...props}>
      {children}
    </View>
  );
};

export const CardView = ({children, style}: ThemedViewProps) => {
  //const insets = useSafeAreaInsets();
  const {colors} = useTheme();
  return (
    <View style={[{backgroundColor: colors.card}, style]}>{children}</View>
  );
};
