import React, {useState} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';

import {skipToken} from '@reduxjs/toolkit/query';
import {FlashList} from '@shopify/flash-list';
import {Image} from 'expo-image';

import globalStyle from '../../assets/styles/globalStyle';
import {ThemedSafeAreaView} from '../../components/ui/themed-view';
import {
  HeadlineText,
  LargeTitleText,
  Title3Text,
} from '../../components/ui/typography';
import {useTheme} from '../../hooks/useTheme';
import {
  LeaderboardEntryType,
  useGetFinishedCompetitionsQuery,
  useGetLeaderboardQuery,
} from '../../redux/api/endpoints/competitions';
import style from '../LoginScreen/style';

const LEADERBOARD_OFFSET = 4; // on which index lb starts

export const LeaderboardScreen = () => {
  const {colors} = useTheme();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
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

  const {data: finishedCompetitions} = useGetFinishedCompetitionsQuery();
  console.log('Finished comps', finishedCompetitions);

  const mockId = finishedCompetitions?.data[0].id;

  const {data, error} = useGetLeaderboardQuery(mockId ? mockId : skipToken);
  console.log('Leaderboard data: ', data, error);

  const leaderboardData = data?.leaderboard.slice(LEADERBOARD_OFFSET - 1) ?? []; // omit top 3

  if (mockId === undefined || !data) {
    return (
      <View>
        <Title3Text>No competition found.</Title3Text>
      </View>
    );
  }

  const renderItem = ({
    item,
    index,
  }: {
    item: LeaderboardEntryType;
    index: number;
  }) => {
    return <LeaderboardItem data={item} index={index + LEADERBOARD_OFFSET} />;
  };

  const podiumData = data?.leaderboard.slice(0, 3) ?? [];
  console.log('kolmeparast', podiumData);

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <ThemedSafeAreaView style={[globalStyle.flex, {}]}>
      <LargeTitleText variant="heavy">
        {data?.competition.category}
      </LargeTitleText>

      <FlashList
        data={leaderboardData}
        ListHeaderComponent={<PodiumView podiumData={podiumData} />}
        renderItem={renderItem}
      />
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
      style={[styles.leaderboardItemContainer, {backgroundColor: colors.card}]}>
      <View style={{flexDirection: 'row', gap: 16}}>
        <Title3Text variant="heavy">{index.toString()}</Title3Text>
        <HeadlineText variant="medium">{data.username}</HeadlineText>
      </View>
      <Image style={styles.itemImage} source={data.image_url} />
    </View>
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

const {width} = Dimensions.get('window');
const WINNER_IMAGE_WIDTH = width * 0.5;
const WINNER_IMAGE_HEIGHT = (WINNER_IMAGE_WIDTH / 3) * 4;
const PODIUM_IMAGE_WIDTH = width * 0.25;
const PODIUM_IMAGE_HEIGHT = (PODIUM_IMAGE_WIDTH / 3) * 4;

const styles = StyleSheet.create({
  leaderboardItemContainer: {
    flexDirection: 'row',
    paddingLeft: 16,
    marginVertical: 3,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
  },
  itemImage: {
    width: 50,
    height: 50,
    margin: 6,
    borderRadius: 9,
  },
  podiumColumnContainer: {
    //backgroundColor: 'red',
    flexDirection: 'column',
    flex: 1,
    marginTop: 10,
    gap: 20,
    marginBottom: 24,
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
