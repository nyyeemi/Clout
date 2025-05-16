import React, {useCallback} from 'react';

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

type CommentModalProps = Omit<BottomSheetModalProps, 'children'> & {
  comments: CommentType[];
  commentSheetRef: React.RefObject<BottomSheetModal>;
  selectedPost: PostType;
};

export const CommentModal = ({
  comments,
  commentSheetRef,
  selectedPost,
  ...props
}: CommentModalProps): JSX.Element => {
  const insets = useSafeAreaInsets();
  const {colors} = useTheme();

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
      />
    ),
    [handleAddComment],
  );

  return (
    <BottomSheetModal
      {...props}
      ref={commentSheetRef}
      enablePanDownToClose
      index={0}
      backgroundStyle={{backgroundColor: colors.card}}
      handleIndicatorStyle={{backgroundColor: colors.border}}
      footerComponent={renderFooter}
      topInset={insets.top}
      backdropComponent={Backdrop}>
      <CommentList data={comments} />
    </BottomSheetModal>
  );
};

//REMOVED BOTTOMSHEETVIEW.
//BottomSheetFlatList HAS TO BE STRAIGHT AFTER THE MODAL COMPONENT.
