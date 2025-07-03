import React from 'react';
import {Alert, StyleSheet, View} from 'react-native';

import {faChevronDown, faChevronRight} from '@fortawesome/free-solid-svg-icons';
import {useFormik} from 'formik';
import * as Yup from 'yup';

import {InputWithButton} from '../../../components/InputWithButton';
import {OpacityPressable} from '../../../components/OpacityPressable/OpacityPressable';
import {
  BodyText,
  FootnoteText,
  HeadlineText,
  ThemedIcon,
} from '../../../components/ui/typography';
import {useTheme} from '../../../hooks/useTheme';
import {useUpdateUserMeMutation} from '../../../redux/api/endpoints/users';

type UsernameFormProps = {
  focusedCard: string | null;
  setFocusedCard: React.Dispatch<
    React.SetStateAction<'username' | 'password' | 'delete-account' | null>
  >;
};

export const UsernameForm = ({
  focusedCard,
  setFocusedCard,
}: UsernameFormProps) => {
  const {colors} = useTheme();
  const [updateUsername, {isLoading, isError}] = useUpdateUserMeMutation();

  const UsernameSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username must be at most 30 characters')
      .matches(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, underscores allowed')
      .required('Username is required')
      .trim(),
  });

  const usernameFormik = useFormik({
    initialValues: {username: ''},
    validationSchema: UsernameSchema,
    onSubmit: values => {
      Alert.alert('Change username', 'You can only change once in 30 days.', [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Continue',
          onPress: async () => {
            await updateUsername({
              username: values.username,
            });
          },
        },
      ]);
    },
  });

  return (
    <View style={[styles.cardContainer, {borderBottomColor: colors.border}]}>
      <OpacityPressable
        onPress={() =>
          focusedCard === 'username'
            ? setFocusedCard(null)
            : setFocusedCard('username')
        }
        style={styles.headerStyle}>
        <HeadlineText>Change username</HeadlineText>
        <ThemedIcon
          icon={focusedCard === 'username' ? faChevronDown : faChevronRight}
          size={15}
          color={colors.border}
        />
      </OpacityPressable>
      {focusedCard === 'username' && (
        <View style={styles.subMenuContainer}>
          <BodyText style={{color: colors.textSecondary}}>
            You can change your username once every 30 days. Must be 3–30
            characters and may include letters, numbers, and underscores (_).
          </BodyText>

          <InputWithButton
            name="username"
            value={usernameFormik.values.username}
            onChangeText={usernameFormik.handleChange('username')}
            onFocus={() => usernameFormik.setFieldTouched('username')}
            handleSubmit={usernameFormik.handleSubmit}
            placeholder="username"
            disableButton={!!usernameFormik.errors.username || isLoading}
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
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  subMenuContainer: {
    gap: 15,
    paddingHorizontal: 10,
  },
});
