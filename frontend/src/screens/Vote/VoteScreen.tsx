import React, {useMemo, useRef} from 'react';
import {Button, Dimensions, ScrollView, StyleSheet, View} from 'react-native';

import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {CompetitionInfo} from './CompetitionInfo';
import {VotePair} from './VotePair';

const {height} = Dimensions.get('window');

export const VoteScreen = () => {
  const tabBarHeight = useBottomTabBarHeight();
  const sectionH = useMemo(() => height - tabBarHeight, [tabBarHeight]);
  const ref = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();

  const scrollDown = () => ref.current?.scrollTo({y: sectionH, animated: true});
  const scrollUp = () => ref.current?.scrollTo({y: 0, animated: true});

  return (
    <ScrollView
      ref={ref}
      showsVerticalScrollIndicator={false}
      //scrollEnabled={false}
      decelerationRate="fast"
      snapToOffsets={[0, 1]}>
      <View style={[{height: sectionH}]}>
        <CompetitionInfo />
        <Button title="Vote now" onPress={scrollDown} />
      </View>

      <View
        style={{height: sectionH, flex: 1, paddingTop: insets.top, gap: 30}}>
        <Button title="Show info" onPress={scrollUp} />
        <VotePair />
      </View>
    </ScrollView>
  );
};
