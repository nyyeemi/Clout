import React from 'react';
import globalStyle from '../../assets/styles/globalStyle';
import {ImageList} from './components/ImageList';
import extendedMockImageList, {mockUser} from './mocks';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ProfileHeader} from './components/ProfileHeader';
import {ThemedView} from '../../components/ui/themed-view';

export const ProfileScreen = (): JSX.Element => {
  //useEffect --> get image data, user,
  const insets = useSafeAreaInsets();
  return (
    <ThemedView style={[globalStyle.flex, {paddingTop: insets.top}]}>
      <ProfileHeader user={mockUser} />
      <ImageList data={extendedMockImageList} />
    </ThemedView>
  );
};
