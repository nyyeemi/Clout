import React, {useMemo} from 'react';

import {FeedList} from '../../components/FeedList/FeedList';
import {useGetFeedPostsInfiniteQuery} from '../../redux/api/endpoints/posts';

export const FeedScreen = () => {
  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useGetFeedPostsInfiniteQuery();

  const feedPosts = useMemo(
    () => data?.pages?.flatMap(page => page.data) || [],
    [data],
  );

  return (
    <FeedList
      posts={feedPosts}
      handleEndReached={fetchNextPage}
      isFetchingPosts={isFetchingNextPage}
      refreshing={isLoading}
      hasNextPage={hasNextPage}
      onRefresh={refetch}
    />
  );
};
