import React from 'react';
import globalStyle from '../../assets/styles/globalStyle';
import {ThemedSafeAreaView} from '../../components/ui/themed-view';
import {FlatList} from 'react-native';
import {FeedPost} from './FeedPost';
import {mockImageList} from './mock';

export const FeedScreen = (): JSX.Element => {
  //TODO: Replace mockImageList with api answer.
  return (
    <ThemedSafeAreaView style={[globalStyle.flex]}>
      <FlatList
        data={mockImageList}
        keyExtractor={item => String(item.id)}
        renderItem={({item}) => <FeedPost post={item} />}
        showsVerticalScrollIndicator={false}
      />
    </ThemedSafeAreaView>
  );
};
