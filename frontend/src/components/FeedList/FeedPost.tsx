import React from 'react';
import {Dimensions, StyleSheet} from 'react-native';

import FastImage from 'react-native-fast-image';

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

export const FeedPost = ({
  post,
  onShowLikes,
  onShowComments,
}: Props): JSX.Element => {
  return (
    <ThemedView bottomBorder style={globalStyle.flex}>
      <TopBar post={post} />
      <FastImage
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
const IMAGE_HEIGHT = Math.floor((IMAGE_WIDTH / 3) * 4);

const style = StyleSheet.create({
  image: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
  },
});
