import React, {useCallback, useMemo, useRef, useState} from 'react';
import {FlatList} from 'react-native';

import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {useTheme} from '@react-navigation/native';
import {skipToken} from '@reduxjs/toolkit/query';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import globalStyle from '../../assets/styles/globalStyle';
import {Backdrop} from '../../components/Backdrop/Backdrop';
import {UserList} from '../../components/UserList/UserList';
import {ThemedSafeAreaView} from '../../components/ui/themed-view';
import {
  useGetFeedPostsQuery,
  useGetLikesQuery,
  useGetPostCommentsQuery,
} from '../../redux/api/endpoints/posts';
import {CommentModal} from './CommentModal';
import {FeedPost} from './FeedPost';

import {PostType} from '../../types/types';

export const FeedScreen = (): JSX.Element => {
  const [selectedPost, setSelectedPost] = useState<PostType | null>(null);
  const likeSheetRef = useRef<BottomSheetModal>(null);
  const commentSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['50%', '90%'], []);
  const {colors} = useTheme();
  const insets = useSafeAreaInsets();

  //TODO: if feed downloads for example 20 images
  // -> when scrolled to 18th image then download more from backend

  const {data: posts = {data: [], count: 0}} = useGetFeedPostsQuery({});

  const {data: likes = {data: [], count: 0}} = useGetLikesQuery(
    selectedPost ? {post_id: selectedPost.id} : skipToken,
  );
  const likedUsers = likes.data.map(like => like.owner);

  const {data: comments = {data: [], count: 0}} = useGetPostCommentsQuery(
    selectedPost ? {post_id: selectedPost.id} : skipToken,
  );

  const handleShowLikes = (post: PostType) => {
    setSelectedPost(post);
    likeSheetRef.current?.present();
  };

  const handleShowComments = (post: PostType) => {
    setSelectedPost(post);
    commentSheetRef.current?.present();
  };

  const renderItem = useCallback(
    ({item}: {item: PostType}) => (
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
        data={posts.data}
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
        topInset={insets.top}
        backdropComponent={Backdrop}>
        <UserList
          data={likedUsers}
          onItemPress={() => likeSheetRef.current?.dismiss()}
          onModal
        />
      </BottomSheetModal>

      <CommentModal
        comments={comments.data}
        commentSheetRef={commentSheetRef}
        snapPoints={snapPoints}
        onDismiss={() => setSelectedPost(null)}
        selectedPost={selectedPost || ({} as PostType)}
      />
    </ThemedSafeAreaView>
  );
};
