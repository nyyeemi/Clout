import React, {useCallback, useMemo} from 'react';
import {Dimensions, FlatList} from 'react-native';

import {StackScreenProps} from '@react-navigation/stack';

import globalStyle from '../../assets/styles/globalStyle';
import {verticalScale} from '../../assets/styles/scaling';
import {Spinner} from '../../components/Spinner/Spinner';
import {ThemedView} from '../../components/ui/themed-view';
import {ProfileStackParamList} from '../../navigation/Routes';
import {useGetProfilePostsByUserNameQuery} from '../../redux/api/endpoints/profiles';
import {useGetPostsQuery} from '../../redux/slices/mockApiSlice';
import {FeedPost} from '../Feed/FeedPost';

import {PostType} from '../../types/types';

type ImageDetailsProps = StackScreenProps<ProfileStackParamList, 'ImageDetail'>;

export const ProfileFeedScreen = ({route}: ImageDetailsProps): JSX.Element => {
  const {imageId, username} = route.params || {};
  const {
    data: postData = {data: [], count: 0},
    isLoading: isPostsLoading,
    //isSuccess: isPostsSuccess,
    isError: isPostsError,
    error: postsError,
  } = useGetProfilePostsByUserNameQuery(username);

  const {data: posts} = postData;

  const postIndex = useMemo(() => {
    return imageId ? posts.findIndex(image => image.id === imageId) : 0;
  }, [imageId, posts]);

  console.log('render profilefeedscreen');

  //https://reactnative.dev/docs/optimizing-flatlist-configuration
  const renderItem = useCallback(
    ({item}: {item: PostType}) => <FeedPost post={item} />,
    [],
  );

  if (isPostsLoading) {
    return <Spinner />;
  }

  if (isPostsError) {
    console.error('Error fetching data:', postsError);
  }

  return (
    <ThemedView style={[globalStyle.flex]}>
      <FlatList
        data={posts}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        getItemLayout={(data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        showsVerticalScrollIndicator={false}
        initialScrollIndex={postIndex}
      />
    </ThemedView>
  );
};

const {width} = Dimensions.get('window');
const IMAGE_WIDTH = width;
const IMAGE_HEIGHT = (IMAGE_WIDTH / 3) * 4;

const TOP_BAR_HEIGHT = verticalScale(50);
const BOTTOM_BAR_HEIGHT = verticalScale(69);
// TODO: make sure the calculation is working on all devices
const ITEM_HEIGHT = IMAGE_HEIGHT + TOP_BAR_HEIGHT + BOTTOM_BAR_HEIGHT;
