import React from 'react';
import {Pressable, StyleSheet} from 'react-native';

import {useNavigation, useTheme} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {FlashList} from '@shopify/flash-list';
import FastImage, {FastImageProps} from 'react-native-fast-image';

import {Spinner} from '../../../components/Spinner/Spinner';
import {ThemedView} from '../../../components/ui/themed-view';
import {ThemedText} from '../../../components/ui/typography';
import {ProfileStackParamList, Routes} from '../../../navigation/Routes';
import {style} from '../style';
import {ProfileInfoCard} from './ProfileInfoCard';

import {PostType, ProfileType} from '../../../types/types';

type ImageListProps = {
  posts: PostType[];
  profileUser: ProfileType;
  isFetchingPosts: boolean;
  isLoadingPosts: boolean;
  isErrorPosts: boolean;
  refreshing: boolean;
  hasNextPage: boolean;
  onRefresh: () => void;
  handleEndReached: () => void;
};

export const ImageList = ({
  posts,
  profileUser,
  isFetchingPosts,
  isLoadingPosts,
  isErrorPosts,
  refreshing,
  hasNextPage,
  onRefresh,
  handleEndReached,
}: ImageListProps): JSX.Element => {
  const navigation =
    useNavigation<StackNavigationProp<ProfileStackParamList>>();

  const handlePress = (item: PostType) => {
    navigation.navigate(Routes.ProfileFeed, {
      imageId: item.id,
      username: profileUser.username,
    });
  };

  const renderItem = ({item}: {item: PostType}) => {
    return <ImageListItem image={item} onPress={() => handlePress(item)} />;
  };

  const renderListEmptyComponent = () => {
    if (isLoadingPosts) {
      return <Spinner size={'small'} />;
    }
    if (isErrorPosts) {
      return (
        <ThemedText style={placeholderStyle.container}>
          Error loading posts.
        </ThemedText>
      );
    }
    return <ListPlaceholder />;
  };

  return (
    <FlashList
      ListHeaderComponent={
        profileUser && <ProfileInfoCard profileUser={profileUser} />
      }
      ListEmptyComponent={renderListEmptyComponent()}
      data={posts}
      renderItem={renderItem}
      keyExtractor={item => String(item.id)}
      numColumns={3}
      onEndReachedThreshold={0.3}
      onEndReached={hasNextPage ? () => handleEndReached() : null}
      ListFooterComponent={isFetchingPosts ? <Spinner size={'small'} /> : null}
      refreshing={refreshing}
      onRefresh={() => onRefresh()}
      estimatedItemSize={194}
    />
  );
};

type ImageBoxProps = {
  image: PostType;
  onPress: () => void;
  imageStyle?: FastImageProps['style'];
};

const ImageListItem = ({
  image,
  onPress,
  imageStyle,
}: ImageBoxProps): JSX.Element => {
  const {colors} = useTheme();
  return (
    <>
      <Pressable
        style={({pressed}) => [{opacity: pressed ? 0.5 : 1}]}
        onPress={onPress}>
        <FastImage
          source={{uri: image.image_url}}
          resizeMode="cover"
          style={[
            imageStyle ? imageStyle : style.imageBox,
            {borderColor: colors.border},
          ]}
        />
      </Pressable>
    </>
  );
};

export const ListPlaceholder = () => (
  <ThemedView style={placeholderStyle.container}>
    <ThemedText style={placeholderStyle.text}>No posts yet</ThemedText>
  </ThemedView>
);

const placeholderStyle = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginVertical: 100,
  },
  text: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  icon: {
    height: 100,
    width: 100,
    borderRadius: 100,
    borderWidth: StyleSheet.hairlineWidth * 5,
    alignItems: 'center',
  },
});
