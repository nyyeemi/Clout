import {Alert, StyleSheet, View} from 'react-native';

import {IconDefinition} from '@fortawesome/fontawesome-svg-core';
import {faChevronRight} from '@fortawesome/free-solid-svg-icons';
import {useNavigation, useTheme} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useDispatch} from 'react-redux';

import {OpacityPressable} from '../../../components/OpacityPressable/OpacityPressable';
import {ProfilePicture} from '../../../components/ProfilePicture/ProfilePicture';
import {HeadlineText, ThemedIcon} from '../../../components/ui/typography';
import {SettingsStackParamList} from '../../../navigation/Routes';
import {useGetUsersMeQuery} from '../../../redux/api/endpoints/users';
import {logout} from '../../../redux/slices/authSlice';
import {DarkmodeToggle} from './DarkmodeToggle';

export type SettingsCardItemType = {
  icon: IconDefinition;
  title: 'Account' | 'Help' | 'SendFeedback' | 'About' | 'Logout' | 'Dark mode';
  //| string;
  contentType?: 'toggle' | 'account';
  isLastItem?: boolean;
};

export const SettingsCardItem = ({
  icon,
  title,
  contentType,
  isLastItem,
}: SettingsCardItemType) => {
  const {colors} = useTheme();
  const dispatch = useDispatch();
  const navigation =
    useNavigation<StackNavigationProp<SettingsStackParamList>>();
  const {data: currentUser, isError} = useGetUsersMeQuery();

  const handlePress = () => {
    if (title === 'Logout') {
      Alert.alert('Logout', 'This action will log your account out.', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Logout', onPress: () => dispatch(logout())},
      ]);
    } else if (title !== 'Dark mode') {
      navigation.navigate(title);
    }
  };

  const account = !isError ? currentUser?.username : 'Account settings';

  return contentType === 'toggle' ? (
    <View style={styles.darkmode}>
      <View style={styles.subContainer}>
        <ThemedIcon icon={icon} />
        <HeadlineText>Dark mode</HeadlineText>
      </View>
      <DarkmodeToggle />
    </View>
  ) : contentType === 'account' ? (
    <OpacityPressable
      style={styles.accountContainer}
      onPress={() => handlePress()}>
      <ProfilePicture uri={currentUser?.profile_picture_url} size="small" />
      <View
        style={[
          styles.divider,
          !isLastItem && {
            borderBottomColor: colors.border,
            borderBottomWidth: StyleSheet.hairlineWidth,
          },
        ]}>
        <HeadlineText>{account}</HeadlineText>
        <ThemedIcon
          icon={faChevronRight}
          size={15}
          color={colors.border}
          containerStyle={styles.iconContainer}
        />
      </View>
    </OpacityPressable>
  ) : (
    <OpacityPressable style={styles.container} onPress={() => handlePress()}>
      <ThemedIcon icon={icon} />
      <View
        style={[
          styles.divider,
          !isLastItem && {
            borderBottomColor: colors.border,
            borderBottomWidth: StyleSheet.hairlineWidth,
          },
        ]}>
        <HeadlineText>
          {title === 'SendFeedback' ? 'Send feedback' : title}
        </HeadlineText>
        <ThemedIcon
          icon={faChevronRight}
          size={15}
          color={colors.border}
          containerStyle={styles.iconContainer}
        />
      </View>
    </OpacityPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
  accountContainer: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
    paddingVertical: 10,
  },
  subContainer: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
  darkmode: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingRight: 10,
  },
  divider: {
    flex: 1,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconContainer: {paddingHorizontal: 10},
});
