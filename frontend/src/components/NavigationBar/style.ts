import {StyleSheet} from 'react-native';
import {horizontalScale} from '../../assets/styles/scaling';

export const Style = StyleSheet.create({
  container: {
    //position: 'absolute',
    //bottom: 0,
    //left: 0,
    //right: 0,
    //paddingVertical: verticalScale(1),
    //height: verticalScale(70),
    //borderRadius: horizontalScale(40),
    //borderWidth: 1,
    //height: verticalScale(20),
    borderTopColor: 'lightgray',
    borderTopWidth: StyleSheet.hairlineWidth,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: horizontalScale(30),
    alignItems: 'center',
    //elevation: 5,
    //shadowColor: '#000',
    //shadowOpacity: 0.2,
    //shadowRadius: 5,
    //shadowOffset: {width: 0, height: 2},
  },
});
