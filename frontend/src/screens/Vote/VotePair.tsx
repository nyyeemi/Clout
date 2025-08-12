import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, Image, StyleSheet, View} from 'react-native';

import {faArrowUp} from '@fortawesome/free-solid-svg-icons';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  Easing,
  Extrapolation,
  SharedValue,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import {ThemedIcon, ThemedText} from '../../components/ui/typography';
import {
  PostMinimal,
  useCreateVoteMutation,
  useGetVotePairQuery,
} from '../../redux/api/endpoints/competitions';

const AnimatedImage = Animated.createAnimatedComponent(Image);

export const VotePair = () => {
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

  const tabBarHeight = useBottomTabBarHeight();

  const {
    data: imagePair,
    isLoading: isLoadingImagePair,
    error,
  } = useGetVotePairQuery();

  const [createVote, {isError: isCreateVoteError, error: createVoteError}] =
    useCreateVoteMutation();

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

  const voteImage = (image: PostMinimal) => {
    console.log(`Voted: ${image.id} image!`);
    setHasVoted(true);

    //TODO: API call for voting the image

    if (imagePair) {
      const payload = {
        winner_id: image.id,
        loser_id: imagePair.entry_2.id,
      };
      createVote(payload);
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setHasVoted(false);
    }, 15000);

    setTimeout(() => {
      leftTranslateY.value = 0;
      rightTranslateY.value = 0;
      leftOpacity.value = 1;
      rightOpacity.value = 1;
    }, 300);
  };

  const createImageGesture = (
    translateY: SharedValue<number>,
    opacity: SharedValue<number>,
    image: PostMinimal,
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

  const leftImageGesture = imagePair
    ? createImageGesture(leftTranslateY, leftOpacity, imagePair?.entry_1)
    : undefined;

  const rightImageGesture = imagePair
    ? createImageGesture(rightTranslateY, rightOpacity, imagePair?.entry_2)
    : undefined;

  console.log(createVoteError);

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
  const scaledTranslateX = 285;
  const scaledTranslateX2 = 10;

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
  const scaledArrowTranslateY = 10;
  const scaledArrowTranslateY2 = 0;

  const arrowStyle = useAnimatedStyle(() => ({
    transform: [{translateY: arrowTranslateY.value}],
    opacity: interpolate(
      arrowTranslateY.value,
      [-scaledArrowTranslateY, scaledArrowTranslateY2],
      [1, 0.5],
      Extrapolation.CLAMP,
    ),
  }));

  const leftImageUrl = imagePair?.entry_1.post.image_url;
  const rightImageUrl = imagePair?.entry_2.post.image_url;

  return (
    <View style={{flex: 1}}>
      {!isLoadingImagePair ? (
        <GestureDetector gesture={backgroundGesture}>
          <View style={styles.container}>
            {leftImageGesture && (
              <GestureDetector gesture={leftImageGesture}>
                <AnimatedImage
                  source={{uri: leftImageUrl}}
                  style={[styles.image, leftImageStyle]}
                  resizeMode={'cover'}
                />
              </GestureDetector>
            )}
            {rightImageGesture && (
              <GestureDetector gesture={rightImageGesture}>
                <AnimatedImage
                  source={{uri: rightImageUrl}}
                  style={[styles.image, rightImageStyle]}
                  resizeMode={'cover'}
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
    </View>
  );
};

const {width} = Dimensions.get('window');
const IMAGE_WIDTH = width * 0.95;
const IMAGE_HEIGHT = (IMAGE_WIDTH / 3) * 4;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    //alignItems: 'center',
  },
  image: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    marginHorizontal: 120,
    borderRadius: 15,
  },
  arrowContainer: {
    position: 'absolute',
    bottom: 2,
    alignSelf: 'center',
    fontSize: 24,
    alignItems: 'center',
  },
});
