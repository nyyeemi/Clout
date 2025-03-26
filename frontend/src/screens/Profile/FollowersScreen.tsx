import {StyleSheet, TextInput, useWindowDimensions} from 'react-native';
import React, {useCallback, useMemo, useState} from 'react';
import {ThemedView} from '../../components/ui/themed-view';
import {CustomUser} from '../Vote/mock';
import {mockUserList} from '../Feed/mock';
import {FlatList} from 'react-native-gesture-handler';
import {verticalScale} from '../../assets/styles/scaling';
import {useTheme} from '@react-navigation/native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {UserListItem} from './UserListItem';

export const FollowersScreen = (): JSX.Element => {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const {colors} = useTheme();

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

export const FollowingList = (): JSX.Element => {
  const data = mockUserList.slice(0, 5);
  return <UserList data={data} />;
};

export const FollowersList = (): JSX.Element => {
  const data = mockUserList;
  return <UserList data={data} />;
};

const renderScene = SceneMap({
  followers: FollowersList,
  following: FollowingList,
});

const routes = [
  {key: 'followers', title: 'Followers'},
  {key: 'following', title: 'Following'},
];

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

  const renderListHeader = useMemo(
    () => (
      <TextInput
        placeholder="Search"
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
    ),
    [value, colors],
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
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
});
