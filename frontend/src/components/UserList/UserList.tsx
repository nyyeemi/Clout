import React, {useCallback, useMemo, useState} from 'react';
import {FlatList, StyleSheet, TextInput} from 'react-native';

import {BottomSheetFlatList, BottomSheetTextInput} from '@gorhom/bottom-sheet';
import {useTheme} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';

import {verticalScale} from '../../assets/styles/scaling';
import {
  useFollowUserMutation,
  useGetUserFollowingQuery,
  useUnFollowUserMutation,
} from '../../redux/slices/mockApiSlice';
import {RootState} from '../../redux/store/store';
import {ThemedView} from '../ui/themed-view';
import {ThemedText} from '../ui/typography';
import {UserListItem} from './UserListItem';

import {CustomUser} from '../../types/types';

type UserListType = {
  data: CustomUser[];
  onItemPress?: () => void;
  onModal: boolean;
};

// todo: add options for size and searchbarvisible
export const UserList = ({
  data,
  onItemPress,
  onModal,
}: UserListType): JSX.Element => {
  const [value, setValue] = useState('');
  const {colors} = useTheme();
  const loggedInUser = useSelector((state: RootState) => state.user.user);
  const insets = useSafeAreaInsets();

  const [togglingUserId, setTogglingUserId] = useState<number | null>(null);

  const {
    data: loggedInUserFollowingData = [],
    isLoading: isLoadingLoggedInUserFollowing,
    isError: isErrorFollowing,
  } = useGetUserFollowingQuery(loggedInUser?.id ?? -1, {
    skip: !loggedInUser?.id,
  });

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
    return new Set(
      loggedInUserFollowingData.map((user: CustomUser) => user.id),
    );
  }, [loggedInUserFollowingData, isLoadingLoggedInUserFollowing]);

  const filteredList = useMemo(() => {
    const searchTerm = value.trim().toLowerCase();
    if (!searchTerm) {
      return data;
    }
    return data.filter(
      user =>
        user.username.toLowerCase().includes(searchTerm) ||
        `${user.first_name} ${user.last_name}`
          .toLowerCase()
          .includes(searchTerm),
    );
  }, [value, data]);

  const handleFollowToggle = useCallback(
    async (userIdToToggle: number, currentlyFollowing: boolean) => {
      if (loggedInUser?.id === undefined || isMutationLoading) {
        return;
      }

      setTogglingUserId(userIdToToggle);

      const mutationPayload = {
        user_id1: loggedInUser.id,
        user_id2: userIdToToggle,
      };

      try {
        if (currentlyFollowing) {
          await unfollowUser(mutationPayload).unwrap();
        } else {
          await followUser(mutationPayload).unwrap();
        }
      } catch (error) {
        console.error('Failed to toggle follow state:', error);
      } finally {
        setTogglingUserId(null);
      }
    },
    [loggedInUser?.id, followUser, unfollowUser, isMutationLoading],
  );

  const renderItem = useCallback(
    ({item}: {item: CustomUser}) => {
      const isFollowed = followedUserIds.has(item.id);
      const isLoadingThisItem = isMutationLoading && togglingUserId === item.id;

      return (
        <UserListItem
          user={item}
          isFollowedByLoggedInUser={isFollowed}
          onFollowToggle={handleFollowToggle}
          isLoadingToggle={isLoadingThisItem}
          onItemPress={onItemPress}
        />
      );
    },
    [
      followedUserIds,
      handleFollowToggle,
      isMutationLoading,
      togglingUserId,
      onItemPress,
    ],
  );

  const SearchInput = onModal ? BottomSheetTextInput : TextInput;

  const renderListHeader = (
    <SearchInput
      placeholder="Search"
      inputMode="search"
      autoCapitalize="none"
      clearButtonMode="while-editing"
      style={[
        styles.input,
        {
          backgroundColor: colors.card,
          color: colors.text,
          borderColor: colors.border,
        },
      ]}
      value={value}
      onChangeText={setValue}
      placeholderTextColor={colors.border}
    />
  );
  /*
  if (isLoadingLoggedInUserFollowing && !loggedInUserFollowingData?.length) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </ThemedView>
    );
  }*/
  if (isErrorFollowing) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText>Error loading follow status.</ThemedText>
      </ThemedView>
    );
  }

  const FlatListComponent = onModal ? BottomSheetFlatList : FlatList;

  return (
    <FlatListComponent
      ListEmptyComponent={
        <ThemedText style={styles.listEmptyText}>No users found</ThemedText>
      }
      ListHeaderComponent={renderListHeader}
      data={filteredList ?? []}
      keyExtractor={item => String(item.id)}
      renderItem={renderItem}
      extraData={{
        followedUserIds,
        togglingUserId,
        isMutationLoading,
      }}
      getItemLayout={(_data, index) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
      })}
      keyboardDismissMode="on-drag"
      contentContainerStyle={onModal && {paddingBottom: insets.bottom}}
    />
  );
};

//TODO: check this value
const ITEM_HEIGHT = verticalScale(50);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    //alignItems: 'center',
    //justifyContent: 'center',
    //backgroundColor: 'white',
  },
  containerModal: {
    flex: 1,
    flexDirection: 'column',
    paddingBottom: 30,
    backgroundColor: 'transparent',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    color: 'white',
  },
  actionBar: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    gap: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  actionPressable: {
    alignSelf: 'stretch',
    flex: 1,
    paddingBottom: 15,
  },
  actionText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  listEmptyText: {
    fontSize: 17,
    fontWeight: '900',
    color: 'gray',
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
