import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

export const FollowersScreen = (): JSX.Element => {
  return (
    <View style={styles.container}>
      <Text>Followers</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});
