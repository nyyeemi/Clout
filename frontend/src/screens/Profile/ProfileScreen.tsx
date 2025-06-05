import React from 'react';

import {NativeStackScreenProps} from '@react-navigation/native-stack';

import globalStyle from '../../assets/styles/globalStyle';
import {Spinner} from '../../components/Spinner/Spinner';
import {ThemedView} from '../../components/ui/themed-view';
import {ThemedText} from '../../components/ui/typography';
import {ProfileStackParamList} from '../../navigation/Routes';
import {
  useGetProfileByUserNameQuery,
  useGetProfilePostsInfiniteQuery,
} from '../../redux/api/endpoints/profiles';
import {ImageList} from './components/ImageList';

type ProfileProps = NativeStackScreenProps<ProfileStackParamList, 'Profile'>;

export const ProfileScreen = ({route}: ProfileProps): JSX.Element => {
  const {username} = route.params;

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
  } = useGetProfilePostsInfiniteQuery(username);

  const allPosts = React.useMemo(
    () => data?.pages?.flatMap(page => page.data) || [],
    [data],
  );

  const {
    data: profileUser = null,
    isLoading: isUserLoading,
    isError: isUserError,
    error: userError,
  } = useGetProfileByUserNameQuery(username);

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
