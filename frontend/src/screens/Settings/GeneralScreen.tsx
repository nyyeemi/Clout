import React, {useState} from 'react';
import {Alert, StyleSheet, TextInput, TextInputProps, View} from 'react-native';

import {
  faChevronDown,
  faChevronUp,
  faCircleRight,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {useFormik} from 'formik';
import * as Yup from 'yup';

import {OpacityPressable} from '../../components/OpacityPressable/OpacityPressable';
import {ThemedView} from '../../components/ui/themed-view';
import {
  BodyText,
  FootnoteText,
  ThemedIcon,
  Title2Text,
} from '../../components/ui/typography';
import {useTheme} from '../../hooks/useTheme';

export const GeneralScreen = () => {
  const {colors} = useTheme();
  const [submitType, setSubmitType] = useState<'username' | 'password' | null>(
    null,
  );
  const [focusedCard, setFocusedCard] = useState<
    'username' | 'password' | null
  >(null);

  console.log('submittypeee', submitType);

  const UsernameSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username must be at most 30 characters')
      .matches(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, underscores allowed')
      .required('Username is required')
      .trim(),
  });

  const PasswordSchema = Yup.object().shape({
    currentPassword: Yup.string().required('Current password is required'),
    newPassword: Yup.string()
      .min(8, 'Min 8 characters')
      .max(64, 'Max 64 characters')
      .matches(/[a-z]/, 'At least one lowercase')
      .matches(/[A-Z]/, 'At least one uppercase')
      .matches(/[0-9]/, 'At least one number')
      .matches(/[@$!%*?&]/, 'At least one special char (@$!%*?&)'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword')], 'Passwords must match')
      .required('Confirm new password'),
  });

  const usernameFormik = useFormik({
    initialValues: {username: ''},
    validationSchema: UsernameSchema,
    onSubmit: values => {
      Alert.alert('Change username', 'You can only change once in 30 days.', [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Continue',
          onPress: () => console.log('Username changed to:', values.username),
        },
      ]);
    },
  });

  const passwordFormik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: PasswordSchema,
    onSubmit: values => {
      Alert.alert('Change password', 'Are you sure?', [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Confirm',
          onPress: () =>
            console.log('Change password:', {
              current: values.currentPassword,
              new: values.newPassword,
            }),
        },
      ]);
    },
  });

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.usernameCard, {borderBottomColor: colors.border}]}>
        <OpacityPressable
          onPress={() =>
            focusedCard === 'username'
              ? setFocusedCard(null)
              : setFocusedCard('username')
          }
          style={styles.headerStyle}>
          <Title2Text variant="bold">Change username</Title2Text>
          <ThemedIcon
            icon={focusedCard === 'username' ? faChevronUp : faChevronDown}
            size={20}
          />
        </OpacityPressable>
        {focusedCard === 'username' && (
          <View>
            <FootnoteText style={{color: colors.border}}>
              You can change your username once in 30 days.
            </FootnoteText>

            <InputWithButton
              name="username"
              value={usernameFormik.values.username}
              onChangeText={usernameFormik.handleChange('username')}
              onFocus={() => usernameFormik.setFieldTouched('username')}
              handleSubmit={usernameFormik.handleSubmit}
              placeholder="username"
              disableButton={!!usernameFormik.errors.username}
            />
            {usernameFormik.touched.username &&
              usernameFormik.errors.username && (
                <FootnoteText style={{color: colors.border}}>
                  {usernameFormik.errors.username}
                </FootnoteText>
              )}
          </View>
        )}
      </View>
      <View style={[styles.passwordCard, {borderBottomColor: colors.border}]}>
        <OpacityPressable
          onPress={() =>
            focusedCard === 'password'
              ? setFocusedCard(null)
              : setFocusedCard('password')
          }
          style={styles.headerStyle}>
          <Title2Text variant="bold">Change Password</Title2Text>
          <ThemedIcon
            icon={focusedCard === 'password' ? faChevronUp : faChevronDown}
            size={20}
          />
        </OpacityPressable>
        {focusedCard === 'password' && (
          <View style={styles.passwordInputs}>
            <InputWithButton
              name="currentPassword"
              value={passwordFormik.values.currentPassword}
              onChangeText={passwordFormik.handleChange('currentPassword')}
              onFocus={() => passwordFormik.setFieldTouched('currentPassword')}
              placeholder="current password"
              secureTextEntry
              showButton={false}
            />
            {passwordFormik.touched.currentPassword &&
              passwordFormik.errors.currentPassword && (
                <FootnoteText style={{color: colors.border}}>
                  {passwordFormik.errors.currentPassword}
                </FootnoteText>
              )}
            <InputWithButton
              name="newPassword"
              value={passwordFormik.values.newPassword}
              onChangeText={passwordFormik.handleChange('newPassword')}
              onFocus={() => passwordFormik.setFieldTouched('newPassword')}
              placeholder="new password"
              secureTextEntry
              showButton={false}
            />
            {passwordFormik.touched.newPassword &&
              passwordFormik.errors.newPassword && (
                <FootnoteText style={{color: colors.border}}>
                  {passwordFormik.errors.newPassword}
                </FootnoteText>
              )}
            <InputWithButton
              name="confirmPassword"
              value={passwordFormik.values.confirmPassword}
              onChangeText={passwordFormik.handleChange('confirmPassword')}
              onFocus={() => passwordFormik.setFieldTouched('confirmPassword')}
              handleSubmit={passwordFormik.handleSubmit}
              placeholder="new password again"
              secureTextEntry
            />
            {passwordFormik.touched.confirmPassword &&
              passwordFormik.errors.confirmPassword && (
                <FootnoteText style={{color: colors.border}}>
                  {passwordFormik.errors.confirmPassword}
                </FootnoteText>
              )}
          </View>
        )}
      </View>
    </ThemedView>
  );
};

type InputCardProps = {
  handleSubmit?: () => void;
  showButton?: boolean;
  name: string;
  value: string;
  onChangeText: (text: string) => void;
  disableButton?: boolean;
} & TextInputProps;

const InputWithButton = ({
  handleSubmit,
  showButton = true,
  value,
  onChangeText,
  disableButton,
  ...props
}: InputCardProps) => {
  const {colors} = useTheme();

  return (
    <View
      style={[
        styles.inputAndButton,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}>
      <TextInput
        inputMode="text"
        autoCapitalize="none"
        clearButtonMode="while-editing"
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            color: colors.text,
          },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={colors.border}
        maxLength={25}
        {...props}
      />
      {showButton && handleSubmit && (
        <OpacityPressable onPress={handleSubmit} disabled={disableButton}>
          <FontAwesomeIcon
            icon={faCircleRight}
            color={colors.primary}
            size={20}
          />
        </OpacityPressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    gap: 20,
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  input: {
    flex: 1,
  },
  inputAndButton: {
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    height: 40,
    borderRadius: 10,
    padding: 10,
  },
  usernameCard: {
    gap: 10,
    paddingBottom: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  passwordCard: {
    gap: 10,
    paddingBottom: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  passwordInputs: {
    gap: 10,
  },
  headerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 10,
  },
});
