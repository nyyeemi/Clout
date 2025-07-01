import React from 'react';
import {Alert, StyleSheet, Switch, View} from 'react-native';

import {IconDefinition} from '@fortawesome/fontawesome-svg-core';
import {
  faCircleQuestion,
  faCommentDots,
  faMoon,
} from '@fortawesome/free-regular-svg-icons';
import {
  faArrowRightFromBracket,
  faCircleInfo,
  faGear,
} from '@fortawesome/free-solid-svg-icons';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import {isEnabled} from 'react-native/Libraries/Performance/Systrace';
import {useDispatch} from 'react-redux';

import {OpacityPressable} from '../../components/OpacityPressable/OpacityPressable';
import {ProfilePicture} from '../../components/ProfilePicture/ProfilePicture';
import {ThemedView} from '../../components/ui/themed-view';
import {
  HeadlineText,
  ThemedIcon,
  Title2Text,
  Title3Text,
} from '../../components/ui/typography';
import {useTheme} from '../../hooks/useTheme';
import {SettingsStackParamList} from '../../navigation/Routes';
import {useGetUsersMeQuery} from '../../redux/api/endpoints/users';
import {logout} from '../../redux/slices/authSlice';
import {DarkmodeToggle} from './DarkmodeToggle';

export const SettingsScreen = () => {
  const profileCardItems: SettingsCardItemType[] = [
    {icon: faGear, title: 'Account'},

    //{icon: faGear, title: 'Privacy'},
    //{icon: faGear, title: 'Notifications'},
  ];

  const generalCardItems: SettingsCardItemType[] = [
    {icon: faMoon, title: 'Dark mode'},
  ];

  const helpCardItems: SettingsCardItemType[] = [
    {icon: faCircleQuestion, title: 'Help'},
    {icon: faCommentDots, title: 'SendFeedback'},
    {icon: faCircleInfo, title: 'About'},
  ];

  const loginCardItems: SettingsCardItemType[] = [
    {icon: faArrowRightFromBracket, title: 'Logout'},
  ];

  return (
    <ScrollView>
      <ThemedView style={styles.container}>
        <SettingsCard header={'Account'} itemTitleList={profileCardItems} />
        <SettingsCard header={'General'} itemTitleList={generalCardItems} />
        <SettingsCard
          header={'Help and policies'}
          itemTitleList={helpCardItems}
        />
        <SettingsCard header={'Login'} itemTitleList={loginCardItems} />
      </ThemedView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

type SettingsCardItemType = {
  icon: IconDefinition;
  title:
    | 'Account'
    | 'Help'
    | 'SendFeedback'
    | 'About'
    | 'Logout'
    | 'Dark mode'
    | string;
};

const SettingsCardItem = ({icon, title}: SettingsCardItemType) => {
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
    } else {
      navigation.navigate(title);
    }
  };

  const account = !isError ? currentUser?.username : 'Account settings';

  return title === 'Dark mode' ? (
    <View style={stylesItems.darkmode}>
      <View style={stylesItems.container}>
        <ThemedIcon icon={icon} />
        <HeadlineText>{title}</HeadlineText>
      </View>
      <DarkmodeToggle />
    </View>
  ) : title === 'Account' ? (
    <OpacityPressable
      style={stylesItems.container}
      onPress={() => handlePress()}>
      <ProfilePicture uri={currentUser?.profile_picture_url} size="small" />
      <HeadlineText>{account}</HeadlineText>
    </OpacityPressable>
  ) : (
    <OpacityPressable
      style={stylesItems.container}
      onPress={() => handlePress()}>
      <ThemedIcon
        icon={icon}
        color={title === 'Logout' ? colors.warning : undefined}
      />
      <HeadlineText style={title === 'Logout' && {color: colors.warning}}>
        {title === 'SendFeedback' ? 'Send feedback' : title}
      </HeadlineText>
    </OpacityPressable>
  );
};

const stylesItems = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
  darkmode: {
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

type SettingsCardType = {
  header: string;
  itemTitleList: {
    icon: IconDefinition;
    title:
      | 'Account'
      | 'Help'
      | 'SendFeedback'
      | 'About'
      | 'Logout'
      | 'Darkmode'
      | string;
  }[];
};

const SettingsCard = ({header, itemTitleList}: SettingsCardType) => {
  const {colors} = useTheme();

  return (
    <View style={[stylesCard.container, {borderBottomColor: colors.border}]}>
      <Title2Text variant="bold">{header}</Title2Text>
      {itemTitleList.map(item => (
        <SettingsCardItem icon={item.icon} title={item.title} />
      ))}
    </View>
  );
};

const stylesCard = StyleSheet.create({
  container: {
    gap: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
