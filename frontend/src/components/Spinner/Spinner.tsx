import React from 'react';
import {ActivityIndicator, StyleSheet} from 'react-native';

import {useTheme} from '@react-navigation/native';

export const Spinner = ({
  size = 'large',
}: {
  size?: number | 'small' | 'large' | undefined;
}): JSX.Element => {
  const {colors} = useTheme();
  return (
    <ActivityIndicator
      style={styles.activityIndicator}
      size={size}
      color={colors.primary}
    />
  );
};

const styles = StyleSheet.create({
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
