import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {FlatList, StyleSheet} from 'react-native';

import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import {useTheme} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';

import globalStyle from '../../assets/styles/globalStyle';
import {UserList} from '../../components/UserList/UserList';
import {ThemedSafeAreaView} from '../../components/ui/themed-view';
import {mockImageList} from '../../mock/mock';
import {setFeedImages} from '../../redux/slices/feedImageSlice';
import {
  useGetCommentsByImageIdQuery,
  useGetLikesByImageIdQuery,
  useGetUsersByIdsQuery,
} from '../../redux/slices/mockApiSlice';
import {AppDispatch, RootState} from '../../redux/store/store';
import {FeedPost} from './FeedPost';

import {CustomImage} from '../../types/types';
import {CommentModal} from './CommentModal';
import {Backdrop} from '../../components/Backdrop/Backdrop';

export const FeedScreen = (): JSX.Element => {
  const [selectedPost, setSelectedPost] = useState<CustomImage | null>(null);
  const likeSheetRef = useRef<BottomSheetModal>(null);
  const commentSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['50%', '90%'], []);
  const {colors} = useTheme();

  const dispatch = useDispatch<AppDispatch>();
  //TODO: if feed downloads for example 20 images
  // -> when scrolled to 18th image then download more from backend
  useEffect(() => {
    dispatch(setFeedImages(mockImageList));
  }, [dispatch]);

  const data = useSelector((state: RootState) => state.feedImage.feedImages);
  const {data: likes = []} = useGetLikesByImageIdQuery(selectedPost?.id ?? -1, {
    skip: !selectedPost,
  });
  const userIds = likes.map(like => like.user_id);
  const {data: likedUsers = []} = useGetUsersByIdsQuery(userIds, {
    skip: userIds.length === 0,
  });
  const {data: comments = []} = useGetCommentsByImageIdQuery(
    selectedPost?.id ?? -1,
    {
      skip: !selectedPost,
    },
  );

  const handleShowLikes = (post: CustomImage) => {
    setSelectedPost(post);
    likeSheetRef.current?.present();
  };

  const handleShowComments = (post: CustomImage) => {
    setSelectedPost(post);
    commentSheetRef.current?.present();
  };

  const renderItem = useCallback(
    ({item}: {item: CustomImage}) => (
      <FeedPost
        post={item}
        onShowLikes={handleShowLikes}
        onShowComments={handleShowComments}
      />
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
        ref={likeSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose
        onDismiss={() => setSelectedPost(null)}
        index={0}
        backgroundStyle={{backgroundColor: colors.card}}
        handleIndicatorStyle={{backgroundColor: colors.border}}
        backdropComponent={Backdrop}>
        <BottomSheetView style={styles.container}>
          <UserList
            data={likedUsers}
            onItemPress={() => likeSheetRef.current?.dismiss()}
          />
        </BottomSheetView>
      </BottomSheetModal>

      <CommentModal
        comments={comments}
        commentSheetRef={commentSheetRef}
        snapPoints={snapPoints}
        onDismiss={() => setSelectedPost(null)}
        selectedPost={selectedPost || ({} as CustomImage)}
      />
    </ThemedSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
    flex: 1, //REMEMBER FLEX 1, OTHERWISE LIST WONT RENDER CORRECTLY
  },
});
