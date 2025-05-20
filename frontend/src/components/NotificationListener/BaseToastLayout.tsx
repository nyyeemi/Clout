import React from 'react';
import {StyleSheet, View} from 'react-native';

import {useTheme} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {ThemedView} from '../ui/themed-view';
import {ThemedText} from '../ui/typography';

type Props = {
  text1: string;
  barColor: string;
  emoji: string;
};

export const BaseToastLayout = ({text1, barColor, emoji}: Props) => {
  const {colors} = useTheme();
  return (
    <ThemedView style={[styles.container, {backgroundColor: colors.card}]}>
      <View style={[styles.sideBar, {backgroundColor: barColor}]} />
      <View style={styles.iconContainer}>
        <ThemedText style={styles.iconText}>{emoji}</ThemedText>
      </View>
      <ThemedText variant="heavy" style={[styles.text, {color: colors.text}]}>
        {text1}
      </ThemedText>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 60,
    width: '95%',
    marginHorizontal: '2.5%',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    //shadowColor: '#FFF',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 6,
    elevation: 3,
  },
  sideBar: {
    width: 4,
    height: '100%',
    borderRadius: 4,
    marginRight: 12,
    alignSelf: 'flex-start',
  },
  iconContainer: {
    marginRight: 8,
  },
  iconText: {
    fontSize: 17,
  },
  text: {
    fontSize: 15,
    flexShrink: 1,
  },
});
