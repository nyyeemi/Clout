import React from 'react';
import {useTheme} from '@react-navigation/native';
import {
  StyleProp,
  TextStyle,
  Text,
  View,
  ViewStyle,
  TextProps,
} from 'react-native';
import {IconDefinition} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

type ThemedTextProps = TextProps & {
  variant?: 'regular' | 'medium' | 'bold' | 'heavy';
  style?: StyleProp<TextStyle>;
};

export const ThemedText = ({
  variant = 'regular',
  style,
  ...props
}: ThemedTextProps): JSX.Element => {
  const theme = useTheme();

  return (
    <Text
      style={[{color: theme.colors.text}, theme.fonts[variant], style]}
      {...props}
    />
  );
};

type ThemedIconProps = {
  icon: IconDefinition;
  size?: number;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  children?: string;
};

export const ThemedIcon = ({
  icon,
  size = 24,
  containerStyle,
  textStyle,
  children,
  ...props
}: ThemedIconProps): JSX.Element => {
  const theme = useTheme();

  return (
    <View style={containerStyle} {...props}>
      <FontAwesomeIcon icon={icon} size={size} color={theme.colors.text} />
      {children && <ThemedText style={textStyle}>{children}</ThemedText>}
    </View>
  );
};
