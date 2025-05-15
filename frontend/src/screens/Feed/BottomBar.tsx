import React, {useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';

import {
  faComment,
  faHeart as farHeart,
} from '@fortawesome/free-regular-svg-icons';
import {faHeart as fasHeart} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {useTheme} from '@react-navigation/native';

import globalStyle from '../../assets/styles/globalStyle';
import {horizontalScale, verticalScale} from '../../assets/styles/scaling';
import {OpacityPressable} from '../../components/OpacityPressable/OpacityPressable';
import {ThemedView} from '../../components/ui/themed-view';
import {ThemedIcon, ThemedText} from '../../components/ui/typography';
import {
  useAddLikeMutation,
  useDeleteLikeMutation,
} from '../../redux/api/endpoints/posts';

import {PostType} from '../../types/types';

type Props = {
  post: PostType;
  onShowLikes: (post: PostType) => void;
  onShowComments: (post: PostType) => void;
};

export const BottomBar = ({
  post,
  onShowLikes,
  onShowComments,
}: Props): JSX.Element => {
  const [expanded, setExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(post.is_liked_by_current_user);
  const [likeCount, setLikeCount] = useState(post.num_likes);
  const [addLike] = useAddLikeMutation();
  const [deleteLike] = useDeleteLikeMutation();
  const {colors} = useTheme();

  const caption = post.caption;
  const commentCount = post.num_comments;
  const date = new Date(post.created_at);
  const formattedDate = `${date.getDate().toString().padStart(2, '0')}.${(
    date.getMonth() + 1
  )
    .toString()
    .padStart(2, '0')}.${date.getFullYear()}`;

  console.log(isLiked);

  const toggleLike = (newState: boolean) => {
    if (newState) {
      addLike(post.id);
      setIsLiked(true);
      setLikeCount(likeCount + 1);
    } else {
      deleteLike(post.id);
      setIsLiked(false);
      setLikeCount(likeCount - 1);
    }
  };

  const showLikes = () => onShowLikes(post);

  const openCommentSection = () => onShowComments(post);

  return (
    <ThemedView style={[globalStyle.flex, styles.container]}>
      <View style={styles.likeCommentDateContainer}>
        <View style={styles.likeCommentContainer}>
          <View style={styles.iconAndNumber}>
            <OpacityPressable onPress={() => toggleLike(!isLiked)}>
              {isLiked ? (
                <FontAwesomeIcon
                  icon={fasHeart}
                  color={colors.primary}
                  size={25}
                />
              ) : (
                <ThemedIcon icon={farHeart} size={25} />
              )}
            </OpacityPressable>
            {likeCount > 0 && (
              <OpacityPressable onPress={showLikes}>
                <ThemedText variant="bold">{likeCount}</ThemedText>
              </OpacityPressable>
            )}
          </View>

          <OpacityPressable
            onPress={openCommentSection}
            style={styles.iconAndNumber}>
            <ThemedIcon icon={faComment} size={25} />
            {commentCount > 0 && (
              <ThemedText variant="bold">{commentCount}</ThemedText>
            )}
          </OpacityPressable>
        </View>
        <View style={styles.date}>
          <ThemedText>{formattedDate}</ThemedText>
        </View>
      </View>

      {caption && (
        <View>
          <Pressable onPress={() => !expanded && setExpanded(true)}>
            <ThemedText numberOfLines={expanded ? undefined : 2}>
              {caption}
            </ThemedText>
          </Pressable>

          {caption.length > 100 && expanded && (
            <OpacityPressable onPress={() => setExpanded(false)}>
              <ThemedText style={styles.showMoreText}>Show less</ThemedText>
            </OpacityPressable>
          )}

          {!expanded && caption.length > 100 && (
            <OpacityPressable onPress={() => setExpanded(true)}>
              <ThemedText style={styles.showMoreText}>Show more...</ThemedText>
            </OpacityPressable>
          )}
        </View>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    flexDirection: 'column',
    marginLeft: horizontalScale(10),
    gap: 8,
    paddingVertical: verticalScale(3),
  },
  likeCommentContainer: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
  },
  iconAndNumber: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  showMoreText: {
    color: '#2889eb',
    marginTop: 5,
  },
  likeCommentDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  date: {paddingRight: 5},
});
