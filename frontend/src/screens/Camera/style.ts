import {StyleSheet} from 'react-native';
import {horizontalScale, verticalScale} from '../../assets/styles/scaling';

export const Style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  changeCameraButton: {
    position: 'absolute',
    left: horizontalScale(20),
    bottom: verticalScale(50),
    padding: horizontalScale(10),
  },
  captureButton: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: verticalScale(40),
    padding: 20,
    backgroundColor: 'white',
    borderRadius: horizontalScale(50),
  },
  previewContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '90%',
    height: '70%',
    borderRadius: horizontalScale(10),
  },
  previewControls: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: verticalScale(40),
    width: '100%',
    justifyContent: 'space-evenly',
  },
  cancelButton: {
    padding: horizontalScale(15),
    //backgroundColor: 'red',
    borderRadius: horizontalScale(50),
  },
  confirmButton: {
    padding: horizontalScale(15),
    //backgroundColor: 'green',
    borderRadius: horizontalScale(50),
  },
  backButton: {
    position: 'absolute',
    top: verticalScale(50),
    left: horizontalScale(20),
    padding: horizontalScale(10),
  },
  flashButton: {
    position: 'absolute',
    top: verticalScale(50),
    right: horizontalScale(20),
    padding: horizontalScale(10),
    alignItems: 'center',
  },
  flashText: {color: 'white', fontSize: 11},
  flashSlashIcon: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
});
