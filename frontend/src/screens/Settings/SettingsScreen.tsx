import React from 'react';
import {Alert, StyleSheet, View} from 'react-native';

import {IconDefinition} from '@fortawesome/fontawesome-svg-core';
import {
  faCircleQuestion,
  faCommentDots,
} from '@fortawesome/free-regular-svg-icons';
import {
  faArrowRightFromBracket,
  faCircleInfo,
  faGear,
} from '@fortawesome/free-solid-svg-icons';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useDispatch} from 'react-redux';

import {OpacityPressable} from '../../components/OpacityPressable/OpacityPressable';
import {ThemedView} from '../../components/ui/themed-view';
import {
  HeadlineText,
  ThemedIcon,
  Title2Text,
} from '../../components/ui/typography';
import {useTheme} from '../../hooks/useTheme';
import {SettingsStackParamList} from '../../navigation/Routes';
import {logout} from '../../redux/slices/authSlice';

export const SettingsScreen = () => {
  const titleList1: SettingsCardItemType[] = [
    {icon: faGear, title: 'General'},
    //{icon: faGear, title: 'Privacy'},
    //{icon: faGear, title: 'Notifications'},
  ];

  const titleList2: SettingsCardItemType[] = [
    {icon: faCircleQuestion, title: 'Help'},
    {icon: faCommentDots, title: 'SendFeedback'},
    {icon: faCircleInfo, title: 'About'},
  ];

  const titleList3: SettingsCardItemType[] = [
    {icon: faArrowRightFromBracket, title: 'Logout'},
  ];

  return (
    <ThemedView style={styles.container}>
      <SettingsCard header={'Account'} itemTitleList={titleList1} />
      <SettingsCard header={'Help and policies'} itemTitleList={titleList2} />
      <SettingsCard header={'Login'} itemTitleList={titleList3} />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

type SettingsCardItemType = {
  icon: IconDefinition;
  title: 'General' | 'Help' | 'SendFeedback' | 'About' | 'Logout';
};

const SettingsCardItem = ({icon, title}: SettingsCardItemType) => {
  const {colors} = useTheme();
  const dispatch = useDispatch();
  const navigation =
    useNavigation<StackNavigationProp<SettingsStackParamList>>();

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

  return (
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
  },
});

type SettingsCardType = {
  header: string;
  itemTitleList: {
    icon: IconDefinition;
    title: 'General' | 'Help' | 'SendFeedback' | 'About' | 'Logout';
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
