import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {scaleFontSize, verticalScale} from '../../../assets/styles/scaling';
import {style} from '../style';
import globalStyle from '../../../assets/styles/globalStyle';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {ProfileStackParamList} from '../../../navigation/Routes';
import {ButtonRow} from './ButtonRow';
import {ProfileStatsRow} from './ProfileStatsRow';

export type CustomUser = {
  id: number;
  username: string;
  email: string;
  bio?: string;
  num_followers: number;
  num_following: number;
  profile_picture_url: string;
  num_posts: number;
};

export const ProfileInfoCard = ({user}: {user: CustomUser}): JSX.Element => {
  const navigation =
    useNavigation<StackNavigationProp<ProfileStackParamList>>();
  const renderButton = (text: string) => (
    <Text style={styles.buttonText}>{text}</Text>
  );

  const profileActionButtons = [
    {
      component: renderButton('Edit profile'),
      onPress: () => navigation.navigate('EditProfile'),
      style: style.button,
    },
    {
      component: renderButton('Share profile'),
      onPress: () => console.log('press share profile'),
      style: style.button,
    },
  ];

  return (
    <View style={styles.container}>
      <ProfileStatsRow user={user} />
      <View style={styles.defaultMargin}>
        <Text style={style.name}>{user.username}</Text>
        <Text>{user.bio}</Text>
      </View>
      <ButtonRow
        buttons={profileActionButtons}
        containerStyle={styles.buttonContainer}
      />
      <View style={style.divider} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //marginVertical: verticalScale(10),
    flexDirection: 'column',
    paddingHorizontal: globalStyle.defaultPadding.paddingHorizontal,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: scaleFontSize(15),
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  defaultMargin: {
    marginVertical: verticalScale(10),
  },
});
