import React from 'react';
import {Pressable, StyleSheet} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import globalStyle from '../../assets/styles/globalStyle';
import {horizontalScale, verticalScale} from '../../assets/styles/scaling';
import {ProfilePicture} from '../../components/ProfilePicture/ProfilePicture';
import {ThemedView} from '../../components/ui/themed-view';
import {ThemedText} from '../../components/ui/typography';
import {FeedStackParamList, Routes} from '../../navigation/Routes';

import {CustomImage} from '../../types/types';

type Props = {
  post: CustomImage;
};

export const TopBar = ({post}: Props): JSX.Element => {
  const navigation = useNavigation<StackNavigationProp<FeedStackParamList>>();
  const handleNavigate = () => {
    navigation.navigate(Routes.ProfileStack, {
      screen: Routes.Profile,
      params: {userId: post.user.id, username: post.user.username},
    });
  };

  return (
    <ThemedView style={[globalStyle.flex]}>
      <Pressable style={style.container} onPress={() => handleNavigate()}>
        <ProfilePicture
          uri={post.user.profile_picture_url}
          style={style.profileImage}
        />
        <ThemedText variant="heavy">{post.user.username}</ThemedText>
      </Pressable>
    </ThemedView>
  );
};

//TODO: Maybe profilepicture should have size prop instead of everytime styling it?
//Also should border come from theme?
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
