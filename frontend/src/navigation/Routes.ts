import {NavigatorScreenParams} from '@react-navigation/native';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
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
  Profile: {userId: number; username: string};
  Settings: undefined;
  Followers: {userId: number};
  EditProfile: undefined;
  ImageDetail: {imageId: number; username: string};
};

export type FeedStackParamList = {
  Feed: undefined;
  ProfileStack: NavigatorScreenParams<ProfileStackParamList>;
};

export const Routes = {
  Home: 'Home',
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
  ImageDetail: 'ImageDetail',
  ProfileStack: 'ProfileStack',
} as const;
