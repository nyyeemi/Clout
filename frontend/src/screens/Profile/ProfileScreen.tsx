import React from 'react';
import globalStyle from '../../assets/styles/globalStyle';
import {ImageList} from './components/ImageList';
import extendedMockImageList, {mockUser} from './mocks';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ProfileHeader} from './components/ProfileHeader';
import {View} from 'react-native';

export const ProfileScreen = (): JSX.Element => {
  //useEffect --> get image data, user,
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        globalStyle.backgroundWhite,
        globalStyle.flex,
        {paddingTop: insets.top},
      ]}>
      <ProfileHeader user={mockUser} />
      <ImageList data={extendedMockImageList} />
    </View>
  );
};
