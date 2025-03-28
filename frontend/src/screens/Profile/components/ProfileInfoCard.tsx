import React from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {
  horizontalScale,
  scaleFontSize,
  verticalScale,
} from '../../../assets/styles/scaling';
import globalStyle from '../../../assets/styles/globalStyle';
import {useTheme} from '@react-navigation/native';
import {ProfileStatsRow} from './ProfileStatsRow';
import {ThemedView} from '../../../components/ui/themed-view';
import {ThemedText} from '../../../components/ui/typography';
import {OpacityPressable} from '../../../components/OpacityPressable/OpacityPressable';
import {style} from '../style';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store/store';
import {CustomUser} from '../../Vote/mock';

export const ProfileInfoCard = ({user}: {user: CustomUser}): JSX.Element => {
  const loggedInUser = useSelector((state: RootState) => state.user.user);

  return (
    <ThemedView style={styles.container}>
      <ProfileStatsRow user={user} />
      <View style={styles.defaultMargin}>
        <ThemedText style={style.name}>{user.username}</ThemedText>
        <ThemedText>{user.bio}</ThemedText>
      </View>
      <View style={styles.buttonContainer}>
        {loggedInUser?.id !== user.id && (
          <ActionButton
            text={'Follow'}
            onPress={() => console.log('Clicked follow')}
          />
        )}
      </View>
    </ThemedView>
  );
};

type ActionButtonProps = {
  text: string;
  onPress: () => void;
  buttonStyle?: StyleProp<ViewStyle>;
};

export const ActionButton = ({
  text,
  onPress,
  buttonStyle,
}: ActionButtonProps): JSX.Element => {
  const theme = useTheme();
  return (
    <OpacityPressable
      style={[styles.button, {borderColor: theme.colors.text}, buttonStyle]}
      onPress={onPress}>
      <ThemedText style={styles.buttonText}>{text}</ThemedText>
    </OpacityPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: globalStyle.defaultPadding.paddingHorizontal,
    paddingVertical: 5,
    borderBottomEndRadius: 10,
  },
  button: {
    paddingVertical: horizontalScale(3),
    flex: 1,
    borderRadius: 6,
    alignSelf: 'stretch',
    borderWidth: StyleSheet.hairlineWidth * 5,
  },
  followButton: {
    backgroundColor: 'tomato',
    borderWidth: 0,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: scaleFontSize(15),
    fontWeight: 'bold',
  },
  buttonContainer: {
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    gap: 5,
    borderBottomColor: '#dedede',
    //borderBottomWidth: StyleSheet.hairlineWidth,
  },
  defaultMargin: {
    marginVertical: verticalScale(10),
  },
});
