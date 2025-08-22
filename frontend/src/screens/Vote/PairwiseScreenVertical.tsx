import {useEffect} from 'react';
import {Dimensions, StyleSheet, TouchableOpacity, View} from 'react-native';

import {
  faChevronLeft,
  faDraftingCompass,
} from '@fortawesome/free-solid-svg-icons';
import {useNavigation} from '@react-navigation/native';
import {
  Directions,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import {BodyText, ThemedIcon, Title3Text} from '../../components/ui/typography';
import {useTheme} from '../../hooks/useTheme';
import {
  useCreateVoteMutation,
  useGetVotePairQuery,
} from '../../redux/api/endpoints/competitions';

export const PairwiseScreenVertical = () => {
  const navigation = useNavigation();
  const {colors} = useTheme();
  const {
    data: imagePair,
    isLoading: isLoadingImagePair,
    error,
  } = useGetVotePairQuery();

  const [createVote, {isError: isCreateVoteError, error: createVoteError}] =
    useCreateVoteMutation();

  useEffect(() => {
    navigation.setOptions({tabBarStyle: {display: 'none'}});
  }, [navigation]);

  const offset = useSharedValue<number>(0);
  const baseOffset = useSharedValue(0);

  const REVEAL_THRESHOLD = -IMAGE1_Y;
  const DECISION_THRESHOLD = REVEAL_THRESHOLD + 80;

  const DECISION_SECTION_HEIGHT = 80;

  const REVEAL_THRESHOLD_TOP = -IMAGE1_Y;
  const DECISION_THRESHOLD_TOP = REVEAL_THRESHOLD_TOP + DECISION_SECTION_HEIGHT;

  const REVEAL_THRESHOLD_BOTTOM = -REVEAL_THRESHOLD_TOP; //IMAGE2_Y - IMAGE_HEIGHT;

  const DECISION_THRESHOLD_BOTTOM =
    REVEAL_THRESHOLD_BOTTOM - DECISION_SECTION_HEIGHT;

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      console.log(offset.value);
      offset.value = 0;
    })
    .onChange(e => {
      const dragDistance = baseOffset.value + e.translationY;
      console.log(dragDistance);

      if (
        dragDistance <= REVEAL_THRESHOLD_TOP &&
        dragDistance >= REVEAL_THRESHOLD_BOTTOM
      ) {
        offset.value = e.translationY;
      } else if (dragDistance < REVEAL_THRESHOLD_BOTTOM) {
        // BOTTOM SECTION
        const excess = dragDistance - REVEAL_THRESHOLD_BOTTOM;
        const smoothCurve = Math.log(Math.abs(excess) * 0.5 + 1) * 10;
        offset.value = e.translationY - excess - smoothCurve;
      } else {
        // TOP SECTION
        const excess = dragDistance - REVEAL_THRESHOLD_TOP;
        const smoothCurve = Math.log(excess * 0.5 + 1) * 10;
        offset.value = e.translationY - excess + smoothCurve;
      }
      //offset.value = e.translationY;
    })
    .onFinalize(e => {
      const finalPosition = baseOffset.value + offset.value;
      if (
        finalPosition > REVEAL_THRESHOLD_TOP - 40 &&
        finalPosition < DECISION_THRESHOLD_TOP
      ) {
        //offset.value = withTiming(REVEAL_THRESHOLD);
        baseOffset.value = withTiming(REVEAL_THRESHOLD_TOP);
      } else if (
        finalPosition < REVEAL_THRESHOLD_BOTTOM + 40 &&
        finalPosition > DECISION_THRESHOLD_BOTTOM
      ) {
        baseOffset.value = withTiming(REVEAL_THRESHOLD_BOTTOM);
      } else {
        baseOffset.value = withTiming(0);
      }
      offset.value = withTiming(0);
    });

  const animatedImagePropsBottom = useAnimatedProps(() => {
    const blurTransform = interpolate(
      baseOffset.value + offset.value,
      [0, 150],
      [0, 3],
      Extrapolation.CLAMP,
    );
    //blur.value = blurTransform;

    return {blurRadius: blurTransform};
  });

  const animatedImagePropsTop = useAnimatedProps(() => {
    const blurTransform = interpolate(
      baseOffset.value + offset.value,
      [0, -150],
      [0, 3],
      Extrapolation.CLAMP,
    );
    //blur.value = blurTransform;

    return {blurRadius: blurTransform};
  });

  const animatedStyleTranslationY = useAnimatedStyle(() => {
    const translateY = Math.min(
      baseOffset.value + offset.value,
      DECISION_THRESHOLD,
    );

    console.log(DECISION_THRESHOLD, translateY);

    return {
      transform: [
        {
          translateY,
        },
      ],
    };
  });

  console.log(IMAGE1_Y);
  return (
    <View style={{flex: 1}}>
      <Animated.View
        style={[
          animatedStyleTranslationY,
          {
            position: 'absolute',
            top: IMAGE1_Y - 80,
            //left: 0,
            height: 80,
            width: width,
            backgroundColor: 'rgb(52, 199, 89)',
            elevation: -10,
            //zIndex: 10,
          },
        ]}
      />
      <Animated.View
        style={[
          animatedStyleTranslationY,
          {
            position: 'absolute',
            top: IMAGE2_Y + IMAGE_HEIGHT,
            //left: 0,
            height: 80,
            width: width,
            backgroundColor: 'rgb(52, 199, 89)',
            //elevation: -10,
          },
        ]}
      />
      <GestureDetector gesture={panGesture}>
        <View>
          <Animated.Image
            source={{uri: imagePair?.entry_1.post.image_url}}
            style={[
              styles.image,
              animatedStyleTranslationY,
              {position: 'absolute', top: IMAGE1_Y, left: 0},
            ]}
            resizeMode={'cover'}
            animatedProps={animatedImagePropsTop}
          />
          <Animated.View
            style={[
              {
                height: DIVIDER_HEIGHT,
                position: 'absolute',
                top: DIVIDER_Y,
                left: 0,
                right: 0,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.background,
                elevation: 5,
                shadowColor: 'black',
                zIndex: 2,
              },
              animatedStyleTranslationY,
            ]}>
            <View
              style={{
                borderRadius: 15,
                width: 100,
                height: 2,
                backgroundColor: colors.textSecondary,
              }}
            />
          </Animated.View>
          <Animated.Image
            source={{uri: imagePair?.entry_2.post.image_url}}
            style={[
              styles.image,
              animatedStyleTranslationY,
              {position: 'absolute', top: IMAGE2_Y, left: 0},
            ]}
            resizeMode={'cover'}
            animatedProps={animatedImagePropsBottom}
          />
        </View>
      </GestureDetector>
      <TouchableOpacity></TouchableOpacity>
      <ThemedIcon
        //color=}
        icon={faChevronLeft}
        size={20}
        containerStyle={{
          position: 'absolute',
          top: 0,
          left: 0,
          margin: 25,
          padding: 10,
          backgroundColor: colors.card,
          borderRadius: 100,
          shadowColor: 'black',
          shadowOpacity: 0.9,
          shadowRadius: 10,
          shadowOffset: {width: -1, height: 0},
          elevation: 10, // for Android
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: 65,
          width: 65,
          margin: 25,
          //padding: 30,
          backgroundColor: colors.card,
          borderRadius: 100,
          shadowColor: 'black',
          shadowOpacity: 0.9,
          shadowRadius: 10,
          shadowOffset: {width: -1, height: 0},
          elevation: 10, // for Android
          alignItems: 'center',
          justifyContent: 'center',
          //opacity: 0.6,
        }}>
        <Title3Text variant="medium">🔥</Title3Text>
        <BodyText variant="heavy" style={{color: colors.primary}}>
          15
        </BodyText>
      </View>
    </View>
  );
};

const {width, height} = Dimensions.get('window');
const IMAGE_WIDTH = width;
const IMAGE_HEIGHT = Math.round((IMAGE_WIDTH / 3) * 4);
const DIVIDER_HEIGHT = 8;

const DIVIDER_Y = (height - DIVIDER_HEIGHT) / 2; // Center the divider vertically
const IMAGE1_Y = DIVIDER_Y - IMAGE_HEIGHT; // Image 1 ends where divider starts
const IMAGE2_Y = DIVIDER_Y + DIVIDER_HEIGHT; // Image 2 starts where divider ends

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    //flexDirection: 'column',
    //justifyContent: 'center',
    //alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
  },
});
