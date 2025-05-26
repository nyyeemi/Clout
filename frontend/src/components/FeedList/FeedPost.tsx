import React from 'react';
import {Dimensions, Image, StyleSheet} from 'react-native';

import globalStyle from '../../assets/styles/globalStyle';
import {ThemedView} from '../ui/themed-view';
import {BottomBar} from './BottomBar';
import {TopBar} from './TopBar';

import {PostType} from '../../types/types';

type Props = {
  post: PostType;
  onShowLikes: (post: PostType) => void;
  onShowComments: (post: PostType) => void;
};

export const FeedPost = ({post, onShowLikes, onShowComments}: Props) => {
  return (
    <ThemedView bottomBorder style={globalStyle.flex}>
      <TopBar post={post} />
      <Image
        source={{uri: post.image_url}}
        resizeMode="cover"
        style={[style.image]}
      />
      <BottomBar
        post={post}
        onShowLikes={onShowLikes}
        onShowComments={onShowComments}
      />
    </ThemedView>
  );
};

const {width} = Dimensions.get('window');
const IMAGE_WIDTH = Math.floor(width);
export const IMAGE_HEIGHT = Math.floor((IMAGE_WIDTH / 3) * 4);

const style = StyleSheet.create({
  image: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
  },
});
