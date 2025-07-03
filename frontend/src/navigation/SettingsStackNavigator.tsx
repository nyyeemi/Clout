import React from 'react';

import {useTheme} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {AboutScreen} from '../screens/Settings/AboutScreen';
import {AccountScreen} from '../screens/Settings/AccountScreen';
import {FeedbackScreen} from '../screens/Settings/FeedbackScreen';
import {HelpScreen} from '../screens/Settings/HelpScreen';
import {SettingsScreen} from '../screens/Settings/SettingsScreen';
import {Routes, SettingsStackParamList} from './Routes';

const SettingsStack = createStackNavigator<SettingsStackParamList>();

export const SettingsStackNavigator = () => {
  const theme = useTheme();

  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: theme.colors.background},
        headerBackButtonDisplayMode: 'minimal',
      }}>
      <SettingsStack.Screen name={Routes.Settings} component={SettingsScreen} />
      <SettingsStack.Screen name={Routes.Account} component={AccountScreen} />
      <SettingsStack.Screen name={Routes.Help} component={HelpScreen} />
      <SettingsStack.Screen
        name={Routes.SendFeedBack}
        component={FeedbackScreen}
        options={{title: 'Send Feedback'}}
      />
      <SettingsStack.Screen name={Routes.About} component={AboutScreen} />
    </SettingsStack.Navigator>
  );
};
