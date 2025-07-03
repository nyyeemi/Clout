import React, {useEffect} from 'react';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {StackNavigationProp} from '@react-navigation/stack';
import {skipToken} from '@reduxjs/toolkit/query';

import globalStyle from '../../assets/styles/globalStyle';
import {Spinner} from '../../components/Spinner/Spinner';
import {ThemedView} from '../../components/ui/themed-view';
import {ThemedText} from '../../components/ui/typography';
import {ProfileStackParamList} from '../../navigation/Routes';
import {
  useGetProfileByUserNameQuery,
  useGetProfilePostsInfiniteQuery,
} from '../../redux/api/endpoints/profiles';
import {useGetUsersMeQuery} from '../../redux/api/endpoints/users';
import {ImageList} from './components/ImageList';

type ProfileProps = NativeStackScreenProps<ProfileStackParamList, 'Profile'>;

export const ProfileScreen = ({route, navigation}: ProfileProps) => {
  const {
    data: loggedInUser,
    isError,
    isLoading: isLoadingMe,
  } = useGetUsersMeQuery(undefined, {skip: !!route.params});

  const username = route.params?.username
    ? route.params.username
    : loggedInUser?.username;

  useEffect(() => {
    if (loggedInUser) {
      navigation.setOptions({title: loggedInUser.username});
    }
  }, [loggedInUser]);

  const {
    data, // Contains { pages: PostTypeWithCount[], pageParams: ProfilePostsPageParam[] }
    //isFetching,
    isLoading,
    isError: isPostsError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useGetProfilePostsInfiniteQuery(username ? username : skipToken);

  const allPosts = React.useMemo(
    () => data?.pages?.flatMap(page => page.data) || [],
    [data],
  );

  const {
    data: profileUser = null,
    isLoading: isUserLoading,
    isError: isUserError,
    error: userError,
  } = useGetProfileByUserNameQuery(username ? username : skipToken);

  if (isUserLoading) {
    return <Spinner />;
  }

  if (!profileUser || isUserError) {
    console.error('Error fetching data:', userError);
    return (
      <ThemedView>
        <ThemedText>Error getting profile</ThemedText>
      </ThemedView>
    );
  }

  if (isPostsError) {
    console.error('Error fetching posts:', error);
  }

  return (
    <ThemedView style={[globalStyle.flex]}>
      <ImageList
        posts={allPosts}
        profileUser={profileUser}
        isFetchingPosts={isFetchingNextPage}
        isLoadingPosts={isLoading}
        isErrorPosts={isPostsError}
        refreshing={isLoading}
        onRefresh={refetch}
        hasNextPage={hasNextPage}
        handleEndReached={fetchNextPage}
      />
    </ThemedView>
  );
};
