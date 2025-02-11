import {StyleSheet} from 'react-native';
import {
  horizontalScale,
  scaleFontSize,
  verticalScale,
} from '../../assets/styles/scaling';

const style = StyleSheet.create({
  label: {
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: scaleFontSize(12),
    lineHeight: scaleFontSize(15),
    color: '#36455A',
  },
  input: {
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(4),
    borderWidth: 1,
    borderColor: 'rgba(167,167,167,0.5)',
    borderRadius: horizontalScale(5),
  },
});

export default style;
