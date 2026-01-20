import React, {useEffect, useState} from 'react';
import {Dimensions, Modal, StyleSheet, View} from 'react-native';
import {Pressable} from 'react-native';

import {skipToken} from '@reduxjs/toolkit/query';
import {FlashList} from '@shopify/flash-list';
import {Image} from 'expo-image';

import globalStyle from '../../assets/styles/globalStyle';
import {OpacityPressable} from '../../components/OpacityPressable/OpacityPressable';
import {Spinner} from '../../components/Spinner/Spinner';
import {ThemedSafeAreaView} from '../../components/ui/themed-view';
import {
  FootnoteText,
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
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

  useEffect(() => console.log(selectedImage), []);

  const {
    data: finishedCompetitions,
    isLoading: isLoadingComps,
    isError: isErrorComps,
  } = useGetFinishedCompetitionsQuery();

  const firstCompId = finishedCompetitions?.data?.[0]?.id;

  const {
    data: leaderboard,
    isLoading: isLoadingLeaderboard,
    isError: isErrorLeaderboard,
    error: leaderboardError,
  } = useGetLeaderboardQuery(firstCompId ?? skipToken);

  if (isLoadingComps || (firstCompId && isLoadingLeaderboard)) {
    return <Spinner />;
  }

  if (isErrorComps || isErrorLeaderboard) {
    return (
      <View>
        <Title3Text>Error loading data. Please try again.</Title3Text>
      </View>
    );
  }

  if (!finishedCompetitions?.data || finishedCompetitions.data.length === 0) {
    return (
      <View>
        <Title3Text>No competitions found.</Title3Text>
      </View>
    );
  }

  if (!leaderboard) {
    return (
      <View>
        <Title3Text>Leaderboard currently unavailable.</Title3Text>
      </View>
    );
  }

  const leaderboardData =
    leaderboard.leaderboard.slice(LEADERBOARD_OFFSET - 1) ?? [];

  const renderItem = ({
    item,
    index,
  }: {
    item: LeaderboardEntryType;
    index: number;
  }) => {
    return (
      <LeaderboardItem
        data={item}
        index={index + LEADERBOARD_OFFSET}
        onImageLongPress={url => setSelectedImage(url)}
      />
    );
  };

  const podiumData = leaderboard?.leaderboard.slice(0, 3) ?? [];

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <ThemedSafeAreaView style={[globalStyle.flex, {}]}>
      <LargeTitleText variant="heavy">
        {leaderboard?.competition.category}
      </LargeTitleText>

      <FlashList
        data={leaderboardData}
        ListHeaderComponent={<PodiumView podiumData={podiumData} />}
        renderItem={renderItem}
      />

      <Modal
        visible={!!selectedImage}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}>
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setSelectedImage(null)}>
          <View style={styles.modalContent}>
            {selectedImage && (
              <Image
                source={selectedImage}
                style={styles.fullImage}
                contentFit="contain"
              />
            )}
            <FootnoteText style={{color: 'white', marginTop: 10}}>
              Tap anywhere to close
            </FootnoteText>
          </View>
        </Pressable>
      </Modal>
    </ThemedSafeAreaView>
  );
};

type LeaderBoardItemProps = {
  data: LeaderboardEntryType;
  index: number;
  onImageLongPress: (url: string) => void;
};

const LeaderboardItem = ({
  data,
  index,
  onImageLongPress,
}: LeaderBoardItemProps) => {
  const {colors} = useTheme();

  return (
    <View
      style={[styles.leaderboardItemContainer, {backgroundColor: colors.card}]}>
      <View style={{flexDirection: 'row', gap: 16, alignItems: 'center'}}>
        <Title3Text variant="heavy">{index.toString()}</Title3Text>
        <HeadlineText variant="medium">{data.username}</HeadlineText>
      </View>

      <OpacityPressable onLongPress={() => onImageLongPress(data.image_url)}>
        <Image style={styles.itemImage} source={{uri: data.image_url}} />
      </OpacityPressable>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)', // Darken background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    height: '70%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  leaderboardItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginVertical: 4,
    borderRadius: 12,
  },
});
