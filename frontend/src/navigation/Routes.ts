import {NavigatorScreenParams} from '@react-navigation/native';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Leaderboard: undefined;
  Vote: undefined;
  Camera: undefined;
  Feed: undefined;
  FeedStack: undefined;
  BottomTabNavigator: undefined;
  ProfileStack: NavigatorScreenParams<ProfileStackParamList>;
  Profile: {userId: number};
};

export type ProfileStackParamList = {
  Profile: {username: string};
  SettingsStack: NavigatorScreenParams<SettingsStackParamList>;
  Followers: {index: number; username: string};
  EditProfile: undefined;
  ProfileFeed: {imageId: string; username: string};
};

export type SettingsStackParamList = {
  Settings: undefined;
  Account: undefined;
  Help: undefined;
  SendFeedback: undefined;
  About: undefined;
};

export type FeedStackParamList = {
  Feed: undefined;
  ProfileStack: NavigatorScreenParams<ProfileStackParamList>;
};

export const Routes = {
  Login: 'Login',
  Register: 'Register',
  Leaderboard: 'Leaderboard',
  Vote: 'Vote',
  Camera: 'Camera',
  Feed: 'Feed',
  FeedStack: 'FeedStack',
  Profile: 'Profile',
  BottomTabNavigator: 'BottomTabNavigator',
  Settings: 'Settings',
  Followers: 'Followers',
  EditProfile: 'EditProfile',
  ProfileFeed: 'ProfileFeed',
  ProfileStack: 'ProfileStack',
  SettingsStack: 'SettingsStack',
  Account: 'Account',
  Help: 'Help',
  SendFeedBack: 'SendFeedback',
  About: 'About',
} as const;
