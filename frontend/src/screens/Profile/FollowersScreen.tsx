import React, {memo, useCallback, useState} from 'react';
import {StyleSheet, View, useWindowDimensions} from 'react-native';

import {useTheme} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {TabBar, TabView} from 'react-native-tab-view';

import {Spinner} from '../../components/Spinner/Spinner';
import {UserList} from '../../components/UserList/UserList';
import {ThemedText} from '../../components/ui/typography';
import {ProfileStackParamList} from '../../navigation/Routes';
import {
  useGetProfileFollowersQuery,
  useGetProfileFollowingQuery,
} from '../../redux/api/endpoints/profiles';

import {ProfileFollowerType} from '../../types/types';

type FollowersScreenProps = StackScreenProps<
  ProfileStackParamList,
  'Followers'
>;

const routes = [
  {key: 'following', title: 'Following'},
  {key: 'followers', title: 'Followers'},
];

export const FollowersScreen = ({
  route: mainRoute,
}: FollowersScreenProps): JSX.Element => {
  const {index: initialIndex, username} = mainRoute.params;
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(initialIndex);
  const {colors} = useTheme();

  const {
    data: following = {data: [], count: 0},
    isLoading: isLoadingFollowing,
    isError: isErrorFollowing,
  } = useGetProfileFollowingQuery(username);

  const {
    data: followers = {data: [], count: 0},
    isLoading: isLoadingFollowers,
    isError: isErrorFollowers,
  } = useGetProfileFollowersQuery(username);

  const renderScene = useCallback(
    ({route}: {route: {key: string}}) => {
      switch (route.key) {
        case 'following':
          return (
            <FollowingList
              data={following.data}
              username={username}
              isLoading={isLoadingFollowing}
            />
          );
        case 'followers':
          return (
            <FollowersList
              data={followers.data}
              username={username}
              isLoading={isLoadingFollowers}
            />
          );
        default:
          return null;
      }
    },
    [
      followers.data,
      following.data,
      isLoadingFollowers,
      isLoadingFollowing,
      username,
    ],
  );

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{backgroundColor: colors.primary}}
      style={{
        backgroundColor: colors.background,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.border,
      }}
      activeColor={colors.text}
      inactiveColor={'gray'}
      android_ripple={{radius: 0}}
    />
  );

  if (isLoadingFollowers || isLoadingFollowing) {
    return <Spinner />;
  }

  if (isErrorFollowers || isErrorFollowing) {
    return (
      <View style={styles.centered}>
        <ThemedText style={{color: colors.notification}}>
          Failed to load data. Please try again later.
        </ThemedText>
      </View>
    );
  }

  return (
    <TabView
      navigationState={{index, routes}}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{width: layout.width}}
      renderTabBar={renderTabBar}
    />
  );
};

type FollowListProps = {
  data: ProfileFollowerType[];
  username: string;
  isLoading: boolean;
};

export const FollowingList = memo(
  ({data, username, isLoading}: FollowListProps): JSX.Element => {
    return (
      <UserList
        data={data}
        currentProfileUserName={username}
        isFetchingData={isLoading}
      />
    );
  },
);

export const FollowersList = memo(
  ({data, username, isLoading}: FollowListProps): JSX.Element => {
    return (
      <UserList
        data={data}
        currentProfileUserName={username}
        isFetchingData={isLoading}
      />
    );
  },
);

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
