import React, {useState} from 'react';
import {View, Text, Alert, SafeAreaView} from 'react-native';
import Input from '../../components/Input/Input'; // Oletan että käytät omaa Input-komponenttia
import Button from '../../components/Button/Button'; // Oletan että käytät omaa Button-komponenttia
import style from './style';
import globalStyle from '../../assets/styles/globalStyle';
import {RootStackParamList, Routes} from '../../navigation/Routes';
import {register} from '../../services/auth/register';
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
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Fill all the fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords must match.');
      return;
    }

    const data = await register(username, email, password);

    if (data) {
      Alert.alert('Success', 'New account created.');
      navigation.navigate(Routes.Login);
    } else {
      Alert.alert('Error with registeration.');
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
