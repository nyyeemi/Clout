import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {View} from 'react-native';
import {ProfileStackParamList} from '../../../navigation/Routes';
import {CustomPressable} from '../CustomPressable';
import {CustomUser} from './ProfileInfoCard';
import {style} from '../style';
import {ProfilePicture} from './ProfilePicture';
import {UserInfoBox} from './UserInfoBox';

export const UserInfoBar = ({user}: {user: CustomUser}): JSX.Element => {
  const navigation =
    useNavigation<StackNavigationProp<ProfileStackParamList>>();
  const onPress = () => {
    navigation.navigate('Followers');
  };
  return (
    <View style={style.infoBar}>
      <ProfilePicture uri={user.profile_picture_url} />
      <UserInfoBox count={user.num_posts} text={'posts'} />
      <CustomPressable onPress={onPress} style={style.box}>
        <UserInfoBox count={user.num_following} text={'following'} />
      </CustomPressable>
      <CustomPressable onPress={onPress} style={style.box}>
        <UserInfoBox count={user.num_followers} text={'followers'} />
      </CustomPressable>
    </View>
  );
};
