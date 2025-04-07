import React, {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {ThemedText} from '../ui/typography';
import {CommentType} from '../../types/types';
import {CommentListItem} from './CommentListItem';
import {BottomSheetFlatList} from '@gorhom/bottom-sheet';

type CommentListType = {
  data: CommentType[];
  onItemPress?: () => void;
};

export const CommentList = ({
  data,
  onItemPress,
}: CommentListType): JSX.Element => {
  const renderItem = useCallback(
    ({item}: {item: CommentType}) => (
      <CommentListItem comment={item} onItemPress={onItemPress} />
    ),
    [onItemPress],
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
    paddingBottom: 80, //TODO IS THIS GOOD IN HERE
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
