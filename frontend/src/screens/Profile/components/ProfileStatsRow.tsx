import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ProfileStackParamList} from '../../../navigation/Routes';
import {CustomPressable} from '../CustomPressable';
import {CustomUser} from './ProfileInfoCard';
import {ProfilePicture} from './ProfilePicture';

export const ProfileStatsRow = ({user}: {user: CustomUser}): JSX.Element => {
  const navigation =
    useNavigation<StackNavigationProp<ProfileStackParamList>>();
  const onPress = () => {
    navigation.navigate('Followers');
  };
  return (
    <View style={styles.container}>
      <ProfilePicture uri={user.profile_picture_url} />
      <ProfileStatItem value={user.num_posts} label={'posts'} />
      <CustomPressable onPress={onPress} style={styles.statItem}>
        <ProfileStatItem value={user.num_following} label={'following'} />
      </CustomPressable>
      <CustomPressable onPress={onPress} style={styles.statItem}>
        <ProfileStatItem value={user.num_followers} label={'followers'} />
      </CustomPressable>
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
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statText}>{label}</Text>
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
