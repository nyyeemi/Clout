import React, {useState} from 'react';
import {Style} from './style';
import {View} from 'react-native';
import {NavigationButton} from '../NavigationButton/NavigationButton';
import {
  faCamera,
  faUser,
  faHandPointer,
  faAward,
  faImages,
} from '@fortawesome/free-solid-svg-icons';

export const NavigationBar = (): JSX.Element => {
  const [activeButton, setActiveButton] = useState<string>('awards');

  const buttons = [
    {id: 'awards', icon: faAward},
    {id: 'vote', icon: faHandPointer},
    {id: 'camera', icon: faCamera},
    {id: 'feed', icon: faImages},
    {id: 'profile', icon: faUser},
  ];

  const handlePress = (id: string) => {
    setActiveButton(id);
    //navigation.navigate(id)
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
