import {StyleSheet} from 'react-native';
import {horizontalScale, verticalScale} from '../../assets/styles/scaling';

export const Style = StyleSheet.create({
  container: {
    marginHorizontal: horizontalScale(6),
    marginVertical: verticalScale(6),
    marginBottom: verticalScale(11),
  },
  activeButton: {},
  inactiveButton: {},
});
