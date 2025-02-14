import React, {useState} from 'react';
import {View, Text, SafeAreaView} from 'react-native';
import Input from '../../components/Input/Input'; // Oletan että käytät omaa Input-komponenttia
import Button from '../../components/Button/Button'; // Oletan että käytät omaa Button-komponenttia
import style from './style';
import globalStyle from '../../assets/styles/globalStyle';
import {RootStackParamList, Routes} from '../../navigation/Routes';
import {registerHandler} from '../../services/auth/handlers/registerHandler';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

type RegisterScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Register'
>;

export const RegisterScreen = ({navigation}: RegisterScreenProps) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    const success = await registerHandler(
      email,
      password,
      confirmPassword,
      username,
    );
    if (success === 0) {
      navigation.navigate(Routes.Login);
    }
  };

  return (
    <SafeAreaView style={[globalStyle.backgroundWhite, globalStyle.flex]}>
      <View style={style.container}>
        <Text style={style.title}>Register</Text>

        <Input
          label="Username"
          placeholder="erkki123"
          value={username}
          onChangeText={setUsername}
          style={style.input}
        />
        <Input
          label="Email"
          placeholder="Email@gmail.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
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
        <Input
          label="Confirm password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={style.input}
        />

        <Button title="Register" onPress={handleRegister} />
      </View>
    </SafeAreaView>
  );
};
