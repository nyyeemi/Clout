import React, {useState} from 'react';
import {Style} from './style';
import {View} from 'react-native';
import {NavigationButton} from '../NavigationButton/NavigationButton';
import {
  faCamera,
  faHandPointer,
  faAward,
  faImages,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList, Routes} from '../../navigation/Routes';

export const NavigationBar = (): JSX.Element => {
  const [activeButton, setActiveButton] =
    useState<keyof typeof Routes>('Leaderboard');

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const buttons: {id: keyof RootStackParamList; icon: IconDefinition}[] = [
    {id: 'Leaderboard', icon: faAward},
    {id: 'Vote', icon: faHandPointer},
    {id: 'Camera', icon: faCamera},
    {id: 'Feed', icon: faImages},
    //{id: 'Profile', icon: faUser},
  ];

  const handlePress = (id: keyof RootStackParamList) => {
    setActiveButton(id);
    navigation.navigate(id);
  };

  return (
    <View style={Style.container}>
      {buttons.map(({id, icon}) => (
        <NavigationButton
          key={id}
          icon={icon}
          isActive={activeButton === id}
          color={activeButton === id ? 'white' : 'black'}
          size={30}
          onPress={() => handlePress(id)}
        />
      ))}
    </View>
  );
};
