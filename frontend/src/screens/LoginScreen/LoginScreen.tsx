import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {useDispatch} from 'react-redux';
import Input from '../../components/Input/Input'; // Omat Input-komponentit
import Button from '../../components/Button/Button'; // Omat Button-komponentit
import style from './style';
import globalStyle from '../../assets/styles/globalStyle';
import {RootStackParamList, Routes} from '../../navigation/Routes';
import {loginHandler} from '../../services/auth/handlers/loginHandler';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ThemedView} from '../../components/ui/themed-view';
import {ThemedText} from '../../components/ui/typography';

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

export const LoginScreen = ({navigation}: LoginScreenProps): JSX.Element => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const handleLogin = async () => {
    await loginHandler(username, password, dispatch, setLoading);
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
          title={loading ? 'Logging in...' : 'Log in'}
          onPress={handleLogin}
          isDisabled={loading}
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
