import React, {useState} from 'react';
import {
  Alert,
  Appearance,
  StyleSheet,
  Switch,
  TextInput,
  TextInputProps,
  View,
  useColorScheme,
} from 'react-native';

import {
  faChevronDown,
  faChevronRight,
  faChevronUp,
  faCircleRight,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {useFormik} from 'formik';
import {ScrollView} from 'react-native-gesture-handler';
import * as Yup from 'yup';

import {OpacityPressable} from '../../components/OpacityPressable/OpacityPressable';
import {ThemedView} from '../../components/ui/themed-view';
import {
  BodyText,
  FootnoteText,
  ThemedIcon,
  Title2Text,
  Title3Text,
} from '../../components/ui/typography';
import {useTheme} from '../../hooks/useTheme';

export const AccountScreen = () => {
  const {colors} = useTheme();
  const scheme = useColorScheme();

  const [showFullDisclaimer, setShowFullDisclaimer] = useState(false);

  const [isEnabled, setIsEnabled] = useState(scheme === 'dark');
  const toggleSwitch = () => {
    scheme === 'dark'
      ? Appearance.setColorScheme('light')
      : Appearance.setColorScheme('dark');
    setIsEnabled(!isEnabled);
  };

  const [submitType, setSubmitType] = useState<'username' | 'password' | null>(
    null,
  );
  const [focusedCard, setFocusedCard] = useState<
    'username' | 'password' | 'delete-account' | null
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
    <ScrollView>
      <ThemedView style={styles.container}>
        <View
          style={[styles.cardContainer, {borderBottomColor: colors.border}]}>
          <OpacityPressable
            onPress={() =>
              focusedCard === 'username'
                ? setFocusedCard(null)
                : setFocusedCard('username')
            }
            style={styles.headerStyle}>
            <Title3Text variant="bold">Change username</Title3Text>
            <ThemedIcon
              icon={focusedCard === 'username' ? faChevronDown : faChevronRight}
              size={20}
            />
          </OpacityPressable>
          {focusedCard === 'username' && (
            <View style={styles.subMenuContainer}>
              <BodyText style={{color: colors.textSecondary}}>
                You can change your username once every 30 days. Must be 3–30
                characters and may include letters, numbers, and underscores
                (_).
              </BodyText>

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
        <View
          style={[styles.cardContainer, {borderBottomColor: colors.border}]}>
          <OpacityPressable
            onPress={() =>
              focusedCard === 'password'
                ? setFocusedCard(null)
                : setFocusedCard('password')
            }
            style={styles.headerStyle}>
            <Title3Text variant="bold">Change Password</Title3Text>
            <ThemedIcon
              icon={focusedCard === 'password' ? faChevronDown : faChevronRight}
              size={20}
            />
          </OpacityPressable>
          {focusedCard === 'password' && (
            <View style={styles.passwordInputs}>
              <InputWithButton
                name="currentPassword"
                value={passwordFormik.values.currentPassword}
                onChangeText={passwordFormik.handleChange('currentPassword')}
                onFocus={() =>
                  passwordFormik.setFieldTouched('currentPassword')
                }
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
                onFocus={() =>
                  passwordFormik.setFieldTouched('confirmPassword')
                }
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

        <OpacityPressable
          onPress={() =>
            focusedCard === 'delete-account'
              ? setFocusedCard(null)
              : setFocusedCard('delete-account')
          }
          style={styles.headerStyle}>
          <Title3Text variant="bold">Delete account</Title3Text>
          <ThemedIcon
            icon={
              focusedCard === 'delete-account' ? faChevronDown : faChevronRight
            }
            size={20}
          />
        </OpacityPressable>
        {focusedCard === 'delete-account' && (
          <View>
            <BodyText style={{color: colors.textSecondary}}>
              Permanently delete your user account and all associated data,
              including your profile, settings, saved content, and interactions.
              This action is irreversible and cannot be undone.
            </BodyText>

            {!showFullDisclaimer ? (
              <OpacityPressable onPress={() => setShowFullDisclaimer(true)}>
                <BodyText style={{color: colors.iosBlue}}>
                  Show more...
                </BodyText>
              </OpacityPressable>
            ) : (
              <View>
                <BodyText />
                <BodyText style={{color: colors.textSecondary}}>
                  Once your account is deleted, you will lose access to all
                  services associated with your account. Your data will no
                  longer be recoverable, and any content you’ve created may be
                  removed or anonymized, in accordance with our data retention
                  and privacy policies.
                </BodyText>
                <BodyText />
                <BodyText style={{color: colors.textSecondary}}>
                  By proceeding, you acknowledge that you understand the
                  consequences of deleting your account and agree to permanently
                  remove your personal data from our systems, except where
                  retention is required for legal or security purposes.
                </BodyText>
                <OpacityPressable onPress={() => setShowFullDisclaimer(false)}>
                  <BodyText style={{color: colors.iosBlue}}>Show less</BodyText>
                </OpacityPressable>
              </View>
            )}
            <OpacityPressable
              onPress={() => console.log('deleter account')}
              style={[
                styles.deleteAccountButton,
                {borderColor: colors.warning, marginVertical: 30},
              ]}>
              <BodyText
                style={[styles.buttonText, {color: colors.warning}]}
                variant="bold">
                Delete Account
              </BodyText>
            </OpacityPressable>
          </View>
        )}
      </ThemedView>
    </ScrollView>
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
  cardContainer: {
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
  deleteAccountButton: {
    paddingVertical: 4,
    borderRadius: 10,
    flex: 1,
    width: '95%',
    alignSelf: 'center',
    borderWidth: StyleSheet.hairlineWidth * 5,
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  subMenuContainer: {
    gap: 15,
  },
});
