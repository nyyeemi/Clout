import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import {useTheme} from '@react-navigation/native';

import globalStyle from '../../../assets/styles/globalStyle';
import {
  horizontalScale,
  scaleFontSize,
  verticalScale,
} from '../../../assets/styles/scaling';
import {OpacityPressable} from '../../../components/OpacityPressable/OpacityPressable';
import {ThemedView} from '../../../components/ui/themed-view';
import {ThemedText} from '../../../components/ui/typography';
import {
  useCreateFollowMutation,
  useDeleteFollowMutation,
  useGetUsersMeQuery,
} from '../../../redux/api/endpoints/users';
import {ProfileStatsRow} from './ProfileStatsRow';

import {ProfileType} from '../../../types/types';

export const ProfileInfoCard = ({
  profileUser,
  num_posts,
}: {
  profileUser: ProfileType;
  num_posts: number;
}): JSX.Element => {
  const {colors} = useTheme();
  const {data: loggedInUser} = useGetUsersMeQuery();
  const loggedInUserId = loggedInUser?.id;
  const [followUser, {isLoading: isFollowingUser}] = useCreateFollowMutation();
  const [unfollowUser, {isLoading: isUnfollowingUser}] =
    useDeleteFollowMutation();
  const isMutationLoading = isFollowingUser || isUnfollowingUser;
  const [isFollowing, setIsFollowing] = useState(
    profileUser.is_followed_by_current_user,
  );

  const handleFollowToggle = useCallback(async () => {
    if (!loggedInUserId || isMutationLoading) {
      return;
    }
    const mutationPayload = {
      user_id: profileUser.id,
      username: profileUser.username,
    };
    try {
      if (isFollowing) {
        await unfollowUser(mutationPayload).unwrap();
      } else {
        await followUser(mutationPayload).unwrap();
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Failed to toggle follow state:', error);
    }
  }, [
    loggedInUserId,
    profileUser,
    isFollowing,
    followUser,
    unfollowUser,
    isMutationLoading,
  ]);

  const showButton = isFollowing !== null; //null field for current user
  const buttonText = isFollowing ? 'Following' : 'Follow';

  const dynamicButtonStyle: StyleProp<ViewStyle> = isFollowing
    ? [
        styles.button,
        {borderColor: colors.primary, backgroundColor: colors.background},
      ]
    : [
        styles.button,
        {backgroundColor: colors.primary, borderColor: colors.primary},
      ];

  const dynamicButtonTextStyle = isFollowing
    ? [styles.buttonText, {color: colors.primary}]
    : [styles.buttonText, {color: colors.card}];

  return (
    <ThemedView style={styles.container}>
      <ProfileStatsRow user={profileUser} num_posts={num_posts} />
      <View style={styles.defaultMargin}>
        <ThemedText style={styles.name}>{profileUser.username}</ThemedText>
        {profileUser.bio ? <ThemedText>{profileUser.bio}</ThemedText> : null}
      </View>
      {showButton && (
        <View style={styles.buttonContainer}>
          <OpacityPressable
            style={dynamicButtonStyle}
            onPress={handleFollowToggle}
            disabled={isMutationLoading}>
            {isMutationLoading ? (
              <ActivityIndicator
                size="small"
                color={isFollowing ? colors.primary : colors.card}
              />
            ) : (
              <ThemedText style={dynamicButtonTextStyle}>
                {buttonText}
              </ThemedText>
            )}
          </OpacityPressable>
        </View>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    paddingHorizontal: globalStyle.defaultPadding.paddingHorizontal,
    paddingVertical: 5,
  },
  button: {
    paddingVertical: horizontalScale(5),
    paddingHorizontal: horizontalScale(15),
    flexGrow: 1,
    maxWidth: '90%',
    alignSelf: 'center',
    borderRadius: 8,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 35,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
  },
  buttonContainer: {
    paddingBottom: verticalScale(10),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  defaultMargin: {
    marginVertical: verticalScale(10),
  },
  name: {
    fontWeight: 'bold',
    fontSize: scaleFontSize(16),
    marginBottom: verticalScale(4),
  },
});
