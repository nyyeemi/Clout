import React, {useEffect, useState} from 'react';

import {StackScreenProps} from '@react-navigation/stack';

import {FeedList} from '../../components/FeedList/FeedList';
import {ProfileStackParamList} from '../../navigation/Routes';
import {useGetProfilePostsInfiniteQuery} from '../../redux/api/endpoints/profiles';

type ImageDetailsProps = StackScreenProps<ProfileStackParamList, 'ProfileFeed'>;

export const ProfileFeedScreen = ({route}: ImageDetailsProps): JSX.Element => {
  const {imageId, username} = route.params || {};
  const [postIndex, setPostIndex] = useState<number | null>(null);

  const {
    data, // Contains { pages: PostTypeWithCount[], pageParams: ProfilePostsPageParam[] }
    //isFetching,
    isLoading,
    isError,
    //error,
    //hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useGetProfilePostsInfiniteQuery(username);

  // Flatten the data from all pages into a single array of posts
  const allPosts = React.useMemo(
    () => data?.pages?.flatMap(page => page.data) || [],
    [data],
  );

  useEffect(() => {
    if (imageId && allPosts.length > 0 && postIndex == null) {
      const index = allPosts.findIndex(post => post.id === imageId);
      if (index !== -1) {
        setPostIndex(index);
      }
    }
  }, [imageId, allPosts, postIndex]);

  console.log({isLoading, isError, postsLength: allPosts.length});

  const onRefreshPosts = () => {
    setPostIndex(0);
    refetch();
  };

  if (isLoading || (postIndex === null && imageId)) {
    return <></>;
  }

  return (
    <FeedList
      posts={allPosts}
      initalScrollIndex={postIndex}
      isFetchingPosts={isFetchingNextPage}
      refreshing={isLoading}
      onRefresh={onRefreshPosts}
      handleEndReached={fetchNextPage}
    />
  );
};
