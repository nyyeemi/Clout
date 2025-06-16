import React, {useCallback, useState} from 'react';
import {Keyboard, StyleSheet} from 'react-native';

import {
  BottomSheetFooterProps,
  BottomSheetModal,
  BottomSheetModalProps,
  TouchableWithoutFeedback,
} from '@gorhom/bottom-sheet';
import {useTheme} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {useSelectedFeedPost} from '../../hooks/useSelectedFeedPost';
import {useCreateCommentMutation} from '../../redux/api/endpoints/posts';
import {Backdrop} from '../Backdrop/Backdrop';
import {CommentList} from '../Comment/CommentList';
import {CommentInputFooter} from './CommentInputFooter';

import {CommentType, PostType} from '../../types/types';

export const CommentModal = ({
  commentSheetRef,
  ...props
}: {
  commentSheetRef: React.RefObject<BottomSheetModal | null>;
} & Omit<BottomSheetModalProps, 'children'>) => {
  const insets = useSafeAreaInsets();
  const {selectedPost} = useSelectedFeedPost();
  const {colors} = useTheme();
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [addComment] = useCreateCommentMutation();

  const handleAddComment = useCallback(
    (input: string) => {
      selectedPost && addComment({post_id: selectedPost.id, content: input});
    },
    [addComment, selectedPost?.id],
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
      backgroundStyle={{backgroundColor: colors.card}}
      handleIndicatorStyle={{backgroundColor: colors.border}}
      topInset={insets.top}
      backdropComponent={Backdrop}
      onDismiss={() => setEditingCommentId(null)}
      footerComponent={!editingCommentId ? renderFooter : undefined}>
      {editingCommentId ? (
        <TouchableWithoutFeedback
          onPress={() => {
            setEditingCommentId(null);
            Keyboard.dismiss();
          }}
          style={styles.touchableWithoutFeedback}
          accessible={false}>
          <CommentList
            onItemPress={() => {}}
            editingCommentId={editingCommentId}
            onStartEdit={id => setEditingCommentId(id)}
            onStopEdit={() => setEditingCommentId(null)}
            editingActive={!!editingCommentId}
          />
        </TouchableWithoutFeedback>
      ) : (
        <CommentList
          onItemPress={() => {}}
          editingCommentId={editingCommentId}
          onStartEdit={id => setEditingCommentId(id)}
          onStopEdit={() => setEditingCommentId(null)}
          editingActive={!!editingCommentId}
        />
      )}
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  touchableWithoutFeedback: {
    flex: 1,
    minHeight: '100%',
  },
});
