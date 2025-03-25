import {StyleSheet, TextInput} from 'react-native';
import React, {useCallback, useMemo, useState} from 'react';
import {ThemedView} from '../../components/ui/themed-view';
import {CustomUser} from '../Vote/mock';
import {mockUserList} from '../Feed/mock';
import {FlatList} from 'react-native-gesture-handler';
import {TopBar} from '../Feed/TopBar';
import {verticalScale} from '../../assets/styles/scaling';
import {useTheme} from '@react-navigation/native';

//type FollowersScreenProps = StackScreenProps<
//  ProfileStackParamList,
//  'Followers'
//>;
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

export const FollowersScreen = (): JSX.Element => {
  const {colors} = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {backgroundColor: colors.background},
        tabBarIndicatorStyle: {backgroundColor: colors.text, height: 2}, // Sliding bottom border
        tabBarLabelStyle: {fontWeight: 'bold', color: colors.text},
      }}>
      <Tab.Screen name="Followers" component={FollowersList} />
      <Tab.Screen name="Following" component={FollowingList} />
    </Tab.Navigator>
  );
};

export const FollowersList = (): JSX.Element => {
  const data = useMemo<CustomUser[]>(() => mockUserList, []);
  //const followingData = mockUserList.concat(mockUserList);

  const [value, setValue] = useState('');
  const {colors} = useTheme();

  //const [activeIndex, setActiveIndex] = useState(0); // default: Followers

  const filteredList = useMemo(() => {
    return value.trim()
      ? data.filter(user =>
          user.username.toLowerCase().includes(value.toLowerCase()),
        )
      : data;
  }, [value, data]);

  const renderItem = useCallback(
    ({item}: {item: CustomUser}) => (
      <TopBar url={item.profile_picture_url} user={item} />
    ),
    [],
  );
  return (
    <ThemedView style={styles.container}>
      <TextInput
        placeholder={'Search'}
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            color: colors.text,
            borderColor: colors.border,
          },
        ]}
        value={value}
        onChangeText={text => setValue(text)}
      />
      <FlatList
        data={filteredList ?? data}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        getItemLayout={(data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
      />
    </ThemedView>
  );
};

export const FollowingList = (): JSX.Element => {
  //const data = useMemo<CustomUser[]>(() => mockUserList, []);
  const data = mockUserList.concat(mockUserList);

  const [value, setValue] = useState('');
  const {colors} = useTheme();

  //const [activeIndex, setActiveIndex] = useState(0); // default: Followers

  const filteredList = useMemo(() => {
    return value.trim()
      ? data.filter(user =>
          user.username.toLowerCase().includes(value.toLowerCase()),
        )
      : data;
  }, [value, data]);

  const renderItem = useCallback(
    ({item}: {item: CustomUser}) => (
      <TopBar url={item.profile_picture_url} user={item} />
    ),
    [],
  );
  return (
    <ThemedView style={styles.container}>
      <TextInput
        placeholder={'Search'}
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            color: colors.text,
            borderColor: colors.border,
          },
        ]}
        value={value}
        onChangeText={text => setValue(text)}
      />
      <FlatList
        data={filteredList ?? data}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        getItemLayout={(data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
      />
    </ThemedView>
  );
};
/*

type TabButtonProps = {
  borderColor: string;
  isActive: boolean;
  content: string;
  onPress: () => void;
};


      <View style={[styles.actionBar, {borderBottomColor: colors.border}]}>
        <TabButton
          borderColor={colors.border}
          isActive={activeIndex === 0}
          content={'Followers'}
          onPress={() => setActiveIndex(0)}
        />
        <TabButton
          borderColor={colors.border}
          isActive={activeIndex === 1}
          content={'Following'}
          onPress={() => setActiveIndex(1)}
        />
      </View>


const TabButton = ({
  borderColor,
  isActive,
  content,
  onPress,
}: TabButtonProps): JSX.Element => {
  const activeStyle = {
    borderBottomColor: isActive ? borderColor : 'transparent',
    borderBottomWidth: isActive ? 2 : 0,
  };
  return (
    <CustomPressable
      onPress={onPress}
      style={[activeStyle, styles.actionPressable]}>
      <ThemedText style={styles.actionText}>{content}</ThemedText>
    </CustomPressable>
  );
};
 */

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
