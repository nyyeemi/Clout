import React, {useMemo, useState} from 'react';
import {View, Dimensions} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
  runOnJS,
} from 'react-native-reanimated';
import {SafeAreaView} from 'react-native-safe-area-context';
import globalStyle from '../../assets/styles/globalStyle';
import {styles} from './style';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from '../../redux/store/store';

export const VoteScreen = (): JSX.Element => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const translateX = useSharedValue(0);
  const leftTranslateY = useSharedValue(0);
  const rightTranslateY = useSharedValue(0);
  const swipeStart = useSharedValue(0);

  const leftOpacity = useSharedValue(1);
  const rightOpacity = useSharedValue(1);

  const {width, height} = Dimensions.get('window');
  const MAX_ROTATION = 60;
  const MAX_TRANSLATE_X = width * 0.6;
  const VOTE_THRESHOLD = -height * 0.2;

  const voteImage = (side: 'left' | 'right') => {
    console.log(`Voted: ${side} image!`);
    setCurrentIndex(prevIndex => (prevIndex + 1) % voteImages.length);
    setTimeout(() => {
      leftTranslateY.value = 0;
      rightTranslateY.value = 0;
      leftOpacity.value = 1;
      rightOpacity.value = 1;
    }, 300);
  };

  const createImageGesture = (
    translateY: any,
    opacity: any,
    side: 'left' | 'right',
  ) =>
    Gesture.Pan()
      .onBegin(() => {
        swipeStart.value = translateX.value;
      })
      .onUpdate(e => {
        translateX.value = swipeStart.value + e.translationX;
        if (e.translationY < 0) {
          translateY.value = e.translationY;
        }
      })
      .onEnd(() => {
        if (translateX.value > width * 0.1) {
          translateX.value = withSpring(MAX_TRANSLATE_X);
        } else if (translateX.value < -width * 0.1) {
          translateX.value = withSpring(-MAX_TRANSLATE_X);
        } else {
          translateX.value = withSpring(0);
        }

        if (translateY.value < VOTE_THRESHOLD) {
          runOnJS(voteImage)(side);
          translateY.value = withSpring(-height, {stiffness: 40, damping: 500});
          translateX.value = withSpring(0);
          opacity.value = withSpring(0);
        } else {
          translateY.value = withSpring(0);
        }
      });

  const leftImageGesture = createImageGesture(
    leftTranslateY,
    leftOpacity,
    'left',
  );
  const rightImageGesture = createImageGesture(
    rightTranslateY,
    rightOpacity,
    'right',
  );

  const leftImageStyle = useAnimatedStyle(() => ({
    opacity: leftOpacity.value,
    transform: [
      {
        translateX: interpolate(
          translateX.value,
          [-MAX_TRANSLATE_X, MAX_TRANSLATE_X],
          [-10, 320],
          Extrapolation.CLAMP,
        ),
      },
      {translateY: leftTranslateY.value},
      {
        rotateY: `${interpolate(
          translateX.value,
          [-MAX_TRANSLATE_X, MAX_TRANSLATE_X],
          [MAX_ROTATION, 0],
          Extrapolation.CLAMP,
        )}deg`,
      },
    ],
  }));

  const rightImageStyle = useAnimatedStyle(() => ({
    opacity: rightOpacity.value,
    transform: [
      {
        translateX: interpolate(
          translateX.value,
          [-MAX_TRANSLATE_X, MAX_TRANSLATE_X],
          [-320, 10],
          Extrapolation.CLAMP,
        ),
      },
      {translateY: rightTranslateY.value},
      {
        rotateY: `${interpolate(
          translateX.value,
          [-MAX_TRANSLATE_X, MAX_TRANSLATE_X],
          [0, -MAX_ROTATION],
          Extrapolation.CLAMP,
        )}deg`,
      },
    ],
  }));

  const voteImages = useSelector(
    (state: RootState) => state.voteImage.imageTupleList,
    shallowEqual,
  );

  const currentImages = useMemo(() => {
    return voteImages.length > 0
      ? voteImages[currentIndex % voteImages.length]
      : null;
  }, [currentIndex, voteImages]);

  //console.log('current images', currentImages[0]);

  return (
    <SafeAreaView style={[globalStyle.flex, globalStyle.backgroundWhite]}>
      {currentImages && (
        <View style={styles.container}>
          <GestureDetector gesture={leftImageGesture}>
            <Animated.Image
              source={{uri: currentImages[0].image_url}}
              style={[styles.image, leftImageStyle]}
              resizeMode={'cover'}
            />
          </GestureDetector>

          <GestureDetector gesture={rightImageGesture}>
            <Animated.Image
              source={{uri: currentImages[1].image_url}}
              style={[styles.image, rightImageStyle]}
              resizeMode={'cover'}
            />
          </GestureDetector>
        </View>
      )}
    </SafeAreaView>
  );
};
