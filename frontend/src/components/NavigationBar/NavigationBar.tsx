import React, {useState} from 'react';
import {Style} from './style';
import {View} from 'react-native';
import {NavigationButton} from '../NavigationButton/NavigationButton';
import {
  faCamera,
  faAward,
  faImages,
  IconDefinition,
  faUser,
  faHouse,
} from '@fortawesome/free-solid-svg-icons';
import {useNavigation} from '@react-navigation/native';
//import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList, Routes} from '../../navigation/Routes';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {horizontalScale} from '../../assets/styles/scaling';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export const NavigationBar = (): JSX.Element => {
  const [activeButton, setActiveButton] = useState<keyof typeof Routes>('Vote');
  const insets = useSafeAreaInsets();

  const navigation =
    useNavigation<BottomTabNavigationProp<RootStackParamList>>();

  const buttons: {id: keyof RootStackParamList; icon: IconDefinition}[] = [
    {id: Routes.Vote, icon: faHouse},
    {id: Routes.Feed, icon: faImages},
    {id: Routes.Camera, icon: faCamera},
    {id: Routes.Leaderboard, icon: faAward},
    {id: Routes.ProfileStack, icon: faUser},
  ];

  const handlePress = (id: keyof RootStackParamList) => {
    setActiveButton(id);
    navigation.navigate(id);
  };

  return (
    <View style={[Style.container, {paddingBottom: insets.bottom}]}>
      {buttons.map(({id, icon}) => (
        <NavigationButton
          key={id}
          icon={icon}
          //isActive={activeButton === id}
          color={activeButton === id ? 'black' : '#757575'}
          size={horizontalScale(21)}
          onPress={() => handlePress(id)}
        />
      ))}
    </View>
  );
};
