import React from 'react';
import globalStyle from '../../assets/styles/globalStyle';
import {ThemedView} from '../../components/ui/themed-view';
import {DefaultText} from '../../components/ui/typography';

export const LeaderboardScreen = (): JSX.Element => {
  return (
    <ThemedView style={[globalStyle.flex]}>
      <DefaultText>moromoro tää on leaderboardscreen</DefaultText>
    </ThemedView>
  );
};
