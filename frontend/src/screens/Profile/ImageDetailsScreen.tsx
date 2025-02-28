import {Dimensions, StyleSheet, View} from 'react-native';
import React from 'react';
import {ProfileStackParamList} from '../../navigation/Routes';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {ImageListItem} from './components/ImageListItem';
import extendedMockImageList from './mocks';

const {width} = Dimensions.get('window');
//console.log(height);
const imageHeight = (width * 4) / 3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  imageStyle: {
    width: width,
    height: imageHeight,
  },
});

type ImageDetailsProps = NativeStackScreenProps<
  ProfileStackParamList,
  'ImageDetail',
  'MyStack'
>;

// mock. this function should be in redux state
const getImageById = (id: number) =>
  extendedMockImageList.find(item => item.id === id);

export const ImageDetailsScreen = ({route}: ImageDetailsProps): JSX.Element => {
  const {imageId} = route.params;
  const currentImage = getImageById(imageId);
  console.log(currentImage, imageId);
  return (
    <View style={styles.container}>
      {currentImage && (
        <ImageListItem
          image={currentImage}
          onPress={() => console.log(currentImage.id)}
          imageStyle={styles.imageStyle}
        />
      )}
    </View>
  );
};
