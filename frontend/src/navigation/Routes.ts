export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Register: undefined;
  Leaderboard: undefined;
  Vote: undefined;
  Camera: undefined;
  Feed: undefined;
  BottomTabNavigator: undefined;
  Profile: undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
  Settings: undefined;
  Followers: undefined;
  EditProfile: undefined;
  ImageDetail: {imageId: number};
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
} as const;
