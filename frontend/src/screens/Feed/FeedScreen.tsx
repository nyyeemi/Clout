import React from 'react';

import {FeedList} from '../../components/FeedList/FeedList';
import {useGetFeedPostsQuery} from '../../redux/api/endpoints/posts';

export const FeedScreen = (): JSX.Element => {
  const {data: posts = {data: [], count: 0}} = useGetFeedPostsQuery({});
  return <FeedList posts={posts} />;
};
