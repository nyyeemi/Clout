import {Pressable, View} from 'react-native';
import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {IconDefinition} from '@fortawesome/fontawesome-svg-core';
import {scaleFontSize} from '../../assets/styles/scaling';
import {Style} from './style';

type NavigationButtonProps = {
  icon: IconDefinition;
  onPress?: () => void;
  size: number;
  color: string;
  isActive?: boolean;
};

export const NavigationButton = ({
  icon,
  onPress,
  size,
  color,
  isActive,
}: NavigationButtonProps): JSX.Element => (
  <View
    style={[
      Style.container,
      isActive ? Style.activeButton : Style.inactiveButton,
    ]}>
    <Pressable onPress={onPress}>
      <FontAwesomeIcon icon={icon} size={scaleFontSize(size)} color={color} />
    </Pressable>
  </View>
);
