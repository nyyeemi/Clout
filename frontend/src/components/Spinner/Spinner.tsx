import {useTheme} from '@react-navigation/native';
import React from 'react';
import {ActivityIndicator, StyleSheet} from 'react-native';

export const Spinner = (): JSX.Element => {
  const {colors} = useTheme();
  return (
    <ActivityIndicator
      style={styles.activityIndicator}
      size="large"
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
