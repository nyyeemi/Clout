export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Register: undefined;
  Leaderboard: undefined;
  Vote: undefined;
  Camera: undefined;
  Feed: undefined;
  Profile: undefined;
  BottomTabNavigator: undefined;
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
} as const;
