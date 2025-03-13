import React from 'react';
import globalStyle from '../../assets/styles/globalStyle';
import {ThemedView} from '../../components/ui/themed-view';
import {ThemedText} from '../../components/ui/typography';
import {Pressable, StyleSheet} from 'react-native';
import {horizontalScale, verticalScale} from '../../assets/styles/scaling';
import {ProfilePicture} from '../Profile/components/ProfilePicture';
import {CustomUser} from '../Profile/components/ProfileInfoCard';

type Props = {
  url: string;
  user: CustomUser;
  user_id: number;
};

export const TopBar = ({url, user, user_id}: Props): JSX.Element => {
  const handleNavigate = () => {
    console.log('NAVIGATE TO SPECIFIC PROFILE', user_id);
  };

  return (
    <ThemedView style={[globalStyle.flex]}>
      <Pressable style={style.container} onPress={() => handleNavigate()}>
        <ProfilePicture uri={url} style={style.profileImage} />
        <ThemedText variant="heavy">{user.username}</ThemedText>
      </Pressable>
    </ThemedView>
  );
};

//TODO: Maybe profilepicture should have size prop instead of everytime styling it?
//Also should border come from theme?
const style = StyleSheet.create({
  container: {
    height: verticalScale(50),
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  profileImage: {
    width: horizontalScale(45),
    height: horizontalScale(45),
    borderRadius: horizontalScale(45),
    marginHorizontal: horizontalScale(10),
  },
});
