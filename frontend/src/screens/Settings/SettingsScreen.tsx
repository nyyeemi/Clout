import React from 'react';
import {StyleSheet} from 'react-native';

import {
  faCircleQuestion,
  faCommentDots,
  faMoon,
} from '@fortawesome/free-regular-svg-icons';
import {faCircleInfo, faGear} from '@fortawesome/free-solid-svg-icons';
import {ScrollView} from 'react-native-gesture-handler';

import {ThemedView} from '../../components/ui/themed-view';
import {SettingsCard} from './components/SettingsCard';
import {SettingsCardItemType} from './components/SettingsCardItem';

export const SettingsScreen = () => {
  const profileCardItems: SettingsCardItemType[] = [
    {icon: faGear, title: 'Account', contentType: 'account'},

    //{icon: faGear, title: 'Privacy'},
    //{icon: faGear, title: 'Notifications'},
  ];

  const generalCardItems: SettingsCardItemType[] = [
    {icon: faMoon, title: 'Dark mode', contentType: 'toggle'},
  ];

  const helpCardItems: SettingsCardItemType[] = [
    {icon: faCircleQuestion, title: 'Help'},
    {icon: faCommentDots, title: 'SendFeedback'},
    {icon: faCircleInfo, title: 'About'},
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
      </ThemedView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 30,
    marginHorizontal: 15,
    marginTop: 15,
  },
});
