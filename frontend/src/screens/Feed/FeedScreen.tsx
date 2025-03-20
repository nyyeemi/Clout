import React, {useEffect} from 'react';
import globalStyle from '../../assets/styles/globalStyle';
import {ThemedSafeAreaView} from '../../components/ui/themed-view';
import {FlatList} from 'react-native';
import {FeedPost} from './FeedPost';
import {mockComments, mockImageList, mockLikes} from './mock';
import {useDispatch, useSelector} from 'react-redux';
import {setFeedImages} from '../../redux/slices/feedImageSlice';
import {RootState} from '../../redux/store/store';
import {setLikes} from '../../redux/slices/likeSlice';
import {setComments} from '../../redux/slices/commentSlice';

export const FeedScreen = (): JSX.Element => {
  //TODO: Replace mockImageList with api answer.
  //TODO: if feed downloads for example 20 images
  // -> when scrolled to 18th image then download more from backend

  const dispatch = useDispatch();
  useEffect(() => {
    //TODO: apicall for feed images
    dispatch(setFeedImages(mockImageList));

    //TODO: apicall
    dispatch(setLikes(mockLikes));
    dispatch(setComments(mockComments));
  }, [dispatch]);

  const data = useSelector((state: RootState) => state.feedImage.feedImages);

  return (
    <ThemedSafeAreaView style={[globalStyle.flex]}>
      <FlatList
        data={data}
        keyExtractor={item => String(item.id)}
        renderItem={({item}) => <FeedPost post={item} />}
        showsVerticalScrollIndicator={false}
      />
    </ThemedSafeAreaView>
  );
};
