import React from 'react';
import globalStyle from '../../assets/styles/globalStyle';
import {ImageList} from './components/ImageList';
import {ThemedView} from '../../components/ui/themed-view';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ProfileStackParamList} from '../../navigation/Routes';
import {ThemedText} from '../../components/ui/typography';
import {ActivityIndicator, StyleSheet} from 'react-native';
import {
  useGetPostsQuery,
  useGetUserByIdQuery,
} from '../../redux/slices/apiSlice';

type ProfileProps = NativeStackScreenProps<ProfileStackParamList, 'Profile'>;

export const ProfileScreen = ({route}: ProfileProps): JSX.Element => {
  const {userId} = route.params;
  console.log('renders profilescreen');

  const {
    data: posts = [],
    isLoading: isPostsLoading,
    //isSuccess: isPostsSuccess,
    isError: isPostsError,
    error: postsError,
  } = useGetPostsQuery(userId);

  const {
    data: user = null,
    isLoading: isUserLoading,
    //isSuccess: isUserSuccess,
    isError: isUserError,
    error: userError,
  } = useGetUserByIdQuery(userId);

  if (isPostsLoading || isUserLoading) {
    return (
      <ActivityIndicator
        style={styles.activityIndicator}
        size="large"
        color="tomato"
      />
    );
  }

  if (isPostsError || isUserError) {
    console.error(
      'Error fetching data:',
      isPostsError ? postsError : userError,
    );
  }

  if (!user) {
    return (
      <ThemedView>
        <ThemedText>Error getting profile</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[globalStyle.flex]}>
      <ImageList data={posts} user={user} />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
  },
});
