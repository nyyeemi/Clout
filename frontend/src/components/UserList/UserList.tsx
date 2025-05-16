import React, {useCallback, useMemo, useState} from 'react';
import {FlatList, StyleSheet, TextInput} from 'react-native';

import {BottomSheetFlatList, BottomSheetTextInput} from '@gorhom/bottom-sheet';
import {useTheme} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {verticalScale} from '../../assets/styles/scaling';
import {
  useCreateFollowMutation,
  useDeleteFollowMutation,
} from '../../redux/api/endpoints/users';
import {ThemedText} from '../ui/typography';
import {UserListItem} from './UserListItem';

import {CustomUser, ProfileFollowerType} from '../../types/types';

type UserListType = {
  data: CustomUser[] | ProfileFollowerType[];
  onItemPress?: () => void;
  onModal?: boolean;
  currentProfileUserName?: string;
  isFetchingData?: boolean;
};

// todo: add options for size and searchbarvisible
export const UserList = ({
  data,
  onItemPress,
  onModal = false,
  currentProfileUserName,
  isFetchingData,
}: UserListType): JSX.Element => {
  const [value, setValue] = useState('');
  const {colors} = useTheme();
  const insets = useSafeAreaInsets();
  const [togglingUserId, setTogglingUserId] = useState<string | null>(null);

  console.log(data);
  const [followUser, {isLoading: isFollowingUser}] = useCreateFollowMutation();
  const [unfollowUser, {isLoading: isUnfollowingUser}] =
    useDeleteFollowMutation();

  const isMutationLoading = isFollowingUser || isUnfollowingUser;

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
    async (user_id: string, currentlyFollowing: boolean) => {
      if (isMutationLoading) {
        return;
      }
      const mutationPayload = {
        user_id,
        username: currentProfileUserName ?? '', //invalidatetag
      };
      console.log(mutationPayload);
      setTogglingUserId(user_id);

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
    [followUser, unfollowUser, isMutationLoading, currentProfileUserName],
  );

  const renderItem = useCallback(
    ({item}: {item: ProfileFollowerType}) => {
      const isFollowed = item.is_followed_by_current_user;
      const isLoadingThisItem =
        (isMutationLoading && togglingUserId === item.id) || isFetchingData;

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
      handleFollowToggle,
      isMutationLoading,
      togglingUserId,
      onItemPress,
      isFetchingData,
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
