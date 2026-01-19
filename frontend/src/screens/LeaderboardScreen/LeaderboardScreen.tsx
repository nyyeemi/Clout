import React, {useCallback} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';

import {useFocusEffect} from '@react-navigation/native';
import {skipToken} from '@reduxjs/toolkit/query';
import {FlashList} from '@shopify/flash-list';
import {Image} from 'expo-image';
import Toast from 'react-native-toast-message';

import globalStyle from '../../assets/styles/globalStyle';
import {ThemedSafeAreaView, ThemedView} from '../../components/ui/themed-view';
import {
  HeadlineText,
  LargeTitleText,
  ThemedText,
  Title3Text,
} from '../../components/ui/typography';
import {
  LeaderboardEntryType,
  useGetFinishedCompetitionsQuery,
  useGetLeaderboardQuery,
} from '../../redux/api/endpoints/competitions';
import style from '../LoginScreen/style';

// adjust if needed

export const LeaderboardScreen = () => {
  {
    /*
    useFocusEffect(
    useCallback(() => {
      Toast.show({
        type: 'success',
        text1: 'Leaderboard Screen Opened!',
      });
    }, []),
  );
*/
  }

  const {data: finishedCompetitions} = useGetFinishedCompetitionsQuery();

  console.log('kisat jotka loppunu:', finishedCompetitions);
  const mockId = finishedCompetitions?.data[0].id;

  const {data, error} = useGetLeaderboardQuery(mockId ? mockId : skipToken);
  console.log('Leaderboard data: ', data, error);
  //const leaderboardData = [];
  const renderItem = useCallback(() => <LeaderboardItem />, []);

  const podiumData = data?.leaderboard.slice(0, 3) ?? [];
  console.log('kolmeparast', podiumData);

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <ThemedSafeAreaView style={[globalStyle.flex, {}]}>
      <LargeTitleText variant="heavy">
        {data?.competition.category}
      </LargeTitleText>

      <PodiumView podiumData={podiumData} />
      {/* <Image 
        style={{width: 256, height: 512}}
        source={data?.leaderboard[0].image_url}
      />

      <View
        style={{
          backgroundColor: 'gray',
          flex: 1,
          borderTopEndRadius: 30,
          borderTopStartRadius: 30,
          marginTop: 64,
        }}></View>*/}

      {/*<FlashList
        data={[leaderboardData]}
        ListHeaderComponent={<PodiumView />}
        renderItem={renderItem}
      />*/}
    </ThemedSafeAreaView>
  );
};

type PodiumViewProps = {
  podiumData: LeaderboardEntryType[];
};

const PodiumView = ({podiumData}: PodiumViewProps) => {
  const firstPlace = podiumData[0];
  const secondPlace = podiumData[1];
  const thirdPlace = podiumData[2];

  return (
    <View style={styles.podiumColumnContainer}>
      <View style={styles.winnerContainer}>
        <Image
          source={{
            uri: firstPlace.image_url,
          }}
          style={styles.winnerImage}
        />
        <HeadlineText>1. {firstPlace.username}</HeadlineText>
      </View>
      <View style={styles.podiumRowContainer}>
        <View style={styles.winnerContainer}>
          <Image
            source={{
              uri: secondPlace.image_url,
            }}
            style={styles.secondAndThirdPlaceImage}
          />
          <HeadlineText>2. {secondPlace.username}</HeadlineText>
        </View>

        <View style={styles.winnerContainer}>
          <Image
            source={{
              uri: thirdPlace.image_url,
            }}
            style={styles.secondAndThirdPlaceImage}
          />
          <HeadlineText>3. {thirdPlace.username}</HeadlineText>
        </View>
      </View>
    </View>
  );
};

type LeaderBoardProps = {};

const LeaderboardItem = () => {
  return <></>;
};

const {width} = Dimensions.get('window');
const WINNER_IMAGE_WIDTH = width * 0.5;
const WINNER_IMAGE_HEIGHT = (WINNER_IMAGE_WIDTH / 3) * 4;
const PODIUM_IMAGE_WIDTH = width * 0.25;
const PODIUM_IMAGE_HEIGHT = (PODIUM_IMAGE_WIDTH / 3) * 4;

const styles = StyleSheet.create({
  leaderboardItemContainer: {},
  podiumColumnContainer: {
    flexDirection: 'column',
    flex: 1,
    marginTop: 10,
    gap: 20,
  },
  podiumRowContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
  },
  winnerContainer: {alignItems: 'center'},
  winnerImage: {
    width: WINNER_IMAGE_WIDTH,
    height: WINNER_IMAGE_HEIGHT,
    borderRadius: 5,
  },
  secondAndThirdPlaceImage: {
    width: PODIUM_IMAGE_WIDTH,
    height: PODIUM_IMAGE_HEIGHT,
    borderRadius: 5,
  },
});
