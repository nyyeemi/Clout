import React, {useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

import {useNavigation, useTheme} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {RootStackParamList, Routes} from '../../navigation/Routes';
import {useGetUsersMeQuery} from '../../redux/api/endpoints/users';
import {OpacityPressable} from '../OpacityPressable/OpacityPressable';
import {ProfilePicture} from '../ProfilePicture/ProfilePicture';
import {ThemedText} from '../ui/typography';

import {CustomUser, ProfileFollowerType} from '../../types/types';

type UserListItemProps = {
  user: CustomUser | ProfileFollowerType;
  isFollowedByLoggedInUser: boolean;
  onFollowToggle: (user_id: string, currentlyFollowing: boolean) => void;
  isLoadingToggle?: boolean;
  size?: 'small' | 'medium' | 'large';
  onItemPress?: () => void;
};

export const UserListItem = ({
  user,
  isFollowedByLoggedInUser,
  onFollowToggle,
  isLoadingToggle = false,
  size = 'small',
  onItemPress,
}: UserListItemProps) => {
  const {colors} = useTheme();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const {data: loggedInUser} = useGetUsersMeQuery();
  const [isFollowing, setIsFollowing] = useState(isFollowedByLoggedInUser);
  const handlePressProfile = () => {
    onItemPress?.();
    navigation.navigate(Routes.ProfileStack, {
      screen: Routes.Profile,
      params: {username: user.username},
    });
  };
  const handleFollowPress = () => {
    onFollowToggle(user.id, isFollowedByLoggedInUser);
    setIsFollowing(!isFollowing);
  };

  const shouldShowFollowButton = loggedInUser && user.id !== loggedInUser.id;
  //const isFollowing = isFollowedByLoggedInUser;

  const buttonStyle = isFollowing
    ? [
        styles.followButton,
        styles.followingButton,
        {borderColor: colors.primary},
      ]
    : [
        styles.followButton,
        {backgroundColor: colors.primary, borderColor: colors.primary},
      ];

  const buttonTextStyle = isFollowing
    ? [styles.buttonText, {color: colors.primary}]
    : styles.buttonText;

  const buttonText = isFollowing ? 'Following' : 'Follow';

  return (
    <View style={styles.container}>
      <OpacityPressable
        onPress={handlePressProfile}
        style={styles.profileWrapper}>
        <ProfilePicture uri={user.profile_picture_url} size={size} />
        <View style={styles.textContainer}>
          <ThemedText style={styles.username} numberOfLines={1}>
            {user.username}
          </ThemedText>
          <ThemedText style={styles.displayName}>
            {`${user.first_name} ${user.last_name}`}
          </ThemedText>
        </View>
      </OpacityPressable>

      {shouldShowFollowButton && (
        <OpacityPressable
          style={buttonStyle}
          onPress={handleFollowPress}
          disabled={isLoadingToggle}>
          {isLoadingToggle ? (
            <ActivityIndicator
              size="small"
              color={isFollowing ? colors.primary : colors.card}
            />
          ) : (
            <ThemedText style={buttonTextStyle}>{buttonText}</ThemedText>
          )}
        </OpacityPressable>
      )}
    </View>
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
    flex: 0.45,
    alignSelf: 'center',
    borderWidth: StyleSheet.hairlineWidth * 5,
  },
  followingButton: {
    borderWidth: StyleSheet.hairlineWidth * 5,
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
