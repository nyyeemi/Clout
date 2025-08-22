import React from 'react';
import {Button, Dimensions, View} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {VoteStackParamList} from '../../navigation/Routes';
import {CompetitionInfo} from './CompetitionInfo';

const {height} = Dimensions.get('window');

export const VoteScreen = () => {
  const navigation = useNavigation<StackNavigationProp<VoteStackParamList>>();

  return (
    <View style={[{flex: 1}]}>
      <CompetitionInfo />
      <Button
        title="Vote (vertical)"
        onPress={() => navigation.navigate('Vertical')}
      />
      <Button
        title="Vote (horizontal)"
        onPress={() => navigation.navigate('Horizontal')}
      />
    </View>
  );
};
