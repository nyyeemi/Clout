import React, {useCallback} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {useFocusEffect} from '@react-navigation/native';
import {skipToken} from '@reduxjs/toolkit/query';
import {FlashList} from '@shopify/flash-list';
import {Image} from 'expo-image';
import Toast from 'react-native-toast-message';

import globalStyle from '../../assets/styles/globalStyle';
import {ProfilePicture} from '../../components/ProfilePicture/ProfilePicture';
import {ThemedSafeAreaView, ThemedView} from '../../components/ui/themed-view';
import {
  HeadlineText,
  LargeTitleText,
  ThemedText,
  Title1Text,
  Title3Text,
} from '../../components/ui/typography';
import {useTheme} from '../../hooks/useTheme';
import {
  LeaderboardEntryType,
  useGetFinishedCompetitionsQuery,
  useGetLeaderboardQuery,
} from '../../redux/api/endpoints/competitions';

const LEADERBOARD_OFFSET = 4; // on which index lb starts

export const LeaderboardScreen = () => {
  const {colors} = useTheme();

  useFocusEffect(
    useCallback(() => {
      Toast.show({
        type: 'success',
        text1: 'Leaderboard Screen Opened!',
      });
    }, []),
  );

  const {data: finishedCompetitions} = useGetFinishedCompetitionsQuery();

  const mockId = finishedCompetitions?.data[0].id;

  const {data, error} = useGetLeaderboardQuery(mockId ? mockId : skipToken);
  console.log('Leaderboard data: ', data, error);

  const leaderboardData = data?.leaderboard.slice(LEADERBOARD_OFFSET - 1) ?? []; // omit top 3
  const renderItem = ({
    item,
    index,
  }: {
    item: LeaderboardEntryType;
    index: number;
  }) => {
    return <LeaderboardItem data={item} index={index + LEADERBOARD_OFFSET} />;
  };

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <ThemedSafeAreaView style={[globalStyle.flex, {}]}>
      <LargeTitleText variant="heavy">
        {data?.competition.category}
      </LargeTitleText>
      <HeadlineText>{data?.competition.description}</HeadlineText>

      <View
        style={{
          backgroundColor: colors.card,
          flex: 1,
          borderTopEndRadius: 30,
          borderTopStartRadius: 30,
          marginTop: 64,
          paddingTop: 16,
          paddingHorizontal: 16,
        }}>
        <FlashList
          data={leaderboardData}
          ListHeaderComponent={<PodiumView />}
          renderItem={renderItem}
        />
      </View>
    </ThemedSafeAreaView>
  );
};

type LeaderBoardItemProps = {
  data: LeaderboardEntryType;
  index: number;
};

const LeaderboardItem = ({data, index}: LeaderBoardItemProps) => {
  const {colors} = useTheme();
  return (
    <View
      style={[
        styles.leaderboardItemContainer,
        {backgroundColor: colors.background},
      ]}>
      <View style={{flexDirection: 'row', gap: 16}}>
        <Title3Text variant="heavy">{index.toString()}</Title3Text>
        <HeadlineText variant="medium">{data.username}</HeadlineText>
      </View>
      <Image style={styles.itemImage} source={data.image_url} />
    </View>
  );
};

const styles = StyleSheet.create({
  leaderboardItemContainer: {
    flexDirection: 'row',
    paddingLeft: 16,
    marginVertical: 2,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemImage: {
    width: 50,
    height: 50,
    margin: 6,
    borderRadius: 9,
  },
  podiumContainer: {
    flexDirection: 'row',
    flex: 1,
  },
});

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
