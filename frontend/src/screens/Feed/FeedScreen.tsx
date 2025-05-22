import React, {useEffect, useState} from 'react';

import {FeedList} from '../../components/FeedList/FeedList';
import {useGetFeedPostsQuery} from '../../redux/api/endpoints/posts';

import {PostType} from '../../types/types';

export const FeedScreen = (): JSX.Element => {
  const [feedPosts, setFeedPosts] = useState<PostType[]>([]);
  const [lastPostDate, setLastPostDate] = useState<string>('');
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const {data: posts = {data: [], count: 0}, isFetching} = useGetFeedPostsQuery(
    {last_post_created_at: lastPostDate, limit: 5},
  );

  useEffect(() => {
    if (!refreshing) {
      if (posts.count) {
        setFeedPosts(prev => [...prev, ...posts.data]);
        setHasMore(posts.count === 5);
      } else {
        setHasMore(false);
      }
    } else {
      setRefreshing(false);
    }
  }, [posts.count, posts.data, refreshing]);

  const handleEndReached = () => {
    if (!isFetching && hasMore) {
      setLastPostDate(feedPosts.at(-1)?.created_at ?? '');
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setHasMore(true);
    setFeedPosts([]);
    setLastPostDate('');
  };

  return (
    <FeedList
      posts={feedPosts}
      handleEndReached={handleEndReached}
      isFetchingPosts={isFetching}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
};
