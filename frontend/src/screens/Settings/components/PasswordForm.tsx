import {Alert, StyleSheet, View} from 'react-native';

import {faChevronDown, faChevronRight} from '@fortawesome/free-solid-svg-icons';
import {useFormik} from 'formik';
import * as Yup from 'yup';

import {InputWithButton} from '../../../components/InputWithButton';
import {OpacityPressable} from '../../../components/OpacityPressable/OpacityPressable';
import {
  FootnoteText,
  HeadlineText,
  ThemedIcon,
} from '../../../components/ui/typography';
import {useTheme} from '../../../hooks/useTheme';

type PasswordFormProps = {
  focusedCard: string | null;
  setFocusedCard: React.Dispatch<
    React.SetStateAction<'username' | 'password' | 'delete-account' | null>
  >;
};

export const PasswordForm = ({
  focusedCard,
  setFocusedCard,
}: PasswordFormProps) => {
  //const [updatePassword] = useUpdatePasswordMutation();
  const {colors} = useTheme();

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
          onPress: () => console.log(),
          //updatePassword(values.currentPassword, values.newPassword),
        },
      ]);
    },
  });
  return (
    <View style={[styles.cardContainer, {borderBottomColor: colors.border}]}>
      <OpacityPressable
        onPress={() =>
          focusedCard === 'password'
            ? setFocusedCard(null)
            : setFocusedCard('password')
        }
        style={styles.headerStyle}>
        <HeadlineText>Change Password</HeadlineText>
        <ThemedIcon
          icon={focusedCard === 'password' ? faChevronDown : faChevronRight}
          size={15}
          color={colors.border}
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
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  passwordInputs: {
    gap: 10,
    paddingHorizontal: 10,
  },
  headerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
});
