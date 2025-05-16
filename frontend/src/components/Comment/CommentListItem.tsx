import React, {useState} from 'react';
import {Alert, Pressable, StyleSheet, View} from 'react-native';
import type {NativeSyntheticEvent} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import ContextMenu from 'react-native-context-menu-view';
import type {ContextMenuOnPressNativeEvent} from 'react-native-context-menu-view';

import {RootStackParamList, Routes} from '../../navigation/Routes';
import {useDeleteCommentMutation} from '../../redux/api/endpoints/posts';
import {useGetUsersMeQuery} from '../../redux/api/endpoints/users';
import {OpacityPressable} from '../OpacityPressable/OpacityPressable';
import {ProfilePicture} from '../ProfilePicture/ProfilePicture';
import {ThemedText} from '../ui/typography';

import {CommentType} from '../../types/types';

type CommentListItemProps = {
  comment: CommentType;
  size?: 'small' | 'medium' | 'large';
  onItemPress?: () => void;
};

export const CommentListItem = ({
  comment,
  size = 'small',
  onItemPress,
}: CommentListItemProps) => {
  const [expanded, setExpanded] = useState(false);
  const {data: loggedInUser} = useGetUsersMeQuery();
  const [deleteComment] = useDeleteCommentMutation();

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const user = comment.owner;

  const handlePress = () => {
    onItemPress?.();
    navigation.navigate(Routes.ProfileStack, {
      screen: Routes.Profile,
      params: {
        userId: comment.owner_id,
        username: user?.username ?? '',
      },
    });
  };

  const handleMenuPress = (actionName: string) => {
    const isOwner = user.id === loggedInUser?.id;

    switch (actionName) {
      case 'Edit comment':
        if (!isOwner) {
          return;
        }
        console.log('Edited');
        break;

      case 'Delete comment':
        if (!isOwner) {
          Alert.alert("You don't have the right's.");
        }
        deleteComment({post_id: comment.post_id, comment_id: comment.id});
        break;

      case 'Report comment':
        console.log('Report');
        break;

      default:
        break;
    }
  };

  return (
    <ContextMenu
      actions={[
        {title: 'Edit comment'},
        {title: 'Delete comment', destructive: true},
        {title: 'Report comment'},
      ]}
      onPress={(event: NativeSyntheticEvent<ContextMenuOnPressNativeEvent>) =>
        handleMenuPress(event.nativeEvent.name)
      }>
      <Pressable style={styles.container}>
        <OpacityPressable onPress={handlePress}>
          <ProfilePicture uri={user?.profile_picture_url ?? ''} size={size} />
        </OpacityPressable>
        <View style={styles.textContainer}>
          <OpacityPressable onPress={handlePress}>
            <ThemedText style={styles.username}>{user?.username}</ThemedText>
          </OpacityPressable>
          <Pressable onPress={() => !expanded && setExpanded(true)}>
            <ThemedText numberOfLines={expanded ? undefined : 2}>
              {comment.content}
            </ThemedText>
          </Pressable>
        </View>
      </Pressable>
    </ContextMenu>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 10,
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    gap: 5,
  },
  username: {
    fontWeight: 'bold',
  },
});
