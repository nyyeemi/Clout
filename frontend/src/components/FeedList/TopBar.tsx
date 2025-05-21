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

export const TopBar = ({post}: Props): JSX.Element => {
  const navigation = useNavigation<StackNavigationProp<FeedStackParamList>>();
  const handleNavigate = () => {
    navigation.navigate(Routes.ProfileStack, {
      screen: Routes.Profile,
      params: {username: post.owner.username},
    });
  };

  return (
    <ThemedView style={[globalStyle.flex]}>
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
  container: {
    height: verticalScale(50),
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  profileImage: {
    width: horizontalScale(45),
    height: horizontalScale(45),
    borderRadius: horizontalScale(45),
    marginHorizontal: horizontalScale(10),
  },
});
