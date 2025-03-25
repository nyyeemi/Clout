import React from 'react';
import globalStyle from '../../assets/styles/globalStyle';
import {ThemedView} from '../../components/ui/themed-view';
import {Dimensions, StyleSheet} from 'react-native';
import {TopBar} from './TopBar';
import {CustomImage} from './mock';
import {BottomBar} from './BottomBar';
import FastImage from 'react-native-fast-image';

type Props = {
  post: CustomImage;
};

export const FeedPost = ({post}: Props): JSX.Element => {
  //console.log(post);
  return (
    <ThemedView bottomBorder style={globalStyle.flex}>
      <TopBar url={post.user.profile_picture_url} user={post.user} />
      <FastImage
        source={{uri: post.image_url}}
        resizeMode="cover"
        style={[style.image]}
      />
      <BottomBar post={post} />
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
