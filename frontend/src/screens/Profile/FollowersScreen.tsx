import {StyleSheet} from 'react-native';
import React from 'react';
import {ThemedText} from '../../components/ui/typography';
import {ThemedView} from '../../components/ui/themed-view';

export const FollowersScreen = (): JSX.Element => {
  return (
    <ThemedView style={styles.container}>
      <ThemedText>Followers</ThemedText>
    </ThemedView>
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
