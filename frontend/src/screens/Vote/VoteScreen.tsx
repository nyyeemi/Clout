import React from 'react';
import {View, Dimensions} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import {SafeAreaView} from 'react-native-safe-area-context';
import globalStyle from '../../assets/styles/globalStyle';
import {styles} from './style';

const {width} = Dimensions.get('window');
const MAX_ROTATION = 60;
const MAX_TRANSLATE_X = width * 0.7;

export const VoteScreen = (): JSX.Element => {
  const translateX = useSharedValue(0);

  const swipeGesture = Gesture.Pan()
    .onUpdate(e => {
      translateX.value = e.translationX;
    })
    .onEnd(() => {
      translateX.value = withSpring(0);
    });

  const leftImageStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            translateX.value,
            [-MAX_TRANSLATE_X, MAX_TRANSLATE_X],
            [-10, 320],
            Extrapolation.CLAMP,
          ),
        },
        {
          rotateY: `${interpolate(
            translateX.value,
            [-MAX_TRANSLATE_X, MAX_TRANSLATE_X],
            [MAX_ROTATION, 0],
            Extrapolation.CLAMP,
          )}deg`,
        },
      ],
    };
  });

  const rightImageStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            translateX.value,
            [-MAX_TRANSLATE_X, MAX_TRANSLATE_X],
            [-320, 10],
            Extrapolation.CLAMP,
          ),
        },
        {
          rotateY: `${interpolate(
            translateX.value,
            [-MAX_TRANSLATE_X, MAX_TRANSLATE_X],
            [0, -MAX_ROTATION],
            Extrapolation.CLAMP,
          )}deg`,
        },
      ],
    };
  });

  return (
    <SafeAreaView style={[globalStyle.flex, globalStyle.backgroundWhite]}>
      <GestureDetector gesture={swipeGesture}>
        <View style={styles.container}>
          <Animated.Image
            source={{
              uri: 'https://www.spongebobshop.com/cdn/shop/products/SB-Standees-Spong-3_800x.jpg?v=1603744568',
            }}
            style={[styles.image, leftImageStyle]}
            resizeMode={'cover'}
          />
          <Animated.Image
            source={{
              uri: 'https://www.spongebobshop.com/cdn/shop/products/SB-Standees-Spong-3_800x.jpg?v=1603744568',
            }}
            style={[styles.image, rightImageStyle]}
            resizeMode={'cover'}
          />
        </View>
      </GestureDetector>
    </SafeAreaView>
  );
};
