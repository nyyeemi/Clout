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

export const VoteScreen = (): JSX.Element => {
  const translateX = useSharedValue(0);

  const swipeStart = useSharedValue(0);

  const {width} = Dimensions.get('window');
  const MAX_ROTATION = 60;
  const MAX_TRANSLATE_X = width * 0.6;

  const swipeGesture = Gesture.Pan()
    .onBegin(() => {
      swipeStart.value = translateX.value;
    })
    .onUpdate(e => {
      translateX.value = swipeStart.value + e.translationX;
    })
    .onEnd(() => {
      if (translateX.value > width * 0.1) {
        translateX.value = withSpring(MAX_TRANSLATE_X, {
          stiffness: 100,
          damping: 100,
        });
      } else if (translateX.value < -width * 0.1) {
        translateX.value = withSpring(-MAX_TRANSLATE_X, {
          stiffness: 100,
          damping: 100,
        });
      } else {
        translateX.value = withSpring(0, {
          stiffness: 100, // Stiffness (higher value = faster)
          damping: 100, // Damping (higher value = less oscillation)
        });
      }
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
