export const Routes = {
  Home: 'Home',
  Login: 'Login',
  Register: 'Register',
} as const;

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Register: undefined;
};
