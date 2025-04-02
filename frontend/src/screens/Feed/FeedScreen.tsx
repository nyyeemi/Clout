import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import globalStyle from '../../assets/styles/globalStyle';
import {ThemedSafeAreaView} from '../../components/ui/themed-view';
import {FlatList, StyleSheet} from 'react-native';
import {FeedPost} from './FeedPost';
import {useDispatch, useSelector} from 'react-redux';
import {setFeedImages} from '../../redux/slices/feedImageSlice';
import {AppDispatch, RootState} from '../../redux/store/store';
import {fetchLikes} from '../../redux/slices/likeSlice';
import {fetchComments} from '../../redux/slices/commentSlice';
import {mockImageList} from '../../mock/mock';
import {CustomImage} from '../../types/types';
import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import {useTheme} from '@react-navigation/native';
import {
  useGetLikesByImageIdQuery,
  useGetUsersByIdsQuery,
} from '../../redux/slices/mockApiSlice';
import {UserList} from '../../components/UserList/UserList';

export const FeedScreen = (): JSX.Element => {
  const [selectedPost, setSelectedPost] = useState<CustomImage | null>(null);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['50%', '90%'], []);
  const {colors} = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  //TODO: if feed downloads for example 20 images
  // -> when scrolled to 18th image then download more from backend
  useEffect(() => {
    dispatch(setFeedImages(mockImageList));
    dispatch(fetchLikes());
    dispatch(fetchComments());
  }, [dispatch]);

  const data = useSelector((state: RootState) => state.feedImage.feedImages);
  const {data: likes = []} = useGetLikesByImageIdQuery(selectedPost?.id!, {
    skip: !selectedPost,
  });
  const userIds = likes.map(like => like.user_id);
  const {data: likedUsers = []} = useGetUsersByIdsQuery(userIds, {
    skip: userIds.length === 0,
  });

  console.log('Tykkääjät', likedUsers);

  const handleShowLikes = (post: CustomImage) => {
    setSelectedPost(post);
    bottomSheetRef.current?.present();
  };

  const renderItem = useCallback(
    ({item}: {item: CustomImage}) => (
      <FeedPost post={item} onShowLikes={handleShowLikes} />
    ),
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

      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose
        onDismiss={() => setSelectedPost(null)}
        index={0}
        backgroundStyle={{backgroundColor: colors.card}}
        handleIndicatorStyle={{backgroundColor: colors.border}}>
        <BottomSheetView style={style.container}>
          <UserList
            data={likedUsers}
            onItemPress={() => bottomSheetRef.current?.dismiss()}
          />
        </BottomSheetView>
      </BottomSheetModal>
    </ThemedSafeAreaView>
  );
};

const style = StyleSheet.create({
  container: {flex: 1},
});
