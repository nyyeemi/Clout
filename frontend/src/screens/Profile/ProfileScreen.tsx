import React, {useCallback, useEffect, useState} from 'react';
import globalStyle from '../../assets/styles/globalStyle';
import {ImageList} from './components/ImageList';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ProfileHeader, SettingsButton} from './components/ProfileHeader';
import {ThemedView} from '../../components/ui/themed-view';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ProfileStackParamList} from '../../navigation/Routes';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store/store';
import {getImagesByUser, getUserById, User} from '../../services/user/users';
import {ThemedText} from '../../components/ui/typography';
import {ActivityIndicator, StyleSheet} from 'react-native';
import {CustomImage} from '../../services/image/images';

type ProfileProps = NativeStackScreenProps<ProfileStackParamList, 'Profile'>;

export const ProfileScreen = ({
  route,
  navigation,
}: ProfileProps): JSX.Element => {
  //useEffect --> get image data, user,
  const {userId} = route.params;
  const loggedInUser = useSelector((state: RootState) => state.user.user);
  const [userToRender, setUserToRender] = useState<User | null>(null);
  const [imageData, setImageData] = useState<CustomImage[]>([]);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();

  //const renderSettingsButton = useCallback(({navigation}) => <SettingsButton />, []);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const images = await getImagesByUser(userId);
        setImageData(images);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    if (userId === loggedInUser?.id) {
      setUserToRender(loggedInUser);
      fetchImages();
      setLoading(false);
    } else if (userId) {
      const fetchUserData = async () => {
        try {
          const user = await getUserById(userId);
          setUserToRender(user);
          fetchImages();
        } catch (error) {
          console.error('Error fetching user:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    }
  }, [userId, loggedInUser, imageData]);

  if (loading) {
    return (
      <ActivityIndicator
        style={styles.activityIndicator}
        size="large"
        color="tomato"
      />
    );
  }

  if (!userToRender) {
    return (
      <ThemedView>
        <ThemedText>Error getting profile</ThemedText>
      </ThemedView>
    );
  }
  if (userToRender === loggedInUser) {
    navigation.setOptions({headerRight: () => <SettingsButton />});
  }
  navigation.setOptions({title: userToRender.username});
  return (
    <ThemedView style={[globalStyle.flex, {paddingTop: insets.top}]}>
      <ImageList data={imageData} user={userToRender} />
    </ThemedView>
  );
};
//<ProfileHeader user={userToRender} />
const styles = StyleSheet.create({
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
  },
});
