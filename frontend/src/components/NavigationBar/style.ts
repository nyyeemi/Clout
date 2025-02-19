import {StyleSheet} from 'react-native';
import {verticalScale, horizontalScale} from '../../assets/styles/scaling';

export const Style = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: verticalScale(0),
    left: verticalScale(0),
    right: verticalScale(0),
    height: verticalScale(70),
    //borderRadius: horizontalScale(40),
    borderWidth: 1,
    backgroundColor: '#FF5722',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: horizontalScale(10),
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 2},
  },
});
