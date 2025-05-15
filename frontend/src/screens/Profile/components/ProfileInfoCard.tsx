import React, {useCallback, useMemo} from 'react';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import {useTheme} from '@react-navigation/native';
import {useSelector} from 'react-redux';

import globalStyle from '../../../assets/styles/globalStyle';
import {
  horizontalScale,
  scaleFontSize,
  verticalScale,
} from '../../../assets/styles/scaling';
import {OpacityPressable} from '../../../components/OpacityPressable/OpacityPressable';
import {ThemedView} from '../../../components/ui/themed-view';
import {ThemedText} from '../../../components/ui/typography';
import {useGetUsersMeQuery} from '../../../redux/api/endpoints/users';
import {
  useFollowUserMutation,
  useGetUserFollowingQuery,
  useUnFollowUserMutation,
} from '../../../redux/slices/mockApiSlice';
import {RootState} from '../../../redux/store/store';
import {ProfileStatsRow} from './ProfileStatsRow';

import {CustomUser} from '../../../types/types';

export const ProfileInfoCard = ({
  user,
  num_posts,
}: {
  user: CustomUser;
  num_posts: number;
}): JSX.Element => {
  const {colors} = useTheme();
  const {data: loggedInUser, isError, isLoading} = useGetUsersMeQuery();
  const loggedInUserId = loggedInUser?.id;

  const {
    data: loggedInUserFollowingData = [],
    isLoading: isLoadingLoggedInUserFollowing,
  } = useGetUserFollowingQuery(loggedInUserId ?? -1, {skip: !loggedInUserId});

  const [followUser, {isLoading: isFollowingUser}] = useFollowUserMutation();
  const [unfollowUser, {isLoading: isUnfollowingUser}] =
    useUnFollowUserMutation();
  const isMutationLoading = isFollowingUser || isUnfollowingUser;

  const followedUserIds = useMemo(() => {
    if (
      !loggedInUserFollowingData ||
      isLoadingLoggedInUserFollowing ||
      !Array.isArray(loggedInUserFollowingData)
    ) {
      return new Set<number>();
    }
    return new Set(loggedInUserFollowingData.map((u: CustomUser) => u.id));
  }, [loggedInUserFollowingData, isLoadingLoggedInUserFollowing]);

  const isFollowing = useMemo(() => {
    if (!loggedInUserId || isLoadingLoggedInUserFollowing) {
      return false;
    }
    return followedUserIds.has(user.id);
  }, [
    loggedInUserId,
    user.id,
    followedUserIds,
    isLoadingLoggedInUserFollowing,
  ]);

  const handleFollowToggle = useCallback(async () => {
    if (
      !loggedInUserId ||
      isMutationLoading ||
      isLoadingLoggedInUserFollowing
    ) {
      return;
    }
    const mutationPayload = {user_id1: loggedInUserId, user_id2: user.id};
    try {
      if (isFollowing) {
        await unfollowUser(mutationPayload).unwrap();
      } else {
        await followUser(mutationPayload).unwrap();
      }
    } catch (error) {
      console.error('Failed to toggle follow state:', error);
    }
  }, [
    loggedInUserId,
    user.id,
    isFollowing,
    followUser,
    unfollowUser,
    isMutationLoading,
    isLoadingLoggedInUserFollowing,
  ]);

  const showButton = loggedInUserId && loggedInUserId !== user.id;
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
      <ProfileStatsRow user={user} num_posts={num_posts} />
      <View style={styles.defaultMargin}>
        <ThemedText style={styles.name}>{user.username}</ThemedText>
        {user.bio ? <ThemedText>{user.bio}</ThemedText> : null}
      </View>
      {showButton && (
        <View style={styles.buttonContainer}>
          <OpacityPressable
            style={dynamicButtonStyle}
            onPress={handleFollowToggle}
            disabled={isLoadingLoggedInUserFollowing || isMutationLoading}>
            {isMutationLoading ||
            (isLoadingLoggedInUserFollowing &&
              !loggedInUserFollowingData.length) ? (
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
