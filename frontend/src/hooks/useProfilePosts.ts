// useProfilePosts.ts
import {useEffect, useState} from 'react';

import {useGetProfilePostsByUserNameQuery} from '../redux/api/endpoints/profiles';

import {PostType} from '../types/types';

export const useProfilePosts = (username: string, limit: number = 18) => {
  const [allPosts, setAllPosts] = useState<PostType[]>([]);
  const [lastPostDate, setLastPostDate] = useState<string>('');
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const {
    data: posts = {data: [], count: 0},
    isFetching,
    isLoading,
    isError,
    error,
  } = useGetProfilePostsByUserNameQuery({
    username: username,
    last_post_created_at: lastPostDate,
    limit: limit,
  });

  useEffect(() => {
    if (!refreshing) {
      if (posts.count) {
        setAllPosts(prev => [...prev, ...posts.data]);
        setHasMore(posts.count === limit);
      } else {
        setHasMore(false);
      }
    } else {
      setRefreshing(false);
    }
  }, [limit, posts.count, posts.data, refreshing]);

  const handleEndReached = () => {
    if (!isFetching && hasMore) {
      setLastPostDate(allPosts.at(-1)?.created_at ?? '');
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setHasMore(true);
    setAllPosts([]);
    setLastPostDate('');
  };

  const isInitializing = isLoading || (allPosts.length === 0 && !!posts);

  return {
    posts: allPosts,
    onRefresh,
    isFetching,
    refreshing,
    handleEndReached,
    isError,
    error,
    isLoading: isInitializing,
  };
};
