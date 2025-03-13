import React from 'react';
import globalStyle from '../../assets/styles/globalStyle';
import {ThemedView} from '../../components/ui/themed-view';
import {Dimensions, Image, StyleSheet} from 'react-native';
import {TopBar} from './TopBar';
import {CustomImage} from './mock';
import {BottomBar} from './BottomBar';

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
        user_id={post.user.id}
      />
      <Image
        source={{uri: post.image_url}}
        resizeMode="cover"
        style={[style.image]}
      />
      <BottomBar
        user={post.user}
        user_id={post.user.id}
        caption={post.caption}
      />
    </ThemedView>
  );
};

const {width} = Dimensions.get('window');
const IMAGE_WIDTH = width;
const IMAGE_HEIGHT = (IMAGE_WIDTH / 3) * 4;

const style = StyleSheet.create({
  container: {borderBottomWidth: StyleSheet.hairlineWidth},
  image: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
  },
});
