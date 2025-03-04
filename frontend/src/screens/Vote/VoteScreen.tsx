import React from 'react';
import globalStyle from '../../assets/styles/globalStyle';
import {ThemedView} from '../../components/ui/themed-view';
import {DefaultText} from '../../components/ui/typography';

export const VoteScreen = (): JSX.Element => {
  return (
    <ThemedView style={[globalStyle.flex]}>
      <DefaultText>moromoro tää on votescreen</DefaultText>
    </ThemedView>
  );
};
