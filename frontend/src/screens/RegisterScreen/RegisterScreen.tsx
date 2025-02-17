import React from 'react';
import {View, Text, SafeAreaView, Alert} from 'react-native';
import {Formik, FormikProps} from 'formik';
import * as Yup from 'yup';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import style from './style';
import globalStyle from '../../assets/styles/globalStyle';
import {RootStackParamList, Routes} from '../../navigation/Routes';
import {registerHandler} from '../../services/auth/handlers/registerHandler';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

type RegisterScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Register'
>;

type FormValues = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const RegisterSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be at most 30 characters')
    .matches(
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers, and underscores',
    )
    .required('Username is required')
    .trim(),
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required')
    .trim(),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .max(64, 'Password must be at most 64 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(
      /[@$!%*?&]/,
      'Password must contain at least one special character (@$!%*?&)',
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
});

const RenderForm = ({
  handleChange,
  handleBlur,
  handleSubmit,
  values,
  errors,
  touched,
  isSubmitting,
}: FormikProps<FormValues>): JSX.Element => (
  <View style={style.container}>
    <Text style={style.title}>Register</Text>

    <View style={style.inputAndErrorContainer}>
      <Input
        label="Username"
        placeholder="erkki123"
        value={values.username}
        onChangeText={handleChange('username')}
        onBlur={handleBlur('username')}
      />
      {touched.username && errors.username && (
        <Text style={style.error}>{errors.username}</Text>
      )}
    </View>

    <View style={style.inputAndErrorContainer}>
      <Input
        label="Email"
        placeholder="Email@gmail.com"
        value={values.email}
        onChangeText={handleChange('email')}
        onBlur={handleBlur('email')}
        keyboardType="email-address"
      />
      {touched.email && errors.email && (
        <Text style={style.error}>{errors.email}</Text>
      )}
    </View>

    <View style={style.inputAndErrorContainer}>
      <Input
        label="Password"
        placeholder="Password"
        value={values.password}
        onChangeText={handleChange('password')}
        onBlur={handleBlur('password')}
        secureTextEntry
      />
      {touched.password && errors.password && (
        <Text style={style.error}>{errors.password}</Text>
      )}
    </View>

    <View style={style.inputAndErrorContainer}>
      <Input
        label="Confirm Password"
        placeholder="Confirm password"
        value={values.confirmPassword}
        onChangeText={handleChange('confirmPassword')}
        onBlur={handleBlur('confirmPassword')}
        secureTextEntry
      />
      {touched.confirmPassword && errors.confirmPassword && (
        <Text style={style.error}>{errors.confirmPassword}</Text>
      )}
    </View>

    <Button
      title={isSubmitting ? 'Registering...' : 'Register'}
      onPress={handleSubmit}
      isDisabled={isSubmitting || Object.keys(errors).length !== 0}
    />
  </View>
);

export const RegisterScreen = ({navigation}: RegisterScreenProps) => {
  return (
    <SafeAreaView style={[globalStyle.backgroundWhite, globalStyle.flex]}>
      <Formik
        initialValues={{
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
        }}
        validationSchema={RegisterSchema}
        onSubmit={async (values, {setSubmitting}) => {
          try {
            const success = await registerHandler(
              values.email,
              values.password,
              values.confirmPassword,
              values.username,
            );
            if (success === 0) {
              navigation.navigate(Routes.Login);
            }
          } catch (error: any) {
            Alert.alert(
              'Registration Failed',
              error.message || 'Something went wrong.',
            );
          } finally {
            setSubmitting(false);
          }
        }}>
        {formikProps => <RenderForm {...formikProps} />}
      </Formik>
    </SafeAreaView>
  );
};
