import React from 'react';
import {useNavigation, useTheme} from '@react-navigation/native';
import {View, StyleSheet} from 'react-native';
import {ThemedView} from '../ui/themed-view';
import {ProfileStackParamList, Routes} from '../../navigation/Routes';
import {CustomUser} from '../../screens/Vote/mock';
import {ThemedText} from '../ui/typography';
import {StackNavigationProp} from '@react-navigation/stack';
import {ProfilePicture} from '../ProfilePicture/ProfilePicture';
import {OpacityPressable} from '../OpacityPressable/OpacityPressable';

type UserListItemProps = {
  user: CustomUser;
  size?: 'small' | 'medium' | 'large';
};

export const UserListItem = ({user, size = 'small'}: UserListItemProps) => {
  // query here to retrieve data from followers/following table
  const {colors} = useTheme();

  const navigation =
    useNavigation<StackNavigationProp<ProfileStackParamList>>();

  const handlePress = () => {
    navigation.push(Routes.Profile, {userId: user.id, username: user.username});
  };

  return (
    <ThemedView style={styles.container}>
      <OpacityPressable onPress={handlePress} style={styles.profileWrapper}>
        <ProfilePicture uri={user.profile_picture_url} size={size} />
        <View style={styles.textContainer}>
          <ThemedText style={styles.username}>{user.username}</ThemedText>
          <ThemedText style={styles.displayName}>
            {`${user.first_name} ${user.last_name}`}
          </ThemedText>
        </View>
      </OpacityPressable>
      <OpacityPressable
        style={[styles.followButton, {backgroundColor: colors.primary}]}
        onPress={() => console.log('follow pressed')}>
        <ThemedText style={styles.buttonText}>Follow</ThemedText>
      </OpacityPressable>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  profileWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  profileImage: {
    marginRight: 12,
  },
  textContainer: {
    flexDirection: 'column',
  },
  username: {
    fontWeight: 'bold',
  },
  displayName: {
    color: 'gray',
  },
  followButton: {
    paddingVertical: 4,
    borderRadius: 6,
    flex: 0.4,
    alignSelf: 'center',
    //borderWidth: StyleSheet.hairlineWidth * 5,
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
