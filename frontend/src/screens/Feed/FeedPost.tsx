import React from 'react';
import globalStyle from '../../assets/styles/globalStyle';
import {ThemedView} from '../../components/ui/themed-view';
import {StyleSheet} from 'react-native';
import {TopBar} from './TopBar';
import {CustomImage} from './mock';

type Props = {
  post: CustomImage;
};

export const FeedPost = ({post}: Props): JSX.Element => {
  console.log(post);
  return (
    <ThemedView style={[globalStyle.flex, style.container]}>
      <TopBar
        url={post.user.profile_picture_url}
        user={post.user}
        id={post.user.id}
      />
    </ThemedView>
  );
};

const style = StyleSheet.create({
  container: {},
});
