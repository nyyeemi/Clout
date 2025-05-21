import React, {useCallback, useState} from 'react';
import {StyleSheet, View} from 'react-native';

import {
  BottomSheetFooterProps,
  BottomSheetModal,
  BottomSheetModalProps,
} from '@gorhom/bottom-sheet';
import {useTheme} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {Backdrop} from '../../components/Backdrop/Backdrop';
import {CommentList} from '../../components/Comment/CommentList';
import {useCreateCommentMutation} from '../../redux/api/endpoints/posts';
import {CommentInputFooter} from './CommentInputFooter';

import {CommentType, PostType} from '../../types/types';

export const CommentModal = ({
  comments,
  commentSheetRef,
  selectedPost,
  ...props
}: {
  comments: CommentType[];
  commentSheetRef: React.RefObject<BottomSheetModal>;
  selectedPost: PostType;
} & Omit<BottomSheetModalProps, 'children'>): JSX.Element => {
  const insets = useSafeAreaInsets();
  const {colors} = useTheme();
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [addComment] = useCreateCommentMutation();

  const handleAddComment = useCallback(
    (input: string) => {
      addComment({post_id: selectedPost.id, content: input});
    },
    [addComment, selectedPost.id],
  );

  const renderFooter = useCallback(
    (footerProps: BottomSheetFooterProps) => (
      <CommentInputFooter
        {...footerProps}
        handleAddComment={handleAddComment}
        blurred={!!editingCommentId}
      />
    ),
    [editingCommentId, handleAddComment],
  );

  return (
    <BottomSheetModal
      {...props}
      ref={commentSheetRef}
      enablePanDownToClose
      index={0}
      backgroundStyle={{backgroundColor: colors.card}}
      handleIndicatorStyle={{backgroundColor: colors.border}}
      topInset={insets.top}
      backdropComponent={Backdrop}
      onDismiss={() => setEditingCommentId(null)}
      footerComponent={!editingCommentId ? renderFooter : undefined}>
      <View style={styles.container}>
        <CommentList
          data={comments}
          onItemPress={() => {}}
          editingCommentId={editingCommentId}
          onStartEdit={id => setEditingCommentId(id)}
          onStopEdit={() => setEditingCommentId(null)}
          editingActive={!!editingCommentId}
        />
      </View>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
