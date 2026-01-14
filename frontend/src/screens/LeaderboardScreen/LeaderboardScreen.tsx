import React, {useCallback} from 'react';
import {Image, StyleSheet, View} from 'react-native';

import {useFocusEffect} from '@react-navigation/native';
import {FlashList} from '@shopify/flash-list';
import Toast from 'react-native-toast-message';

import globalStyle from '../../assets/styles/globalStyle';
import {ThemedView} from '../../components/ui/themed-view';

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

  const leaderboardData = [];
  const renderItem = useCallback(() => <LeaderboardItem />, []);

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <ThemedView style={[globalStyle.flex, {justifyContent: 'center'}]}>
      <PodiumView />
      {/*<FlashList
        data={[leaderboardData]}
        ListHeaderComponent={<PodiumView />}
        renderItem={renderItem}
      />*/}
    </ThemedView>
  );
};

type PodiumViewProps = {};

const PodiumView = () => {
  return (
    <View style={styles.podiumContainer}>
      <Image
        source={{
          uri: 'https://picsum.photos/seed/9cf2603f-852c-5321-a393-5c9885083598_post_2/400/300',
        }}
      />
      <Image
        source={{
          uri: 'https://picsum.photos/seed/9cf2603f-852c-5321-a393-5c9885083598_post_2/400/300',
        }}
      />
      <Image
        source={{
          uri: 'https://picsum.photos/seed/9cf2603f-852c-5321-a393-5c9885083598_post_2/400/300',
        }}
      />
    </View>
  );
};

type LeaderBoardProps = {};

const LeaderboardItem = () => {
  return <></>;
};

const styles = StyleSheet.create({
  leaderboardItemContainer: {},
  podiumContainer: {
    flexDirection: 'row',
    flex: 1,
  },
});
