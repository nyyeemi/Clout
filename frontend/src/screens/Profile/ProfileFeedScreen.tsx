import React, {useMemo} from 'react';

import {StackScreenProps} from '@react-navigation/stack';

import {FeedList} from '../../components/FeedList/FeedList';
import {ProfileStackParamList} from '../../navigation/Routes';
import {useGetProfilePostsInfiniteQuery} from '../../redux/api/endpoints/profiles';

type ImageDetailsProps = StackScreenProps<ProfileStackParamList, 'ProfileFeed'>;

export const ProfileFeedScreen = ({route}: ImageDetailsProps) => {
  const {imageId, username} = route.params || {};
  console.log(route.key);

  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useGetProfilePostsInfiniteQuery(username);

  const allPosts = useMemo(
    () => data?.pages?.flatMap(page => page.data) || [],
    [data],
  );

  const postIndex = useMemo(() => {
    if (!imageId || allPosts.length === 0) {
      return null;
    }
    const index = allPosts.findIndex(post => post.id === imageId);
    return index !== -1 ? index : null;
  }, [imageId, allPosts]);

  console.log({isLoading, isError, postsLength: allPosts.length});

  if (isLoading || (postIndex === null && imageId)) {
    return <></>;
  }

  return (
    <FeedList
      posts={allPosts}
      initalScrollIndex={postIndex}
      isFetchingPosts={isFetchingNextPage}
      refreshing={isLoading}
      onRefresh={refetch}
      hasNextPage={hasNextPage}
      handleEndReached={fetchNextPage}
    />
  );
};
