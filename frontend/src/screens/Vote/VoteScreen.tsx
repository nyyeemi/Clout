import React, {useEffect, useMemo, useState} from 'react';
import {View, Dimensions, Text} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
  runOnJS,
} from 'react-native-reanimated';
import FastImage from 'react-native-fast-image';
import {SafeAreaView} from 'react-native-safe-area-context';
import globalStyle from '../../assets/styles/globalStyle';
import {styles} from './style';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../redux/store/store';
import {updateNewVoteImages} from '../../redux/slices/voteImageSlice';
import extendedMockImageList from './mock';

const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);

export const VoteScreen = (): JSX.Element => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const translateX = useSharedValue(0);
  const leftTranslateY = useSharedValue(0);
  const rightTranslateY = useSharedValue(0);
  const swipeStart = useSharedValue(0);
  const leftOpacity = useSharedValue(1);
  const rightOpacity = useSharedValue(1);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(updateNewVoteImages({imageTupleList: extendedMockImageList}));
  }, [dispatch]);

  const {width, height} = Dimensions.get('window');
  const MAX_ROTATION = 60;
  const MAX_TRANSLATE_X = width * 0.6;
  const VOTE_THRESHOLD = -height * 0.2;

  const voteImages = useSelector(
    (state: RootState) => state.voteImage.imageTupleList,
    shallowEqual,
  );

  const currentImages = useMemo(() => {
    if (voteImages.length === 0) {
      return null;
    }

    const nextIndex = currentIndex + 1;
    const nextImages = voteImages[nextIndex];

    if (nextImages) {
      FastImage.preload([
        {uri: nextImages[0].image_url},
        {uri: nextImages[1].image_url},
      ]);
    }

    return voteImages[currentIndex];
  }, [currentIndex, voteImages]);

  const voteImage = (side: 'left' | 'right') => {
    console.log(`Voted: ${side} image!`);

    setTimeout(() => {
      setCurrentIndex(prevIndex => prevIndex + 1);
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

  return (
    <SafeAreaView style={[globalStyle.flex, globalStyle.backgroundWhite]}>
      {currentImages ? (
        <View style={styles.container}>
          <GestureDetector gesture={leftImageGesture}>
            <AnimatedFastImage
              source={{uri: currentImages[0].image_url}}
              style={[styles.image, leftImageStyle]}
              resizeMode={FastImage.resizeMode.cover}
            />
          </GestureDetector>

          <GestureDetector gesture={rightImageGesture}>
            <AnimatedFastImage
              source={{uri: currentImages[1].image_url}}
              style={[styles.image, rightImageStyle]}
              resizeMode={FastImage.resizeMode.cover}
            />
          </GestureDetector>
        </View>
      ) : (
        <View style={styles.container}>
          <Text>No more pictures</Text>
        </View>
      )}
    </SafeAreaView>
  );
};
