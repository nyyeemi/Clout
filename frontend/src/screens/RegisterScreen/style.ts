import {StyleSheet} from 'react-native';
import {
  horizontalScale,
  scaleFontSize,
  verticalScale,
} from '../../assets/styles/scaling';

const style = StyleSheet.create({
  container: {
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(20),
  },
  title: {
    fontSize: scaleFontSize(24),
    fontWeight: 'bold',
    marginBottom: verticalScale(20),
    textAlign: 'center',
  },
  inputAndErrorContainer: {
    marginBottom: verticalScale(20),
  },
  error: {
    color: 'red',
    fontSize: scaleFontSize(14),
    marginTop: verticalScale(4),
  },
});

export default style;
