import {Dimensions, StyleSheet} from 'react-native';
import {horizontalScale} from '../../assets/styles/scaling';
import globalStyle from '../../assets/styles/globalStyle';

const {width, height} = Dimensions.get('window');

const imageWidth = Math.floor(width / 3);
const imageHeight = imageWidth * (4 / 3);

const style = StyleSheet.create({
  container: {
    marginTop: horizontalScale(8),
    flexDirection: 'column',
    paddingHorizontal: globalStyle.defaultPadding.paddingHorizontal,
  },
  box: {
    height: horizontalScale(75),
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  infoBar: {
    paddingBottom: horizontalScale(7),
    flexDirection: 'row',
    justifyContent: 'center',
  },
  image: {
    width: horizontalScale(75),
    height: horizontalScale(75),
    borderRadius: horizontalScale(75),
    borderWidth: StyleSheet.hairlineWidth * 3,
    borderColor: '#dedede',
  },
  boxNumber: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  boxText: {
    textAlign: 'center',
  },
  name: {
    fontWeight: 'bold',
  },
  divider: {
    padding: horizontalScale(5),
    borderBottomColor: '#dedede',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  button: {
    //paddingHorizontal: horizontalScale(30),
    paddingVertical: horizontalScale(3),
    width: horizontalScale(150),
    borderRadius: 6,
    alignSelf: 'center',
    //backgroundColor: 'lightgray',
  },
  imageBox: {
    width: imageWidth,
    height: imageHeight,
    borderWidth: StyleSheet.hairlineWidth * 3,
    borderColor: 'white',
  },
});

export default style;
