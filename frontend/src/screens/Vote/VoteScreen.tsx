import React, {useEffect, useMemo, useRef, useState} from 'react';
import {View, Dimensions} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  SharedValue,
  Extrapolation,
  interpolate,
  withRepeat,
  Easing,
  withTiming,
} from 'react-native-reanimated';
import FastImage from 'react-native-fast-image';
import globalStyle from '../../assets/styles/globalStyle';
import {styles} from './style';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../redux/store/store';
import {
  setActiveVoteImages,
  setNextVoteImages,
  swapVoteImages,
} from '../../redux/slices/voteImageSlice';
import extendedMockImageList from './mock';
import {CustomImage} from '../../services/image/images';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ThemedIcon, ThemedText} from '../../components/ui/typography';
import {faArrowUp} from '@fortawesome/free-solid-svg-icons';
import {horizontalScale, verticalScale} from '../../assets/styles/scaling';

const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);

type ImageTuple = [CustomImage, CustomImage];

export const VoteScreen = (): JSX.Element => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [hasVoted, setHasVoted] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  const translateX = useSharedValue(0);
  const leftTranslateY = useSharedValue(0);
  const rightTranslateY = useSharedValue(0);
  const swipeStart = useSharedValue(0);
  const leftOpacity = useSharedValue(1);
  const rightOpacity = useSharedValue(1);

  const arrowTranslateY = useSharedValue(0);

  const {width, height} = Dimensions.get('window');
  const MAX_ROTATION = 60;
  const MAX_TRANSLATE_X = width * 0.6;
  const VOTE_THRESHOLD = -height * 0.2;
  const imagePairs: number = 10;

  const dispatch = useDispatch();

  useEffect(() => {
    //TODO: Replace mockDatas with the api response
    dispatch(setActiveVoteImages(extendedMockImageList));
    dispatch(setNextVoteImages(extendedMockImageList));
  }, [dispatch]);

  useEffect(() => {
    arrowTranslateY.value = withRepeat(
      withTiming(-10, {duration: 800, easing: Easing.inOut(Easing.ease)}),
      -1,
      true,
    );
  }, [arrowTranslateY]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isFirstVisit) {
      translateX.value = withTiming(-MAX_TRANSLATE_X, {duration: 1500}, () => {
        translateX.value = withTiming(MAX_TRANSLATE_X, {duration: 1500}, () => {
          translateX.value = withSpring(0);
          runOnJS(setIsFirstVisit)(false);
        });
      });
    }
  }, [MAX_TRANSLATE_X, isFirstVisit, translateX]);

  const activeVoteImages: ImageTuple[] = useSelector(
    (state: RootState) => state.voteImage.activeVoteImages,
    shallowEqual,
  );

  //TODO: switch if statement number (imagePairs) depending on how many image pairs coming from api response
  if (currentIndex === imagePairs) {
    dispatch(swapVoteImages());
    //TODO: Replace mockData with the api response
    dispatch(setNextVoteImages(extendedMockImageList));
    setCurrentIndex(0);
  }

  const currentImages: ImageTuple | null = useMemo(() => {
    if (activeVoteImages.length === 0) {
      return null;
    }

    const nextIndex = currentIndex + 1;
    const nextImages = activeVoteImages[nextIndex];

    if (nextImages) {
      FastImage.preload([
        {uri: nextImages[0].image_url},
        {uri: nextImages[1].image_url},
      ]);
    }

    return activeVoteImages[currentIndex] ?? null;
  }, [currentIndex, activeVoteImages]);

  const voteImage = (image: CustomImage) => {
    console.log(`Voted: ${image.id} image!`);
    setHasVoted(true);

    //TODO: API call for voting the image

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setHasVoted(false);
    }, 15000);

    setTimeout(() => {
      setCurrentIndex(prevIndex => prevIndex + 1);
      leftTranslateY.value = 0;
      rightTranslateY.value = 0;
      leftOpacity.value = 1;
      rightOpacity.value = 1;
    }, 300);
  };

  const createImageGesture = (
    translateY: SharedValue<number>,
    opacity: SharedValue<number>,
    image: CustomImage,
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
            stiffness: 100,
            damping: 100,
          });
        }

        if (translateY.value < VOTE_THRESHOLD) {
          runOnJS(voteImage)(image);
          translateY.value = withSpring(-height, {stiffness: 40, damping: 50});
          translateX.value = withSpring(0);
          opacity.value = withSpring(0);
        } else {
          translateY.value = withSpring(0);
        }
      });

  const leftImageGesture = currentImages
    ? createImageGesture(leftTranslateY, leftOpacity, currentImages[0])
    : undefined;

  const rightImageGesture = currentImages
    ? createImageGesture(rightTranslateY, rightOpacity, currentImages[1])
    : undefined;

  //Handles the horizontal swiping when finger swipes from background
  const backgroundGesture = Gesture.Pan()
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
          stiffness: 100,
          damping: 100,
        });
      }
    });

  //scaled values describing how much image can move horizontally
  const scaledTranslateX = horizontalScale(285);
  const scaledTranslateX2 = horizontalScale(10);

  const leftImageStyle = useAnimatedStyle(() => ({
    opacity: leftOpacity.value,
    transform: [
      {
        translateX: interpolate(
          translateX.value,
          [-MAX_TRANSLATE_X, MAX_TRANSLATE_X],
          [-scaledTranslateX2, scaledTranslateX],
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
          [-scaledTranslateX, scaledTranslateX2],
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

  //scaled values describing how much arrow can move horizontally
  const scaledArrowTranslateY = verticalScale(10);
  const scaledArrowTranslateY2 = verticalScale(0);

  const arrowStyle = useAnimatedStyle(() => ({
    transform: [{translateY: arrowTranslateY.value}],
    opacity: interpolate(
      arrowTranslateY.value,
      [-scaledArrowTranslateY, scaledArrowTranslateY2],
      [1, 0.5],
      Extrapolation.CLAMP,
    ),
  }));

  return (
    <SafeAreaView style={globalStyle.flex}>
      {currentImages ? (
        <GestureDetector gesture={backgroundGesture}>
          <View style={styles.container}>
            {leftImageGesture && (
              <GestureDetector gesture={leftImageGesture}>
                <AnimatedFastImage
                  source={{uri: currentImages[0].image_url}}
                  style={[styles.image, leftImageStyle]}
                  resizeMode={FastImage.resizeMode.cover}
                />
              </GestureDetector>
            )}
            {rightImageGesture && (
              <GestureDetector gesture={rightImageGesture}>
                <AnimatedFastImage
                  source={{uri: currentImages?.[1].image_url}}
                  style={[styles.image, rightImageStyle]}
                  resizeMode={FastImage.resizeMode.cover}
                />
              </GestureDetector>
            )}
            {!hasVoted && (
              <Animated.View style={[arrowStyle, styles.arrowContainer]}>
                <ThemedIcon icon={faArrowUp} size={30} />
                <ThemedText>Swipe up to vote!</ThemedText>
              </Animated.View>
            )}
          </View>
        </GestureDetector>
      ) : (
        <View style={styles.container}>
          <ThemedText>No more pictures</ThemedText>
        </View>
      )}
    </SafeAreaView>
  );
};
