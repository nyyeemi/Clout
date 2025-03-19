export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Register: undefined;
  Leaderboard: undefined;
  Vote: undefined;
  Camera: undefined;
  Feed: undefined;
  BottomTabNavigator: undefined;
  ProfileStack: undefined;
  Profile: {userId: number};
};

export type ProfileStackParamList = {
  Profile: {userId: number};
  Settings: undefined;
  Followers: undefined;
  EditProfile: undefined;
  ImageDetail: {imageId: number};
};

export type FeedStackParamList = {
  Feed: undefined;
  ProfileStack: undefined;
};

export const Routes = {
  Home: 'Home',
  Login: 'Login',
  Register: 'Register',
  Leaderboard: 'Leaderboard',
  Vote: 'Vote',
  Camera: 'Camera',
  Feed: 'Feed',
  Profile: 'Profile',
  BottomTabNavigator: 'BottomTabNavigator',
  Settings: 'Settings',
  Followers: 'Followers',
  EditProfile: 'EditProfile',
  ImageDetail: 'ImageDetail',
  ProfileStack: 'ProfileStack',
} as const;
