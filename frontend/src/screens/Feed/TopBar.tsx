import React from 'react';
import globalStyle from '../../assets/styles/globalStyle';
import {ThemedView} from '../../components/ui/themed-view';
import {ThemedText} from '../../components/ui/typography';
import {Pressable, StyleSheet} from 'react-native';
import {horizontalScale, verticalScale} from '../../assets/styles/scaling';
import {ProfilePicture} from '../Profile/components/ProfilePicture';
import {CustomUser} from '../Profile/components/ProfileInfoCard';

type Props = {url: string; user: CustomUser; id: number};

export const TopBar = ({url, user, id}: Props): JSX.Element => {
  const handleNavigate = () => {
    console.log('NAVIGATE TO SPECIFIC PROFILE', id);
  };

  return (
    <ThemedView style={[globalStyle.flex]}>
      <Pressable style={style.container} onPress={() => handleNavigate()}>
        <ProfilePicture uri={url} style={style.profileImage} />
        <ThemedText>{user.username}</ThemedText>
      </Pressable>
    </ThemedView>
  );
};

//TODO: Maybe profilepicture should have size prop instead of everytime styling it?
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
