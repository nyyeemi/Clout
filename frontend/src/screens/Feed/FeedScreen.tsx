import React from 'react';
import globalStyle from '../../assets/styles/globalStyle';
import {ThemedView} from '../../components/ui/themed-view';
import {ThemedText} from '../../components/ui/typography';

export const FeedScreen = (): JSX.Element => {
  return (
    <ThemedView style={[globalStyle.flex]}>
      <ThemedText>moromoro tää on leaderboardscreen</ThemedText>
    </ThemedView>
  );
};
