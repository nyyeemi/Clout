import {useTheme} from '@react-navigation/native';
import React, {useCallback, useMemo, useState} from 'react';
import {TextInput, FlatList, StyleSheet, View} from 'react-native';
import {verticalScale} from '../../assets/styles/scaling';
import {UserListItem} from './UserListItem';
import {ThemedText} from '../ui/typography';
import {CustomUser} from '../../types/types';

// todo: add options for size and searchbarvisible
export const UserList = ({
  data,
  onItemPress,
}: {
  data: CustomUser[];
  onItemPress?: () => void;
}): JSX.Element => {
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
    ({item}: {item: CustomUser}) => (
      <UserListItem user={item} onItemPress={onItemPress} />
    ),
    [onItemPress],
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

  console.log('Render user list');

  return (
    <View style={styles.container}>
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
    </View>
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
