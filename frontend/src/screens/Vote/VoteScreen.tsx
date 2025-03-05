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
import {updateNewVoteImages} from '../../redux/slices/voteImageSlice';
import extendedMockImageList from './mock';
import {CustomImage} from '../../services/image/images';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ThemedIcon, ThemedText} from '../../components/ui/typography';
import {faArrowUp} from '@fortawesome/free-solid-svg-icons';

const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);

type ImageTuple = [CustomImage, CustomImage];

type VoteSide = 'left' | 'right';

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

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(updateNewVoteImages({imageTupleList: extendedMockImageList}));
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

  const voteImages: ImageTuple[] = useSelector(
    (state: RootState) => state.voteImage.imageTupleList,
    shallowEqual,
  );

  const currentImages: ImageTuple | null = useMemo(() => {
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

    return voteImages[currentIndex] ?? null;
  }, [currentIndex, voteImages]);

  const voteImage = (side: VoteSide) => {
    console.log(`Voted: ${side} image!`);
    setHasVoted(true);

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
    side: VoteSide,
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
          translateY.value = withSpring(-height, {stiffness: 40, damping: 50});
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

  const arrowStyle = useAnimatedStyle(() => ({
    transform: [{translateY: arrowTranslateY.value}],
    opacity: interpolate(
      arrowTranslateY.value,
      [-10, 0],
      [1, 0.5],
      Extrapolation.CLAMP,
    ),
  }));

  return (
    <SafeAreaView style={globalStyle.flex}>
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

          {!hasVoted && (
            <Animated.View style={[arrowStyle, styles.arrowContainer]}>
              <ThemedIcon icon={faArrowUp} size={30} />
              <ThemedText>Swipe up to vote!</ThemedText>
            </Animated.View>
          )}
        </View>
      ) : (
        <View style={styles.container}>
          <ThemedText>No more pictures</ThemedText>
        </View>
      )}
    </SafeAreaView>
  );
};
