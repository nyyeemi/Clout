import React, {useCallback} from 'react';
import {useNavigation, useTheme} from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store/store';
import {EditProfileScreen} from '../screens/Profile/EditProfileScreen';
import {FollowersScreen} from '../screens/Profile/FollowersScreen';
import {ProfileFeedScreen} from '../screens/Profile/ProfileFeedScreen';
import {ProfileScreen} from '../screens/Profile/ProfileScreen';
import {SettingsScreen} from '../screens/Settings/SettingsScreen';
import {ProfileStackParamList, Routes} from './Routes';
import {faBars} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {ThemedView} from '../components/ui/themed-view';
import {CustomPressable} from '../screens/Profile/CustomPressable';
import {StyleSheet} from 'react-native';
import globalStyle from '../assets/styles/globalStyle';

const ProfileStack = createStackNavigator<ProfileStackParamList>();

export const ProfileStackNavigator = () => {
  const loggedInUser = useSelector((state: RootState) => state.user.user);
  const theme = useTheme();
  const renderSettingsButton = useCallback(() => <SettingsButton />, []);
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: theme.colors.background},
        headerBackButtonDisplayMode: 'minimal',
      }}>
      <ProfileStack.Screen
        name={Routes.Profile}
        component={ProfileScreen}
        options={({route}) => ({
          headerRight:
            route.params?.userId === loggedInUser?.id
              ? renderSettingsButton
              : undefined,
          headerTitleAlign: 'left',
          title: route.params?.username,
        })}
        initialParams={{
          userId: loggedInUser?.id,
          username: loggedInUser?.username,
        }}
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
        component={ProfileFeedScreen}
        options={{title: 'Posts', animation: 'scale_from_center'}}
      />
    </ProfileStack.Navigator>
  );
};

export const SettingsButton = (): JSX.Element => {
  const navigation =
    useNavigation<StackNavigationProp<ProfileStackParamList>>();
  const {colors} = useTheme();
  const onPress = () => {
    navigation.navigate(Routes.Settings);
  };
  return (
    <ThemedView style={styles.button}>
      <CustomPressable onPress={onPress}>
        <FontAwesomeIcon icon={faBars} size={20} color={colors.text} />
      </CustomPressable>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: globalStyle.defaultPadding.paddingHorizontal,
  },
});
