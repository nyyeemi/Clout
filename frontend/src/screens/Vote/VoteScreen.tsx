import {SafeAreaView, Text} from 'react-native';
import React from 'react';
import globalStyle from '../../assets/styles/globalStyle';

export const VoteScreen = (): JSX.Element => {
  return (
    <SafeAreaView style={[globalStyle.backgroundWhite, globalStyle.flex]}>
      <Text>moromoro tää on votescreen</Text>
    </SafeAreaView>
  );
};
