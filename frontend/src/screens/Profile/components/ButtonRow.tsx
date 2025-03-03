import React from 'react';
import {StyleProp, ViewStyle, View} from 'react-native';
import {CustomPressable} from '../CustomPressable';

type ButtonProps = {
  component: JSX.Element;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

type ButtonRowProps = {
  buttons: ButtonProps[];
  containerStyle?: StyleProp<ViewStyle>;
};

export const ButtonRow = ({
  buttons,
  containerStyle,
}: ButtonRowProps): JSX.Element => {
  const pressedStyle = (pressed: boolean) => ({
    backgroundColor: pressed ? '#f0f0f0' : 'white', //'#f5f5f5' : '#f0f0f0'
  });

  return (
    <View style={containerStyle}>
      {buttons.map((button, index) => (
        <CustomPressable
          key={index}
          style={button.style}
          pressedStyle={pressedStyle}
          onPress={button.onPress}>
          {button.component}
        </CustomPressable>
      ))}
    </View>
  );
};
