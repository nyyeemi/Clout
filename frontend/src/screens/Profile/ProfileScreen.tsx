import React from 'react';

import {NativeStackScreenProps} from '@react-navigation/native-stack';

import globalStyle from '../../assets/styles/globalStyle';
import {Spinner} from '../../components/Spinner/Spinner';
import {ThemedView} from '../../components/ui/themed-view';
import {ThemedText} from '../../components/ui/typography';
import {ProfileStackParamList} from '../../navigation/Routes';
import {
  useGetProfileByUserNameQuery,
  useGetProfilePostsByUserNameQuery,
} from '../../redux/api/endpoints/profiles';
import {ImageList} from './components/ImageList';

type ProfileProps = NativeStackScreenProps<ProfileStackParamList, 'Profile'>;

export const ProfileScreen = ({route}: ProfileProps): JSX.Element => {
  const {username} = route.params;

  const {
    data: postData = {data: [], count: 0},
    isLoading: isPostsLoading,
    //isSuccess: isPostsSuccess,
    isError: isPostsError,
    error: postsError,
  } = useGetProfilePostsByUserNameQuery(username);

  const {
    data: profileUser = null,
    isLoading: isUserLoading,
    //isSuccess: isUserSuccess,
    isError: isUserError,
    error: userError,
  } = useGetProfileByUserNameQuery(username);

  if (isUserLoading) {
    return <Spinner />;
  }

  if (!profileUser || isUserError) {
    console.error('Error fetching data:', userError);
    return (
      <ThemedView>
        <ThemedText>Error getting profile</ThemedText>
      </ThemedView>
    );
  }

  if (isPostsError) {
    if (isPostsError) {
      console.error('Error fetching posts:', postsError);
    }
  }

  return (
    <ThemedView style={[globalStyle.flex]}>
      <ImageList
        postData={postData}
        profileUser={profileUser}
        isLoadingPosts={isPostsLoading}
        isErrorPosts={isPostsError}
      />
    </ThemedView>
  );
};
