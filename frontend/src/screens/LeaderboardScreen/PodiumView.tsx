import {
  Dimensions,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';

import {skipToken} from '@reduxjs/toolkit/query';
import {Image} from 'expo-image';

import {CloudBadge} from '../../components/Icons/CloudBadge';
import {ProfilePicture} from '../../components/ProfilePicture/ProfilePicture';
import {HeadlineText, Title1Text} from '../../components/ui/typography';
import {useTheme} from '../../hooks/useTheme';
import {LeaderboardEntryType} from '../../redux/api/endpoints/competitions';
import {useGetProfilePictureByUsernameQuery} from '../../redux/api/endpoints/users';

type PodiumViewProps = {
  podiumData: LeaderboardEntryType[];
  handleNavigate: (username: string) => void;
  onImagePress: (url: string) => void;
};

export const PodiumView = ({
  podiumData,
  handleNavigate,
  onImagePress,
}: PodiumViewProps) => {
  const {colors} = useTheme();
  const firstPlace = podiumData[0];
  const secondPlace = podiumData[1];
  const thirdPlace = podiumData[2];

  const {data, error} = useGetProfilePictureByUsernameQuery(
    firstPlace.username ? firstPlace.username : skipToken,
  );

  return (
    <View style={styles.podiumColumnContainer}>
      <View style={styles.winnerContainer}>
        <View>
          <TouchableHighlight
            style={{
              borderRadius: styles.winnerImage.borderRadius,
            }}
            onPress={() => onImagePress(firstPlace.image_url)}>
            <View style={styles.imageShadow}>
              <Image
                source={{
                  uri: firstPlace.image_url,
                }}
                style={styles.winnerImage}
              />
            </View>
          </TouchableHighlight>

          <View style={styles.numberOne}>
            <CloudBadge
              size={NUMBER_ONE}
              bg={'#FFD700'}
              border={'#FFD700'}
              text="1"
              textSize="large"
            />
          </View>
        </View>
        <TouchableOpacity onPress={() => handleNavigate(firstPlace.username)}>
          <View style={styles.winnerName}>
            <ProfilePicture uri={data?.profile_picture_url} size="minimal" />
            <Title1Text variant="bold">{firstPlace.username}</Title1Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.podiumRowContainer}>
        <View style={styles.winnerContainer}>
          <View>
            <TouchableHighlight
              style={{
                borderRadius: styles.secondAndThirdPlaceImage.borderRadius,
              }}
              onPress={() => onImagePress(secondPlace.image_url)}>
              <View style={styles.imageShadow}>
                <Image
                  source={{
                    uri: secondPlace.image_url,
                  }}
                  style={styles.secondAndThirdPlaceImage}
                />
              </View>
            </TouchableHighlight>
            <View style={styles.numberTwoAndThree}>
              <CloudBadge
                size={NUMBER_TWO_AND_THREE}
                bg={'#C0C0C0'}
                border={'#C0C0C0'}
                text="2"
                textSize="small"
              />
            </View>
          </View>
          <TouchableOpacity
            onPress={() => handleNavigate(secondPlace.username)}>
            <HeadlineText variant="bold">{secondPlace.username}</HeadlineText>
          </TouchableOpacity>
        </View>

        <View style={styles.winnerContainer}>
          <View>
            <TouchableHighlight
              style={{
                borderRadius: styles.secondAndThirdPlaceImage.borderRadius,
              }}
              onPress={() => onImagePress(secondPlace.image_url)}>
              <View style={styles.imageShadow}>
                <Image
                  source={{
                    uri: thirdPlace.image_url,
                  }}
                  style={styles.secondAndThirdPlaceImage}
                />
              </View>
            </TouchableHighlight>
            <View style={styles.numberTwoAndThree}>
              <CloudBadge
                size={NUMBER_TWO_AND_THREE}
                bg={'#CD7F32'}
                border={'#CD7F32'}
                text="3"
                textSize="small"
              />
            </View>
          </View>
          <TouchableOpacity onPress={() => handleNavigate(thirdPlace.username)}>
            <HeadlineText variant="bold">{thirdPlace.username}</HeadlineText>
          </TouchableOpacity>
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
const NUMBER_ONE = 60;
const NUMBER_TWO_AND_THREE = 40;

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
  winnerContainer: {alignItems: 'center', gap: 20},
  winnerImage: {
    width: WINNER_IMAGE_WIDTH,
    height: WINNER_IMAGE_HEIGHT,
    borderRadius: 5,
  },
  numberOne: {
    position: 'absolute',
    width: NUMBER_ONE,
    height: NUMBER_ONE,
    alignItems: 'center',
    bottom: -27,
    left: WINNER_IMAGE_WIDTH / 2 - NUMBER_ONE / 2,
  },
  numberTwoAndThree: {
    position: 'absolute',
    width: NUMBER_TWO_AND_THREE,
    height: NUMBER_TWO_AND_THREE,
    alignItems: 'center',
    bottom: -18,
    left: PODIUM_IMAGE_WIDTH / 2 - NUMBER_TWO_AND_THREE / 2,
  },
  winnerName: {flexDirection: 'row', alignItems: 'center', gap: 10},
  secondAndThirdPlaceImage: {
    width: PODIUM_IMAGE_WIDTH,
    height: PODIUM_IMAGE_HEIGHT,
    borderRadius: 5,
  },
  imageShadow: {
    // iOS
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 2,
    shadowOffset: {width: 0, height: 1},

    // Android
    elevation: 2,
  },
});
