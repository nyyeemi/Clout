import React, {useState} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {CustomImage} from '../../../services/image/images';
import {style, imageHeight} from '../style';
import {ProfileInfoCard} from './ProfileInfoCard';
import {mockUser} from '../mocks';
import {Text} from 'react-native-gesture-handler';
import {scaleFontSize, verticalScale} from '../../../assets/styles/scaling';
import {ImageListItem} from './ImageListItem';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {ProfileStackParamList, Routes} from '../../../navigation/Routes';

const ITEM_HEIGHT = imageHeight;

const ListFooter = ({numPosts}: {numPosts: number}): JSX.Element => (
  <View>
    <Text style={style.boxText}>{`${numPosts} images`}</Text>
  </View>
);

const placeholderStyle = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginVertical: verticalScale(100),
  },
  text: {
    fontSize: scaleFontSize(28),
    fontWeight: 'bold',
  },
  icon: {
    height: verticalScale(100),
    width: verticalScale(100),
    borderRadius: verticalScale(100),
    borderWidth: StyleSheet.hairlineWidth * 5,
    alignItems: 'center',
  },
});

const ListPlaceholder = () => (
  <View style={placeholderStyle.container}>
    <Text style={placeholderStyle.text}>No posts yet</Text>
  </View>
);

export const ImageList = ({data}: {data: CustomImage[]}): JSX.Element => {
  const [refreshing, setRefreshing] = useState(false);
  const navigation =
    useNavigation<StackNavigationProp<ProfileStackParamList>>();

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const renderItem = ({item}: {item: CustomImage}) => {
    return (
      <ImageListItem
        image={item}
        onPress={() =>
          navigation.navigate(Routes.ImageDetail, {imageId: item.id})
        }
      />
    );
  };

  return (
    <FlatList
      ListHeaderComponent={<ProfileInfoCard user={mockUser} />}
      ListFooterComponent={
        data ? <ListFooter numPosts={mockUser.num_posts} /> : null
      }
      ListEmptyComponent={<ListPlaceholder />}
      getItemLayout={(_data, index) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
      })}
      data={data}
      renderItem={renderItem}
      keyExtractor={item => String(item.id)}
      numColumns={3}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
};
