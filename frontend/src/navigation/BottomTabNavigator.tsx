import React from 'react';
import {IconDefinition} from '@fortawesome/fontawesome-svg-core';
import {
  faHouse,
  faAward,
  faCamera,
  faImages,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  BottomTabBarButtonProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {RouteProp, useTheme} from '@react-navigation/native';
import {Pressable} from 'react-native';
import {CameraScreen} from '../screens/Camera/CameraScreen';
import {LeaderboardScreen} from '../screens/LeaderboardScreen/LeaderboardScreen';
import {VoteScreen} from '../screens/Vote/VoteScreen';
import {RootStackParamList, Routes} from './Routes';
import {FeedStackNavigator} from './FeedStackNavigator';
import {ProfileStackNavigator} from './ProfileStackNavigator';

type tabBarIconProps = {
  route: RouteProp<RootStackParamList, keyof RootStackParamList>;
  color: string;
  size: number;
};

const tabBarIcon = ({route, color, size}: tabBarIconProps) => {
  let icon: IconDefinition = faHouse;
  //console.log(`Tab: ${route.name}, Focused: ${focused}`);

  if (route.name === Routes.Vote) {
    icon = faHouse;
  } else if (route.name === Routes.Leaderboard) {
    icon = faAward;
  } else if (route.name === Routes.Camera) {
    icon = faCamera;
  } else if (route.name === Routes.FeedStack) {
    icon = faImages;
  } else if (route.name === Routes.ProfileStack) {
    icon = faUser;
  }
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

const Tab = createBottomTabNavigator<RootStackParamList>();

export const BottomTabNavigator = () => {
  const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size}) => tabBarIcon({route, color, size}),
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarButton: tabBarButton,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
        },
        header: () => null,
        headerShown: false,
        tabBarShowLabel: false,
      })}>
      <Tab.Screen name={Routes.Vote} component={VoteScreen} />
      <Tab.Screen name={Routes.Leaderboard} component={LeaderboardScreen} />
      <Tab.Screen
        name={Routes.Camera}
        component={CameraScreen}
        options={{tabBarStyle: {display: 'none'}}}
      />
      <Tab.Screen name={Routes.FeedStack} component={FeedStackNavigator} />
      <Tab.Screen
        name={Routes.ProfileStack}
        component={ProfileStackNavigator}
      />
    </Tab.Navigator>
  );
};
