import {StyleSheet, useWindowDimensions, View} from 'react-native';
import React, {memo, useCallback} from 'react';
import {CustomUser} from '../../types/types';
import {useTheme} from '@react-navigation/native';
import {TabView, TabBar} from 'react-native-tab-view';
import {ProfileStackParamList} from '../../navigation/Routes';
import {StackScreenProps} from '@react-navigation/stack';
import {UserList} from '../../components/UserList/UserList';
import {ThemedText} from '../../components/ui/typography';
import {Spinner} from '../../components/Spinner/Spinner';
import {
  useGetUserFollowersQuery,
  useGetUserFollowingQuery,
} from '../../redux/slices/mockApiSlice';

type FollowersScreenProps = StackScreenProps<
  ProfileStackParamList,
  'Followers'
>;

const routes = [
  {key: 'followers', title: 'Followers'},
  {key: 'following', title: 'Following'},
];

export const FollowersScreen = ({
  route: mainRoute,
}: FollowersScreenProps): JSX.Element => {
  const {userId} = mainRoute.params;
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const {colors} = useTheme();

  const {
    data: following = [],
    isLoading: isLoadingFollowing,
    isError: isErrorFollowing,
  } = useGetUserFollowingQuery(userId);

  const {
    data: followers = [],
    isLoading: isLoadingFollowers,
    isError: isErrorFollowers,
  } = useGetUserFollowersQuery(userId);

  const renderScene = useCallback(
    ({route}: {route: {key: string}}) => {
      switch (route.key) {
        case 'followers':
          return <FollowersList data={followers} />;
        case 'following':
          return <FollowingList data={following} />;
        default:
          return null;
      }
    },
    [followers, following],
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

export const FollowingList = memo(
  ({data}: {data: CustomUser[]}): JSX.Element => {
    return <UserList data={data} />;
  },
);

export const FollowersList = memo(
  ({data}: {data: CustomUser[]}): JSX.Element => {
    return <UserList data={data} />;
  },
);

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
