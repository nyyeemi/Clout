import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ProfileStackParamList} from '../../../navigation/Routes';
import {OpacityPressable} from '../../../components/OpacityPressable/OpacityPressable';
import {ProfilePicture} from '../../../components/ProfilePicture/ProfilePicture';
import {ThemedText} from '../../../components/ui/typography';
import {CustomUser} from '../../Vote/mock';
//import { useGetUserFollowersQuery, useGetUserFollowingQuery } from '../../../redux/slices/apiSlice';

export const ProfileStatsRow = ({user}: {user: CustomUser}): JSX.Element => {
  //  const {data: following = []} = useGetUserFollowingQuery(user.id);
  //  const {data: followers = []} = useGetUserFollowersQuery(user.id);

  const navigation =
    useNavigation<StackNavigationProp<ProfileStackParamList>>();
  const onPress = () => {
    navigation.navigate('Followers', {userId: user.id});
  };
  return (
    <View style={styles.container}>
      <ProfilePicture uri={user.profile_picture_url} />
      <ProfileStatItem value={user.num_posts} label={'posts'} />
      <OpacityPressable onPress={onPress} style={styles.statItem}>
        <ProfileStatItem value={user.num_following} label={'following'} />
      </OpacityPressable>
      <OpacityPressable onPress={onPress} style={styles.statItem}>
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
