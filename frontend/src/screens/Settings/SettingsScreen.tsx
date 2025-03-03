import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});

export const SettingsScreen = (): JSX.Element => {
  return (
    <View style={styles.container}>
      <Text>Settings</Text>
    </View>
  );
};
