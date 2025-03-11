import {Dimensions, StyleSheet} from 'react-native';
import {
  horizontalScale,
  scaleFontSize,
  verticalScale,
} from '../../assets/styles/scaling';

const {width} = Dimensions.get('window');
const IMAGE_WIDTH = width * 0.95;
const IMAGE_HEIGHT = (IMAGE_WIDTH / 3) * 4;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    marginHorizontal: horizontalScale(120),
    borderRadius: horizontalScale(15),
  },
  arrowContainer: {
    position: 'absolute',
    bottom: verticalScale(2),
    alignSelf: 'center',
    fontSize: scaleFontSize(24),
    alignItems: 'center',
  },
});
