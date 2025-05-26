import React, {useCallback, useMemo, useRef, useState} from 'react';

import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {useRoute, useTheme} from '@react-navigation/native';
import {skipToken} from '@reduxjs/toolkit/query';
import {FlashList} from '@shopify/flash-list';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import globalStyle from '../../assets/styles/globalStyle';
import {Backdrop} from '../../components/Backdrop/Backdrop';
import {UserList} from '../../components/UserList/UserList';
import {ThemedSafeAreaView, ThemedView} from '../../components/ui/themed-view';
import {Routes} from '../../navigation/Routes';
import {
  useGetLikesQuery,
  useGetPostCommentsQuery,
} from '../../redux/api/endpoints/posts';
import {Spinner} from '../Spinner/Spinner';
import {CommentModal} from './CommentModal';
import {FeedPost} from './FeedPost';

import {PostType} from '../../types/types';

type FeedListProps = {
  posts: PostType[];
  initalScrollIndex?: number | null;
  handleEndReached: () => void;
  isFetchingPosts: boolean;
  refreshing: boolean;
  hasNextPage: boolean;
  onRefresh: () => void;
};

export const FeedList = ({
  posts,
  initalScrollIndex,
  handleEndReached,
  isFetchingPosts,
  refreshing,
  hasNextPage,
  onRefresh,
}: FeedListProps): JSX.Element => {
  const [selectedPost, setSelectedPost] = useState<PostType | null>(null);
  const [modalToRender, setModalToRender] = useState<
    'likes' | 'comments' | null
  >(null);
  const likeSheetRef = useRef<BottomSheetModal>(null);
  const commentSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['50%', '90%'], []);
  const {colors} = useTheme();
  const insets = useSafeAreaInsets();
  const route = useRoute();

  //TODO: if feed downloads for example 20 images
  // -> when scrolled to 18th image then download more from backend

  const shouldRenderLikesModal = modalToRender === 'likes';
  const shouldRenderCommentsModal = modalToRender === 'comments';

  const {data: likes = {data: [], count: 0}, isFetching} = useGetLikesQuery(
    selectedPost && shouldRenderLikesModal
      ? {post_id: selectedPost.id}
      : skipToken,
  );

  const likedUsers =
    selectedPost && likes.data && !isFetching
      ? likes.data.map(like => like.owner)
      : [];

  const {
    data: comments = {data: [], count: 0},
    isFetching: isFetchingComments,
  } = useGetPostCommentsQuery(
    selectedPost && shouldRenderCommentsModal
      ? {post_id: selectedPost.id}
      : skipToken,
  );
  const commentList = !isFetchingComments ? comments.data : [];

  const handleShowLikes = (post: PostType) => {
    setSelectedPost(post);
    setModalToRender('likes');
    likeSheetRef.current?.present();
  };

  const handleShowComments = (post: PostType) => {
    setSelectedPost(post);
    setModalToRender('comments');
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

  const ThemeViewComponent =
    route.name === Routes.ProfileFeed ? ThemedView : ThemedSafeAreaView;

  return (
    <ThemeViewComponent style={[globalStyle.flex]}>
      <FlashList
        data={posts}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        initialScrollIndex={initalScrollIndex || null}
        onEndReachedThreshold={0}
        onEndReached={hasNextPage ? () => handleEndReached() : null}
        ListFooterComponent={
          isFetchingPosts ? <Spinner size={'small'} /> : null
        }
        refreshing={refreshing}
        estimatedItemSize={726}
        onRefresh={() => onRefresh()}
        estimatedFirstItemOffset={0}
      />

      <BottomSheetModal
        ref={likeSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose
        onDismiss={() => setSelectedPost(null)}
        index={1}
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
        comments={commentList}
        commentSheetRef={commentSheetRef}
        snapPoints={snapPoints}
        onDismiss={() => setSelectedPost(null)}
        selectedPost={selectedPost || ({} as PostType)}
        index={1}
      />
    </ThemeViewComponent>
  );
};
