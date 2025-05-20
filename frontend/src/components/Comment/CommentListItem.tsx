import React, {useState} from 'react';
import {
  Alert,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import type {NativeSyntheticEvent} from 'react-native';

import {faCircleUp} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {BottomSheetTextInput} from '@gorhom/bottom-sheet';
import {useNavigation, useTheme} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import ContextMenu from 'react-native-context-menu-view';
import type {ContextMenuOnPressNativeEvent} from 'react-native-context-menu-view';

import {RootStackParamList, Routes} from '../../navigation/Routes';
import {
  useDeleteCommentMutation,
  useUpdateCommentMutation,
} from '../../redux/api/endpoints/posts';
import {useGetUsersMeQuery} from '../../redux/api/endpoints/users';
import {OpacityPressable} from '../OpacityPressable/OpacityPressable';
import {ProfilePicture} from '../ProfilePicture/ProfilePicture';
import {ExtendedTheme} from '../ui/themes';
import {ThemedText} from '../ui/typography';

import {CommentType} from '../../types/types';

type CommentListItemProps = {
  comment: CommentType;
  size?: 'small' | 'medium' | 'large';
  onItemPress?: () => void;
  isEditingExternally?: boolean;
  onStartEdit?: () => void;
  onStopEdit?: () => void;
  dimmed?: boolean;
};

export const CommentListItem = ({
  comment,
  size = 'small',
  onItemPress,
  isEditingExternally,
  onStartEdit,
  onStopEdit,
  dimmed = false,
}: CommentListItemProps) => {
  const [editedContent, setEditedContent] = useState(comment.content);
  const {data: loggedInUser} = useGetUsersMeQuery();
  const [updateComment] = useUpdateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const {colors} = useTheme() as ExtendedTheme;
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const user = comment.owner;

  const handlePress = () => {
    onItemPress?.();
    navigation.navigate(Routes.ProfileStack, {
      screen: Routes.Profile,
      params: {
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
        onStartEdit?.();
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

  const handleSaveEdit = async () => {
    try {
      await updateComment({
        post_id: comment.post_id,
        content: editedContent,
        comment_id: comment.id,
      }).unwrap();
      onStopEdit?.();
    } catch (e) {
      Alert.alert('Failed to update comment');
      console.log(e);
    }
  };

  const isEditing = isEditingExternally;
  const containerStyle: StyleProp<ViewStyle> = [
    styles.container,
    dimmed && styles.dimmed,
    isEditing && {
      ...styles.elevated,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 8,
      backgroundColor: colors.highlighted,
    },
  ];

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
      <Pressable style={containerStyle}>
        <OpacityPressable onPress={handlePress}>
          <ProfilePicture uri={user?.profile_picture_url ?? ''} size={size} />
        </OpacityPressable>
        <View style={styles.textContainer}>
          <OpacityPressable onPress={handlePress}>
            <ThemedText style={styles.username}>{user?.username}</ThemedText>
          </OpacityPressable>
          {isEditing ? (
            <View style={styles.commentAndButton}>
              <BottomSheetTextInput
                value={editedContent}
                onChangeText={setEditedContent}
                multiline
                style={[
                  {color: colors.text, backgroundColor: colors.border},
                  styles.input,
                ]}
              />
              <OpacityPressable onPress={handleSaveEdit}>
                <FontAwesomeIcon
                  icon={faCircleUp}
                  color={colors.primary}
                  size={25}
                />
              </OpacityPressable>
            </View>
          ) : (
            <Pressable onPress={() => {}}>
              <ThemedText numberOfLines={2}>{comment.content}</ThemedText>
            </Pressable>
          )}
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
  dimmed: {
    opacity: 0.1,
  },
  elevated: {
    zIndex: 2,
    opacity: 1,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    gap: 5,
  },
  username: {
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    marginTop: 4,
    flex: 1,
  },
  commentAndButton: {
    alignItems: 'center',
    gap: 10,
    flexDirection: 'row',
  },
});
