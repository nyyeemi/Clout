import {StyleSheet, TextInput, useWindowDimensions} from 'react-native';
import React, {memo, useCallback, useMemo, useState} from 'react';
import {ThemedView} from '../../components/ui/themed-view';
import {CustomUser} from '../Vote/mock';
import {FlatList} from 'react-native-gesture-handler';
import {verticalScale} from '../../assets/styles/scaling';
import {useTheme} from '@react-navigation/native';
import {TabView, TabBar} from 'react-native-tab-view';
import {UserListItem} from './UserListItem';
import {ThemedText} from '../../components/ui/typography';
import {
  useGetUserFollowersQuery,
  useGetUserFollowingQuery,
} from '../../redux/slices/apiSlice';
import {ProfileStackParamList} from '../../navigation/Routes';
import {StackScreenProps} from '@react-navigation/stack';

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

  const {data: following = []} = useGetUserFollowingQuery(userId);

  const {data: followers = []} = useGetUserFollowersQuery(userId);

  const renderScene = ({
    route,
  }: {
    route: {
      key: string;
      title: string;
    };
  }) => {
    switch (route.key) {
      case 'followers':
        return <FollowersList data={followers} />;
      case 'following':
        return <FollowingList data={following} />;
      default:
        return null;
    }
  };
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

  return (
    <TabView
      navigationState={{index, routes}}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{width: layout.width}}
      renderTabBar={renderTabBar} // Apply custom tab bar
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

/*
const renderScene = SceneMap({
  followers: FollowersList,
  following: FollowingList,
});
*/

export const UserList = ({data}: {data: CustomUser[]}): JSX.Element => {
  const [value, setValue] = useState('');
  const {colors} = useTheme();

  const filteredList = useMemo(() => {
    return value.trim()
      ? data.filter(user =>
          user.username.toLowerCase().includes(value.toLowerCase()),
        )
      : data;
  }, [value, data]);

  const renderItem = useCallback(
    ({item}: {item: CustomUser}) => <UserListItem user={item} />,
    [],
  );

  const renderListHeader = (
    <TextInput
      placeholder="Search"
      inputMode="search"
      autoCapitalize="none"
      clearButtonMode="while-editing"
      style={[
        styles.input,
        {
          backgroundColor: colors.card,
          color: colors.text,
          borderColor: colors.border,
        },
      ]}
      value={value}
      onChangeText={setValue}
    />
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        ListEmptyComponent={
          <ThemedText style={styles.listEmptyText}>No users found</ThemedText>
        }
        ListHeaderComponent={renderListHeader}
        data={filteredList ?? data}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        getItemLayout={(_data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
      />
    </ThemedView>
  );
};

const ITEM_HEIGHT = verticalScale(50);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    //alignItems: 'center',
    //justifyContent: 'center',
    //backgroundColor: 'white',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    color: 'white',
  },
  actionBar: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    gap: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  actionPressable: {
    alignSelf: 'stretch',
    flex: 1,
    paddingBottom: 15,
  },
  actionText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  listEmptyText: {
    fontSize: 17,
    fontWeight: '900',
    color: 'gray',
    paddingHorizontal: 16,
  },
});
