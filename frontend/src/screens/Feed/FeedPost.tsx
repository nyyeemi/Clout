import React from 'react';
import {Dimensions, StyleSheet} from 'react-native';

import FastImage from 'react-native-fast-image';

import globalStyle from '../../assets/styles/globalStyle';
import {ThemedView} from '../../components/ui/themed-view';
import {BottomBar} from './BottomBar';
import {TopBar} from './TopBar';

import {CustomImage} from '../../types/types';

type Props = {
  post: CustomImage;
  onShowLikes: (post: CustomImage) => void;
};

export const FeedPost = ({post, onShowLikes}: Props): JSX.Element => {
  //console.log(post);
  return (
    <ThemedView bottomBorder style={globalStyle.flex}>
      <TopBar post={post} />
      <FastImage
        source={{uri: post.image_url}}
        resizeMode="cover"
        style={[style.image]}
      />
      <BottomBar post={post} onShowLikes={onShowLikes} />
    </ThemedView>
  );
};

const {width} = Dimensions.get('window');
const IMAGE_WIDTH = width;
const IMAGE_HEIGHT = (IMAGE_WIDTH / 3) * 4;

const style = StyleSheet.create({
  image: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
  },
});
