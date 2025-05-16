import React from 'react';
import {StyleSheet, View} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {OpacityPressable} from '../../../components/OpacityPressable/OpacityPressable';
import {ProfilePicture} from '../../../components/ProfilePicture/ProfilePicture';
import {ThemedText} from '../../../components/ui/typography';
import {ProfileStackParamList} from '../../../navigation/Routes';

import {CustomUser} from '../../../types/types';

export const ProfileStatsRow = ({
  user,
  num_posts,
}: {
  user: CustomUser;
  num_posts: number;
}): JSX.Element => {
  //  const {data: following = []} = useGetUserFollowingQuery(user.id);
  //  const {data: followers = []} = useGetUserFollowersQuery(user.id);

  const navigation =
    useNavigation<StackNavigationProp<ProfileStackParamList>>();
  const onPressFollowing = () => {
    navigation.navigate('Followers', {index: 0, username: user.username});
  };
  const onPressFollowers = () => {
    navigation.navigate('Followers', {index: 1, username: user.username});
  };
  return (
    <View style={styles.container}>
      <ProfilePicture uri={user.profile_picture_url} />
      <ProfileStatItem value={num_posts} label={'posts'} />
      <OpacityPressable onPress={onPressFollowing} style={styles.statItem}>
        <ProfileStatItem value={user.num_following} label={'following'} />
      </OpacityPressable>
      <OpacityPressable onPress={onPressFollowers} style={styles.statItem}>
        <ProfileStatItem value={user.num_followers} label={'followers'} />
      </OpacityPressable>
    </View>
  );
};

const ProfileStatItem = ({
  value,
  label,
}: {
  value: number;
  label: string;
}): JSX.Element => {
  return (
    <View style={styles.statItem}>
      <ThemedText style={styles.statValue}>{value}</ThemedText>
      <ThemedText style={styles.statText}>{label}</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 7,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  statValue: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  statText: {
    textAlign: 'center',
  },
});
