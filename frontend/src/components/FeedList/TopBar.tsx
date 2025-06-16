import React from 'react';
import {Pressable, StyleSheet} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import globalStyle from '../../assets/styles/globalStyle';
import {horizontalScale, verticalScale} from '../../assets/styles/scaling';
import {FeedStackParamList, Routes} from '../../navigation/Routes';
import {ProfilePicture} from '../ProfilePicture/ProfilePicture';
import {ThemedView} from '../ui/themed-view';
import {ThemedText} from '../ui/typography';

import {PostType} from '../../types/types';

type Props = {
  post: PostType;
};

export const TopBar = ({post}: Props) => {
  const navigation = useNavigation<StackNavigationProp<FeedStackParamList>>();
  const handleNavigate = () => {
    navigation.navigate(Routes.ProfileStack, {
      screen: Routes.Profile,
      params: {username: post.owner.username},
    });
  };

  return (
    <ThemedView style={style.viewStyle}>
      <Pressable style={style.container} onPress={() => handleNavigate()}>
        <ProfilePicture
          uri={post.owner.profile_picture_url}
          style={style.profileImage}
        />
        <ThemedText variant="heavy">{post.owner.username}</ThemedText>
      </Pressable>
    </ThemedView>
  );
};

const style = StyleSheet.create({
  viewStyle: {
    height: 60,
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 45,
    marginHorizontal: 10,
  },
});
