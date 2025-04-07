import React, {useCallback} from 'react';
import {
  BottomSheetFooterProps,
  BottomSheetModal,
  BottomSheetModalProps,
} from '@gorhom/bottom-sheet';
import {CommentList} from '../../components/Comment/CommentList';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '@react-navigation/native';
import {CommentType, CustomImage} from '../../types/types';
import {CommentInputFooter} from './CommentInputFooter';
import {useAddCommentMutation} from '../../redux/slices/mockApiSlice';
import {Backdrop} from '../../components/Backdrop/Backdrop';

type CommentModalProps = Omit<BottomSheetModalProps, 'children'> & {
  comments: CommentType[];
  commentSheetRef: React.RefObject<BottomSheetModal>;
  selectedPost: CustomImage;
};

export const CommentModal = ({
  comments,
  commentSheetRef,
  selectedPost,
  ...props
}: CommentModalProps): JSX.Element => {
  const insets = useSafeAreaInsets();
  const {colors} = useTheme();

  const [addComment] = useAddCommentMutation();

  const handleAddComment = useCallback(
    (input: string) => {
      addComment({image_id: selectedPost.id, comment: input});
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
