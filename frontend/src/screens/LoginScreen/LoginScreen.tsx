import React, {useEffect, useState} from 'react';
import {Alert, TouchableOpacity} from 'react-native';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import globalStyle from '../../assets/styles/globalStyle';
// Omat Input-komponentit
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import {ThemedView} from '../../components/ui/themed-view';
import {ThemedText} from '../../components/ui/typography';
import {RootStackParamList, Routes} from '../../navigation/Routes';
import {useLoginMutation} from '../../redux/api/endpoints/auth';
// Omat Button-komponentit
import style from './style';

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

export const LoginScreen = ({navigation}: LoginScreenProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const insets = useSafeAreaInsets();

  const [login, {isLoading, isError}] = useLoginMutation();

  useEffect(() => {
    if (isError) {
      Alert.alert('Wrong credentials');
    }
  }, [isError]);

  const handleLogin = () => {
    login({username, password});
  };

  return (
    <ThemedView style={[globalStyle.flex, {paddingTop: insets.top}]}>
      <ThemedView style={style.container}>
        <ThemedText style={style.title}>Log in</ThemedText>

        <Input
          label="Username"
          placeholder="erkki123"
          value={username}
          onChangeText={setUsername}
          style={style.input}
          autoCapitalize="none"
        />

        <Input
          label="Password"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={style.input}
        />

        <Button
          title={isLoading ? 'Logging in...' : 'Log in'}
          onPress={handleLogin}
          isDisabled={isLoading}
        />

        <TouchableOpacity onPress={() => navigation.navigate(Routes.Register)}>
          <ThemedText style={style.registerLink}>
            Don't have an account? Register here!
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
};
