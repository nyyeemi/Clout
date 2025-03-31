import React, {useCallback, useEffect} from 'react';
import globalStyle from '../../assets/styles/globalStyle';
import {ThemedSafeAreaView} from '../../components/ui/themed-view';
import {FlatList} from 'react-native';
import {FeedPost} from './FeedPost';
import {useDispatch, useSelector} from 'react-redux';
import {setFeedImages} from '../../redux/slices/feedImageSlice';
import {AppDispatch, RootState} from '../../redux/store/store';
import {fetchLikes} from '../../redux/slices/likeSlice';
import {fetchComments} from '../../redux/slices/commentSlice';
import {mockImageList} from '../../mock/mock';
import {CustomImage} from '../../types/types';

export const FeedScreen = (): JSX.Element => {
  //TODO: if feed downloads for example 20 images
  // -> when scrolled to 18th image then download more from backend

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    //TODO: Asyncthunk and service for feedImages.
    dispatch(setFeedImages(mockImageList));
    dispatch(fetchLikes());
    dispatch(fetchComments());
  }, [dispatch]);

  const data = useSelector((state: RootState) => state.feedImage.feedImages);

  const renderItem = useCallback(
    ({item}: {item: CustomImage}) => <FeedPost post={item} />,
    [],
  );

  return (
    <ThemedSafeAreaView style={[globalStyle.flex]}>
      <FlatList
        data={data}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </ThemedSafeAreaView>
  );
};
