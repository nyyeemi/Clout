import {StyleSheet, View} from 'react-native';

import {ThemedSafeAreaView} from '../../components/ui/themed-view';

export const CompetitionInfo = () => {
  return (
    <ThemedSafeAreaView style={styles.container}>
      <View style={styles.upperBox}></View>
      <View style={styles.infoBox}></View>
      <View style={styles.statsBox}></View>
    </ThemedSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {gap: 15},
  upperBox: {
    backgroundColor: 'tomato',
    height: 50,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  infoBox: {
    backgroundColor: 'tomato',
    height: 150,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  statsBox: {
    backgroundColor: 'tomato',
    height: 300,
    marginHorizontal: 5,
    borderRadius: 5,
  },
});
