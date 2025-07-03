import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';

import {ScrollView} from 'react-native-gesture-handler';

import {ThemedView} from '../../components/ui/themed-view';
import {useTheme} from '../../hooks/useTheme';
import {DeleteAccountMenu} from './components/DeleteAccountMenu';
import {LogoutMenu} from './components/LogoutMenu';
import {PasswordForm} from './components/PasswordForm';
import {UsernameForm} from './components/UsernameForm';

export const AccountScreen = () => {
  const [focusedCard, setFocusedCard] = useState<
    'username' | 'password' | 'delete-account' | null
  >(null);
  const {colors} = useTheme();

  return (
    <ScrollView>
      <View style={styles.upperContainer}>
        <ThemedView style={[styles.container, {backgroundColor: colors.card}]}>
          <UsernameForm
            focusedCard={focusedCard}
            setFocusedCard={setFocusedCard}
          />
          <PasswordForm
            focusedCard={focusedCard}
            setFocusedCard={setFocusedCard}
          />
          <DeleteAccountMenu
            focusedCard={focusedCard}
            setFocusedCard={setFocusedCard}
          />
        </ThemedView>
        <ThemedView style={[styles.container, {backgroundColor: colors.card}]}>
          <LogoutMenu />
        </ThemedView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  upperContainer: {
    flex: 1,
    gap: 30,
    marginHorizontal: 15,
    marginTop: 15,
  },
  container: {
    flexDirection: 'column',
    borderRadius: 10,
  },
});
