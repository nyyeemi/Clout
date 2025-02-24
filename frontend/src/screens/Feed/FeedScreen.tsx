import {SafeAreaView, Text} from 'react-native';
import React from 'react';
import globalStyle from '../../assets/styles/globalStyle';

export const FeedScreen = (): JSX.Element => {
  return (
    <SafeAreaView style={[globalStyle.backgroundWhite, globalStyle.flex]}>
      <Text>moromoro tää on feedscreen</Text>
    </SafeAreaView>
  );
};
