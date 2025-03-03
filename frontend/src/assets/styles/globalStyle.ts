import {StyleSheet} from 'react-native';
import {verticalScale, horizontalScale} from './scaling';

const globalStyle = StyleSheet.create({
  backgroundWhite: {
    backgroundColor: '#FFFFFF',
  },
  flex: {flex: 1},
  defaultPadding: {
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(20),
  },
});

export default globalStyle;
