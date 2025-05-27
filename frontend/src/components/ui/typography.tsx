import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import {IconDefinition} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {useTheme} from '@react-navigation/native';

type ThemedTextProps = TextProps & {
  variant?: 'regular' | 'medium' | 'bold' | 'heavy';
  style?: StyleProp<TextStyle>;
};

export const ThemedText = ({
  variant = 'regular',
  style,
  ...props
}: ThemedTextProps) => {
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
}: ThemedIconProps) => {
  const theme = useTheme();

  return (
    <View style={containerStyle} {...props}>
      <FontAwesomeIcon icon={icon} size={size} color={theme.colors.text} />
      {children && <ThemedText style={textStyle}>{children}</ThemedText>}
    </View>
  );
};

/* Renders text using the Large Title style (Regular, 34pt size, 41pt leading). */
export const LargeTitleText = ({
  variant = 'regular',
  style,
  ...props
}: ThemedTextProps) => (
  <ThemedText variant={variant} style={[styles.largeTitle, style]} {...props} />
);

/* Renders text using the Title 1 style (Regular, 28pt size, 34pt leading). */
export const Title1Text = ({
  variant = 'regular',
  style,
  ...props
}: ThemedTextProps) => (
  <ThemedText variant={variant} style={[styles.title1, style]} {...props} />
);

/* Renders text using the Title 2 style (Regular, 22pt size, 28pt leading).*/
export const Title2Text = ({
  variant = 'regular',
  style,
  ...props
}: ThemedTextProps) => (
  <ThemedText variant={variant} style={[styles.title2, style]} {...props} />
);

/* Renders text using the Title 3 style (Regular, 20pt size, 25pt leading). */
export const Title3Text = ({
  variant = 'regular',
  style,
  ...props
}: ThemedTextProps) => (
  <ThemedText variant={variant} style={[styles.title3, style]} {...props} />
);

/* Renders text using the Headline style (Semibold -> medium variant, 17pt size, 22pt leading). */
export const HeadlineText = ({
  variant = 'medium',
  style,
  ...props
}: ThemedTextProps) => (
  <ThemedText variant={variant} style={[styles.headline, style]} {...props} />
);

/* Renders text using the Body style (Regular, 17pt size, 22pt leading).*/
export const BodyText = ({
  variant = 'regular',
  style,
  ...props
}: ThemedTextProps) => (
  <ThemedText variant={variant} style={[styles.body, style]} {...props} />
);

/* Renders text using the Subhead style (Regular, 15pt size, 20pt leading). */
export const SubheadText = ({
  variant = 'regular',
  style,
  ...props
}: ThemedTextProps) => (
  <ThemedText variant={variant} style={[styles.subhead, style]} {...props} />
);

/* Renders text using the Footnote style (Regular, 13pt size, 18pt leading). */
export const FootnoteText = ({
  variant = 'regular',
  style,
  ...props
}: ThemedTextProps) => (
  <ThemedText variant={variant} style={[styles.footnote, style]} {...props} />
);

// --- Apple HIG Text Style Definitions ---
const styles = StyleSheet.create({
  largeTitle: {
    fontSize: 34,
    lineHeight: 41,
  },
  title1: {
    fontSize: 28,
    lineHeight: 34,
  },
  title2: {
    fontSize: 22,
    lineHeight: 28,
  },
  title3: {
    fontSize: 20,
    lineHeight: 25,
  },
  headline: {
    fontSize: 17,
    lineHeight: 22,
  },
  body: {
    fontSize: 17,
    lineHeight: 22,
  },
  subhead: {
    fontSize: 15,
    lineHeight: 20,
  },
  footnote: {
    fontSize: 13,
    lineHeight: 18,
  },
});
