import React from 'react';
import {faBars} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {StyleSheet, View, Text} from 'react-native';
import globalStyle from '../../../assets/styles/globalStyle';
import {scaleFontSize} from '../../../assets/styles/scaling';
import {ProfileStackParamList} from '../../../navigation/Routes';
import {CustomPressable} from '../CustomPressable';
import {CustomUser} from './ProfileInfoCard';

const headerstyle = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: globalStyle.defaultPadding.paddingHorizontal,
    paddingVertical: globalStyle.defaultPadding.paddingVertical,
  },
  text: {
    fontWeight: 'bold',
    fontSize: scaleFontSize(20),
    textAlignVertical: 'bottom',
  },
});

export const ProfileHeader = ({user}: {user: CustomUser}): JSX.Element => {
  const navigation =
    useNavigation<StackNavigationProp<ProfileStackParamList>>();
  const onPress = () => {
    navigation.navigate('Settings');
  };
  return (
    <View style={headerstyle.container}>
      <Text style={headerstyle.text}>{user.username}</Text>
      <CustomPressable onPress={onPress}>
        <FontAwesomeIcon icon={faBars} size={20} />
      </CustomPressable>
    </View>
  );
};
