import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  BottomTabBarButtonProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {ProfileStackParamList, RootStackParamList, Routes} from './Routes';
//import {HomeScreen} from '../screens/Home/HomeScreen';
import {LoginScreen} from '../screens/LoginScreen/LoginScreen';
import {RegisterScreen} from '../screens/RegisterScreen/RegisterScreen';
import {LeaderboardScreen} from '../screens/LeaderboardScreen/LeaderboardScreen';
import {VoteScreen} from '../screens/Vote/VoteScreen';
import {CameraScreen} from '../screens/Camera/CameraScreen';
import {FeedScreen} from '../screens/Feed/FeedScreen';
import {ProfileScreen} from '../screens/Profile/ProfileScreen';
import {SettingsScreen} from '../screens/Settings/SettingsScreen';
import {Pressable, StyleSheet, View} from 'react-native';
import globalStyle from '../assets/styles/globalStyle';
import {FollowersScreen} from '../screens/Profile/FollowersScreen';
import {EditProfileScreen} from '../screens/Profile/EditProfileScreen';
import {ImageDetailsScreen} from '../screens/Profile/ImageDetailsScreen';
import {RouteProp, useTheme} from '@react-navigation/native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faCamera,
  faAward,
  faImages,
  IconDefinition,
  faUser,
  faHouse,
} from '@fortawesome/free-solid-svg-icons';
import {ThemedView} from '../components/ui/themed-view';

const Stack = createStackNavigator<RootStackParamList>();
const ProfileStack = createStackNavigator<ProfileStackParamList>();
const Tab = createBottomTabNavigator<RootStackParamList>();

const ProfileStackScreen = () => {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name={Routes.Profile}
        component={ProfileScreen}
        options={{header: () => null, headerShown: false}}
      />
      <ProfileStack.Screen name={Routes.Settings} component={SettingsScreen} />
      <ProfileStack.Screen
        name={Routes.Followers}
        component={FollowersScreen}
      />
      <ProfileStack.Screen
        name={Routes.EditProfile}
        component={EditProfileScreen}
        options={{title: 'Edit profile'}}
      />
      <ProfileStack.Screen
        name={Routes.ImageDetail}
        component={ImageDetailsScreen}
        options={{title: 'Post'}}
      />
    </ProfileStack.Navigator>
  );
};

type tabBarIconProps = {
  route: RouteProp<RootStackParamList, keyof RootStackParamList>;
  focused: boolean;
  color: string;
  size: number;
};

const tabBarIcon = ({route, focused, color, size}: tabBarIconProps) => {
  let icon: IconDefinition = faHouse;
  console.log(focused);

  if (route.name === Routes.Vote) {
    icon = faHouse;
    /*icon = focused
      ? 'ios-information-circle'
      : 'ios-information-circle-outline';*/
  } else if (route.name === Routes.Leaderboard) {
    icon = faAward;
  } else if (route.name === Routes.Camera) {
    icon = faCamera;
  } else if (route.name === Routes.Feed) {
    icon = faImages;
  } else if (route.name === Routes.ProfileStack) {
    icon = faUser;
  }
  // You can return any component that you like here!
  return <FontAwesomeIcon icon={icon} size={size} color={color} />;
};

const CustomPressable = ({
  onPress,
  style,
  children,
}: BottomTabBarButtonProps) => {
  const {colors} = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [
        {opacity: pressed ? 0.7 : 1},
        style,
        {backgroundColor: colors.background, borderColor: colors.text},
      ]}>
      {children}
    </Pressable>
  );
};

const tabBarButton = (props: BottomTabBarButtonProps) => (
  <CustomPressable {...props} />
);

const BottomTabNavigator = () => {
  const theme = useTheme();
  return (
    <>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) =>
            tabBarIcon({route, focused, color, size}),
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
          tabBarButton: tabBarButton,
          tabBarStyle: {
            backgroundColor: theme.colors.background,
          },
          header: () => null,
          headerShown: false,
          tabBarShowLabel: false,
        })}>
        {/* <Tab.Screen name={Routes.Home} component={HomeScreen}/> */}
        <Tab.Screen name={Routes.Vote} component={VoteScreen} />
        <Tab.Screen name={Routes.Leaderboard} component={LeaderboardScreen} />
        <Tab.Screen
          name={Routes.Camera}
          component={CameraScreen}
          options={{tabBarStyle: {display: 'none'}}}
        />
        <Tab.Screen name={Routes.Feed} component={FeedScreen} />
        <Tab.Screen name={Routes.ProfileStack} component={ProfileStackScreen} />
      </Tab.Navigator>
    </>
  );
};

// Screens for unauthenticated users
export const NonAuthenticated = (): JSX.Element => {
  return (
    <ThemedView style={globalStyle.flex}>
      <Stack.Navigator
        initialRouteName={Routes.Login}
        screenOptions={{
          header: () => null,
          headerShown: false,
        }}>
        <Stack.Screen name={Routes.Login} component={LoginScreen} />
        <Stack.Screen name={Routes.Register} component={RegisterScreen} />
      </Stack.Navigator>
    </ThemedView>
  );
};
//screenOptions={{header: () => null, headerShown: false}}>
// Screens for authenticated users
export const Authenticated = (): JSX.Element => {
  const {colors} = useTheme();
  /*const isCameraActive = useSelector(
    (state: RootState) => state.camera.isCameraActive,
  );*/

  return (
    <View style={[{backgroundColor: colors.background}, globalStyle.flex]}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: styles.headerStyle,
          headerShadowVisible: false,
          headerTitleAlign: 'center',
        }}>
        <Stack.Screen
          name="BottomTabNavigator"
          component={BottomTabNavigator}
          options={{header: () => null, headerShown: false}}
        />
      </Stack.Navigator>
      {/*!isCameraActive && <NavigationBar />*/}
    </View>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: '#fff',
    //elevation: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
