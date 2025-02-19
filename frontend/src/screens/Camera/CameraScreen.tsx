import {SafeAreaView, Text} from 'react-native';
import React from 'react';
import globalStyle from '../../assets/styles/globalStyle';

export const CameraScreen = (): JSX.Element => {
  return (
    <SafeAreaView style={[globalStyle.backgroundWhite, globalStyle.flex]}>
      <Text>moromoro tääl on kamera</Text>
    </SafeAreaView>
  );
};
