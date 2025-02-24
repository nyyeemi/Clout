import {StyleSheet} from 'react-native';
import {horizontalScale, verticalScale} from '../../assets/styles/scaling';

export const Style = StyleSheet.create({
  container: {
    marginHorizontal: horizontalScale(4),
    marginVertical: verticalScale(4),
  },
  activeButton: {
    backgroundColor: '#E64A19',
    borderRadius: horizontalScale(20),
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(12),
  },
  inactiveButton: {
    backgroundColor: 'transparent',
    borderRadius: horizontalScale(20),
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(12),
  },
});
