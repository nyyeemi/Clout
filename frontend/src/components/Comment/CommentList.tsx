import React, {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';

import {BottomSheetFlatList} from '@gorhom/bottom-sheet';

import {ThemedText} from '../ui/typography';
import {CommentListItem} from './CommentListItem';

import {CommentType} from '../../types/types';

type CommentListType = {
  data: CommentType[];
  onItemPress?: () => void;
  editingCommentId?: string | null;
  onStartEdit?: (id: string) => void;
  onStopEdit?: () => void;
  editingActive?: boolean;
};

export const CommentList = ({
  data,
  onItemPress,
  editingCommentId,
  onStartEdit,
  onStopEdit,
  editingActive,
}: CommentListType): JSX.Element => {
  const renderItem = useCallback(
    ({item}: {item: CommentType}) => (
      <CommentListItem
        comment={item}
        onItemPress={onItemPress}
        commentIsUnderEditing={editingCommentId === item.id}
        onStartEdit={() => onStartEdit?.(item.id)}
        onStopEdit={onStopEdit}
        blurred={!!editingCommentId && editingCommentId !== item.id}
        editingActive={editingActive}
      />
    ),
    [onItemPress, editingCommentId, onStartEdit, onStopEdit, editingActive],
  );

  return (
    <View style={styles.container}>
      <BottomSheetFlatList
        ListEmptyComponent={
          <View style={styles.noComments}>
            <ThemedText style={styles.listEmptyText}>
              No comments found
            </ThemedText>
          </View>
        }
        data={data}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingBottom: 80,
  },
  listEmptyText: {
    fontSize: 17,
    fontWeight: '900',
    color: 'gray',
    paddingHorizontal: 16,
  },
  noComments: {
    alignItems: 'center',
    paddingTop: 40,
  },
});
