import React, {useCallback} from 'react';

import {useFocusEffect} from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import globalStyle from '../../assets/styles/globalStyle';
import {ThemedView} from '../../components/ui/themed-view';
import {ThemedText} from '../../components/ui/typography';

// adjust if needed

export const LeaderboardScreen = () => {
  useFocusEffect(
    useCallback(() => {
      Toast.show({
        type: 'success',
        text1: 'Leaderboard Screen Opened!',
      });
    }, []),
  );

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <ThemedView style={[globalStyle.flex, {justifyContent: 'center'}]}>
      <ThemedText>moromoro tää on leaderboardscreen</ThemedText>
    </ThemedView>
  );
};
