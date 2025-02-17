import React from 'react';
import {SafeAreaView, View} from 'react-native';
import globalStyle from '../../assets/styles/globalStyle';

type UserStatistics = {
  posts: number;
  followers: number;
  following: number;
};

const mockInfo: UserStatistics = {
  posts: 0,
  followers: 100,
  following: 10,
};

interface InfoProps {
  info: UserStatistics;
}

const UserInfoBox = (data: number, header: string): JSX.Element => {
  return (
    <View>
      <View>
        {data}
        {header}
      </View>
    </View>
  );
};

const UserInfoBar = ({info}: {info: UserStatistics}): JSX.Element => {
  return <View>;</View>;
};

export const ProfileScreen = (): JSX.Element => {
  return (
    <SafeAreaView style={[globalStyle.backgroundWhite, globalStyle.flex]}>
      <View>
        ;
        <UserInfoBar info={mockInfo} />
      </View>
    </SafeAreaView>
  );
};
