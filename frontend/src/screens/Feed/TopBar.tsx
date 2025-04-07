import React from 'react';
import globalStyle from '../../assets/styles/globalStyle';
import {ThemedView} from '../../components/ui/themed-view';
import {ThemedText} from '../../components/ui/typography';
import {Pressable, StyleSheet} from 'react-native';
import {horizontalScale, verticalScale} from '../../assets/styles/scaling';
import {useNavigation} from '@react-navigation/native';
import {FeedStackParamList, Routes} from '../../navigation/Routes';
import {StackNavigationProp} from '@react-navigation/stack';
import {CustomImage} from '../../types/types';
import {ProfilePicture} from '../../components/ProfilePicture/ProfilePicture';

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
