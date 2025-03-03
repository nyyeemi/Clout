import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {ProfileStackParamList, RootStackParamList, Routes} from './Routes';
import {HomeScreen} from '../screens/Home/HomeScreen';
import {LoginScreen} from '../screens/LoginScreen/LoginScreen';
import {RegisterScreen} from '../screens/RegisterScreen/RegisterScreen';
import {NavigationBar} from '../components/NavigationBar/NavigationBar';
import {LeaderboardScreen} from '../screens/LeaderboardScreen/LeaderboardScreen';
import {VoteScreen} from '../screens/Vote/VoteScreen';
import {CameraScreen} from '../screens/Camera/CameraScreen';
import {FeedScreen} from '../screens/Feed/FeedScreen';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store/store';
import {ProfileScreen} from '../screens/Profile/ProfileScreen';
import {SettingsScreen} from '../screens/Settings/SettingsScreen';
import {StyleSheet, View} from 'react-native';
import globalStyle from '../assets/styles/globalStyle';
import {FollowersScreen} from '../screens/Profile/FollowersScreen';
import {EditProfileScreen} from '../screens/Profile/EditProfileScreen';
import {ImageDetailsScreen} from '../screens/Profile/ImageDetailsScreen';

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

const BottomTabNavigator = () => {
  return (
    <>
      <Tab.Navigator
        screenOptions={{headerShown: false, tabBarStyle: {display: 'none'}}}>
        <Tab.Screen name={Routes.Home} component={HomeScreen} />
        <Tab.Screen name={Routes.Leaderboard} component={LeaderboardScreen} />
        <Tab.Screen name={Routes.Vote} component={VoteScreen} />
        <Tab.Screen name={Routes.Camera} component={CameraScreen} />
        <Tab.Screen name={Routes.Feed} component={FeedScreen} />
        <Tab.Screen name={Routes.ProfileStack} component={ProfileStackScreen} />
      </Tab.Navigator>
    </>
  );
};

// Screens for unauthenticated users
export const NonAuthenticated = (): JSX.Element => {
  return (
    <Stack.Navigator
      initialRouteName={Routes.Login}
      screenOptions={{
        header: () => null,
        headerShown: false,
      }}>
      <Stack.Screen name={Routes.Login} component={LoginScreen} />
      <Stack.Screen name={Routes.Register} component={RegisterScreen} />
    </Stack.Navigator>
  );
};
//screenOptions={{header: () => null, headerShown: false}}>
// Screens for authenticated users
export const Authenticated = (): JSX.Element => {
  const isCameraActive = useSelector(
    (state: RootState) => state.camera.isCameraActive,
  );

  return (
    <View style={[globalStyle.backgroundWhite, globalStyle.flex]}>
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
      {!isCameraActive && <NavigationBar />}
    </>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: '#fff',
    //elevation: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
