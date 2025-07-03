import {Alert, StyleSheet, View} from 'react-native';

import {faArrowRightFromBracket} from '@fortawesome/free-solid-svg-icons';
import {useDispatch} from 'react-redux';

import {OpacityPressable} from '../../../components/OpacityPressable/OpacityPressable';
import {HeadlineText, ThemedIcon} from '../../../components/ui/typography';
import {useTheme} from '../../../hooks/useTheme';
import {logout} from '../../../redux/slices/authSlice';

export const LogoutMenu = () => {
  const {colors} = useTheme();
  const dispatch = useDispatch();

  const handleLogout = () =>
    Alert.alert('Logout', 'This action will log your account out.', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'Logout', onPress: () => dispatch(logout())},
    ]);

  return (
    <View style={[styles.cardContainer, {borderBottomColor: colors.border}]}>
      <OpacityPressable style={styles.logout} onPress={() => handleLogout()}>
        <ThemedIcon
          icon={faArrowRightFromBracket}
          color={colors.warning}
          size={20}
        />
        <HeadlineText style={{color: colors.warning}}>Log out</HeadlineText>
      </OpacityPressable>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    gap: 10,
    paddingVertical: 10,
  },
  logout: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
});
