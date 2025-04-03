import React, {useState} from 'react';
import globalStyle from '../../assets/styles/globalStyle';
import {ThemedView} from '../../components/ui/themed-view';
import {ThemedIcon, ThemedText} from '../../components/ui/typography';
import {Pressable, StyleSheet, View} from 'react-native';
import {horizontalScale, verticalScale} from '../../assets/styles/scaling';
import {faHeart as fasHeart} from '@fortawesome/free-solid-svg-icons';
import {
  faComment,
  faHeart as farHeart,
} from '@fortawesome/free-regular-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store/store';
import {
  useAddLikeMutation,
  useDeleteLikeMutation,
  useGetLikesByImageIdQuery,
} from '../../redux/slices/mockApiSlice';
import {CustomImage} from '../../types/types';
import {OpacityPressable} from '../../components/OpacityPressable/OpacityPressable';

type Props = {
  post: CustomImage;
  onShowLikes: (post: CustomImage) => void;
};

export const BottomBar = ({post, onShowLikes}: Props): JSX.Element => {
  const [expanded, setExpanded] = useState(false);

  const {data: likes = []} = useGetLikesByImageIdQuery(post.id);
  const [addLike] = useAddLikeMutation();
  const [deleteLike] = useDeleteLikeMutation();

  const caption = post.caption;

  // can and should clean this up in redux filtering and counting logic

  const likeCount = likes.length;

  const comments = useSelector((state: RootState) => state.comment.comments);
  const commentCount = comments.filter(
    comment => comment.image_id === post.id,
  ).length;

  const user = useSelector((state: RootState) => state.user.user);

  const like = likes.find(item => item.user_id === user?.id);

  const toggleLike = (newState: boolean) => {
    console.log(like, user?.id, likes);
    if (newState) {
      addLike(post.id);
    } else if (like?.id) {
      deleteLike(like);
    }
  };

  const showLikes = () => {
    onShowLikes(post);
  };
  const openCommentSection = () => console.log('Comment section opened');

  return (
    <ThemedView style={[globalStyle.flex, styles.container]}>
      <View style={styles.likeCommentContainer}>
        <View style={styles.iconAndNumber}>
          <OpacityPressable onPress={() => toggleLike(!like)}>
            {like ? (
              <FontAwesomeIcon icon={fasHeart} color="red" size={25} />
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
});
