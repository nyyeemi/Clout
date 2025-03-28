import React from 'react';
import globalStyle from '../../assets/styles/globalStyle';
import {ImageList} from './components/ImageList';
import {ThemedView} from '../../components/ui/themed-view';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ProfileStackParamList} from '../../navigation/Routes';
import {ThemedText} from '../../components/ui/typography';
import {
  useGetPostsQuery,
  useGetUserByIdQuery,
} from '../../redux/slices/apiSlice';
import {Spinner} from '../../components/Spinner/Spinner';

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

  if (isUserLoading) {
    return <Spinner />;
  }

  if (!user || isUserError) {
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
        data={posts}
        user={user}
        isLoadingPosts={isPostsLoading}
        isErrorPosts={isPostsError}
      />
    </ThemedView>
  );
};
