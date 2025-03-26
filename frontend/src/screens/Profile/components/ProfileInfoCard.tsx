import React from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {
  horizontalScale,
  scaleFontSize,
  verticalScale,
} from '../../../assets/styles/scaling';
import globalStyle from '../../../assets/styles/globalStyle';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {ProfileStackParamList, Routes} from '../../../navigation/Routes';
import {ProfileStatsRow} from './ProfileStatsRow';
import {ThemedView} from '../../../components/ui/themed-view';
import {ThemedText} from '../../../components/ui/typography';
import {User} from '../../../services/user/users';
import {CustomPressable} from '../CustomPressable';
import {style} from '../style';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store/store';

export const ProfileInfoCard = ({user}: {user: User}): JSX.Element => {
  const loggedInUser = useSelector((state: RootState) => state.user.user);
  const navigation =
    useNavigation<StackNavigationProp<ProfileStackParamList>>();

  return (
    <ThemedView style={styles.container}>
      <ProfileStatsRow user={user} />
      <View style={styles.defaultMargin}>
        <ThemedText style={style.name}>{user.username}</ThemedText>
        <ThemedText>{user.bio}</ThemedText>
      </View>
      <View style={styles.buttonContainer}>
        {loggedInUser?.id === user.id ? (
          <>
            <ActionButton
              text={'Edit Profile'}
              onPress={() => navigation.navigate(Routes.EditProfile)}
            />
            <ActionButton
              text={'Share Profile'}
              onPress={() => console.log('share profile')}
            />
          </>
        ) : (
          <>
            <ActionButton
              text={'Follow'}
              onPress={() => console.log('Clicked follow')}
            />
          </>
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
  return (
    <CustomPressable style={[styles.button, buttonStyle]} onPress={onPress}>
      <ThemedText style={styles.buttonText}>{text}</ThemedText>
    </CustomPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: globalStyle.defaultPadding.paddingHorizontal,
    paddingVertical: 5,
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
