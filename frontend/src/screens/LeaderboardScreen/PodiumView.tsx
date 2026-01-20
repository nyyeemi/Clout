import {Dimensions, StyleSheet, View} from 'react-native';

import {skipToken} from '@reduxjs/toolkit/query';
import {Image} from 'expo-image';

import {OpacityPressable} from '../../components/OpacityPressable/OpacityPressable';
import {HeadlineText, Title1Text} from '../../components/ui/typography';
import {LeaderboardEntryType} from '../../redux/api/endpoints/competitions';
import {useGetProfilePictureByUsernameQuery} from '../../redux/api/endpoints/users';

type PodiumViewProps = {
  podiumData: LeaderboardEntryType[];
  handleNavigate: (username: string) => void;
};

export const PodiumView = ({podiumData, handleNavigate}: PodiumViewProps) => {
  const firstPlace = podiumData[0];
  const secondPlace = podiumData[1];
  const thirdPlace = podiumData[2];

  const {data: profile_picture_url, error} =
    useGetProfilePictureByUsernameQuery(
      firstPlace.username ? firstPlace.username : skipToken,
    );

  return (
    <View style={styles.podiumColumnContainer}>
      <View style={styles.winnerContainer}>
        <Image
          source={{
            uri: firstPlace.image_url,
          }}
          style={styles.winnerImage}
        />
        <OpacityPressable onPress={() => handleNavigate(firstPlace.username)}>
          <Title1Text>1. {firstPlace.username}</Title1Text>
        </OpacityPressable>
      </View>
      <View style={styles.podiumRowContainer}>
        <View style={styles.winnerContainer}>
          <Image
            source={{
              uri: secondPlace.image_url,
            }}
            style={styles.secondAndThirdPlaceImage}
          />
          <OpacityPressable
            onPress={() => handleNavigate(secondPlace.username)}>
            <HeadlineText>2. {secondPlace.username}</HeadlineText>
          </OpacityPressable>
        </View>

        <View style={styles.winnerContainer}>
          <Image
            source={{
              uri: thirdPlace.image_url,
            }}
            style={styles.secondAndThirdPlaceImage}
          />
          <OpacityPressable onPress={() => handleNavigate(thirdPlace.username)}>
            <HeadlineText>3. {thirdPlace.username}</HeadlineText>
          </OpacityPressable>
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
  podiumColumnContainer: {
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
