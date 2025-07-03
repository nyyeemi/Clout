import {useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';

import {faChevronDown, faChevronRight} from '@fortawesome/free-solid-svg-icons';
import {useDispatch} from 'react-redux';

import {OpacityPressable} from '../../../components/OpacityPressable/OpacityPressable';
import {
  BodyText,
  HeadlineText,
  ThemedIcon,
} from '../../../components/ui/typography';
import {useTheme} from '../../../hooks/useTheme';
import {useDeleteAccountMutation} from '../../../redux/api/endpoints/users';
import {logoutAndReset} from '../../../redux/slices/authSlice';
import {AppDispatch} from '../../../redux/store/store';

type DeleteAccountMenuProps = {
  focusedCard: string | null;
  setFocusedCard: React.Dispatch<
    React.SetStateAction<'username' | 'password' | 'delete-account' | null>
  >;
};

export const DeleteAccountMenu = ({
  focusedCard,
  setFocusedCard,
}: DeleteAccountMenuProps) => {
  const [showFullDisclaimer, setShowFullDisclaimer] = useState(false);
  const [deleteAccount] = useDeleteAccountMutation();
  const {colors} = useTheme();
  const dispatch = useDispatch<AppDispatch>();

  const confirmDelete = () => {
    deleteAccount();
    dispatch(logoutAndReset());
  };

  const handleDeleteAccount = () =>
    Alert.alert('Delete', 'This action will delete your account PERMANENTLY.', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'Delete', onPress: () => confirmDelete()},
    ]);

  return (
    <View style={[styles.cardContainer, {borderBottomColor: colors.border}]}>
      <OpacityPressable
        onPress={() =>
          focusedCard === 'delete-account'
            ? setFocusedCard(null)
            : setFocusedCard('delete-account')
        }
        style={styles.headerStyle}>
        <HeadlineText>Delete account</HeadlineText>
        <ThemedIcon
          icon={
            focusedCard === 'delete-account' ? faChevronDown : faChevronRight
          }
          size={15}
          color={colors.border}
        />
      </OpacityPressable>
      {focusedCard === 'delete-account' && (
        <View style={styles.bodyText}>
          <BodyText style={{color: colors.textSecondary}}>
            Permanently delete your user account and all associated data,
            including your profile, settings, saved content, and interactions.
            This action is irreversible and cannot be undone.
          </BodyText>

          {!showFullDisclaimer ? (
            <OpacityPressable onPress={() => setShowFullDisclaimer(true)}>
              <BodyText style={{color: colors.iosBlue}}>Show more...</BodyText>
            </OpacityPressable>
          ) : (
            <View>
              <BodyText />
              <BodyText style={{color: colors.textSecondary}}>
                Once your account is deleted, you will lose access to all
                services associated with your account. Your data will no longer
                be recoverable, and any content you’ve created may be removed or
                anonymized, in accordance with our data retention and privacy
                policies.
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
            onPress={() => handleDeleteAccount()}
            style={[
              styles.deleteAccountButton,
              {borderColor: colors.warning, marginTop: 20},
            ]}>
            <BodyText
              style={[styles.buttonText, {color: colors.warning}]}
              variant="bold">
              Delete Account
            </BodyText>
          </OpacityPressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    gap: 10,
    paddingVertical: 10,
  },
  headerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  deleteAccountButton: {
    paddingVertical: 4,
    borderRadius: 10,
    flex: 1,
    width: '100%',
    alignSelf: 'center',
    borderWidth: StyleSheet.hairlineWidth * 5,
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  bodyText: {
    paddingHorizontal: 10,
  },
});
