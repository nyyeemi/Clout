import {Dimensions, StyleSheet} from 'react-native';
import {horizontalScale, scaleFontSize} from '../../assets/styles/scaling';
import globalStyle from '../../assets/styles/globalStyle';

const {width, height} = Dimensions.get('window');
console.log(height);
const imageWidth = Math.ceil(width / 3);
console.log(imageWidth % 3);
const buttonTextSize = scaleFontSize(17);
console.log(buttonTextSize);
export const imageHeight = imageWidth * (4 / 3);

export const style = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: horizontalScale(8),
    flexDirection: 'column',
    paddingHorizontal: globalStyle.defaultPadding.paddingHorizontal,
  },
  image: {
    width: horizontalScale(75),
    height: horizontalScale(75),
    borderRadius: horizontalScale(75),
    borderWidth: StyleSheet.hairlineWidth * 3,
    borderColor: '#dedede',
  },
  name: {
    fontWeight: 'bold',
  },
  divider: {
    paddingTop: horizontalScale(5),
    borderBottomColor: '#dedede',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  button: {
    //paddingHorizontal: horizontalScale(30),
    paddingVertical: horizontalScale(3),
    width: horizontalScale(150),
    borderRadius: 6,
    alignSelf: 'center',
    borderWidth: StyleSheet.hairlineWidth * 5,
    borderColor: 'black',
    //backgroundColor: 'lightgray',
  },
  imageBox: {
    width: imageWidth,
    height: imageHeight,
    borderWidth: StyleSheet.hairlineWidth * 1,
    borderColor: 'white',
  },
});
