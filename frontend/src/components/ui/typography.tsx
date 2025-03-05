import React from 'react';
import {useTheme} from '@react-navigation/native';
import {StyleProp, TextStyle, Text, View, ViewStyle} from 'react-native';
import {IconDefinition} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

type DefaultTextProps = {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
};

export const ThemedText = ({
  children,
  style,
}: DefaultTextProps): JSX.Element => {
  const theme = useTheme();
  return <Text style={[{color: theme.colors.text}, style]}>{children}</Text>;
};

type ThemedIconProps = {
  icon: IconDefinition;
  size?: number;
  children?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<TextStyle>;
};

export const ThemedIcon = ({
  children,
  style,
  icon,
  size = 24,
  containerStyle,
}: ThemedIconProps): JSX.Element => {
  const theme = useTheme();
  return (
    <View style={containerStyle}>
      <FontAwesomeIcon icon={icon} size={size} color={theme.colors.text} />
      {children && <ThemedText style={style}>{children}</ThemedText>}
    </View>
  );
};
