import React from 'react';
import {faBars} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {useNavigation, useTheme} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {StyleSheet, View} from 'react-native';
import globalStyle from '../../../assets/styles/globalStyle';
import {ProfileStackParamList} from '../../../navigation/Routes';
import {CustomPressable} from '../CustomPressable';
import {CustomUser} from './ProfileInfoCard';
import {ThemedText} from '../../../components/ui/typography';

export const ProfileHeader = ({user}: {user: CustomUser}): JSX.Element => {
  const {colors} = useTheme();
  const navigation =
    useNavigation<StackNavigationProp<ProfileStackParamList>>();
  const onPress = () => {
    navigation.navigate('Settings');
  };
  return (
    <View style={headerstyle.container}>
      <ThemedText style={headerstyle.text}>{user.username}</ThemedText>
      <CustomPressable onPress={onPress}>
        <FontAwesomeIcon icon={faBars} size={20} color={colors.text} />
      </CustomPressable>
    </View>
  );
};

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
    fontSize: 20,
    textAlignVertical: 'bottom',
  },
});
