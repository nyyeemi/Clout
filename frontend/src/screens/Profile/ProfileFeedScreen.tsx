import React, {useMemo} from 'react';

import {StackScreenProps} from '@react-navigation/stack';

import {FeedList} from '../../components/FeedList/FeedList';
import {Spinner} from '../../components/Spinner/Spinner';
import {ProfileStackParamList} from '../../navigation/Routes';
import {useGetProfilePostsByUserNameQuery} from '../../redux/api/endpoints/profiles';

type ImageDetailsProps = StackScreenProps<ProfileStackParamList, 'ProfileFeed'>;

export const ProfileFeedScreen = ({route}: ImageDetailsProps): JSX.Element => {
  const {imageId, username} = route.params || {};
  const {
    data: postData = {data: [], count: 0},
    isLoading: isPostsLoading,
    isError: isPostsError,
    error: postsError,
  } = useGetProfilePostsByUserNameQuery(username);

  const {data: posts} = postData;

  const postIndex = useMemo(() => {
    return imageId ? posts.findIndex(image => image.id === imageId) : 0;
  }, [imageId, posts]);

  if (isPostsLoading) {
    return <Spinner />;
  }

  if (isPostsError) {
    console.error('Error fetching data:', postsError);
  }

  return <FeedList posts={postData} initalScrollIndex={postIndex} />;
};
