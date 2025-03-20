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
import {CustomImage} from '../../services/image/images';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store/store';

type Props = {
  post: CustomImage;
};

export const BottomBar = ({post}: Props): JSX.Element => {
  const [expanded, setExpanded] = useState(false);

  const caption = post.caption;

  const allLikes = useSelector((state: RootState) => state.like.likes);
  const imagelikes = allLikes.filter(like => like.image_id === post.id);
  const likeCount = imagelikes.length;

  const comments = useSelector((state: RootState) => state.comment.comments);
  const commentCount = comments.filter(
    comment => comment.image_id === post.id,
  ).length;

  const user = useSelector((state: RootState) => state.user.user);

  const isLiked = imagelikes.find(like => like.user_id === user?.id);
  //console.log('tykkäys', isLiked);

  const toggleLike = (newState: boolean) => {
    if (newState) {
      console.log('Liked image');
      // TODO: API call for liking the picture
    } else {
      console.log('Unliked image');
      // TODO: API call for unliking the picture
    }
  };

  const showLikes = () => console.log('Show users that liked the picture');
  const openCommentSection = () => console.log('Comment section opened');

  return (
    <ThemedView style={[globalStyle.flex, styles.container]}>
      <View style={styles.likeCommentContainer}>
        <View style={styles.iconAndNumber}>
          <Pressable onPress={() => toggleLike(!isLiked)}>
            {isLiked ? (
              <FontAwesomeIcon icon={fasHeart} color="red" size={25} />
            ) : (
              <ThemedIcon icon={farHeart} size={25} />
            )}
          </Pressable>
          {likeCount > 0 && (
            <Pressable onPress={showLikes}>
              <ThemedText variant="bold">{likeCount}</ThemedText>
            </Pressable>
          )}
        </View>

        <Pressable onPress={openCommentSection} style={styles.iconAndNumber}>
          <ThemedIcon icon={faComment} size={25} />
          {commentCount > 0 && (
            <ThemedText variant="bold">{commentCount}</ThemedText>
          )}
        </Pressable>
      </View>

      {caption && (
        <View>
          <Pressable onPress={() => !expanded && setExpanded(true)}>
            <ThemedText numberOfLines={expanded ? undefined : 2}>
              {caption}
            </ThemedText>
          </Pressable>

          {caption.length > 100 && expanded && (
            <Pressable onPress={() => setExpanded(false)}>
              <ThemedText style={styles.showMoreText}>Show less</ThemedText>
            </Pressable>
          )}

          {!expanded && caption.length > 100 && (
            <Pressable onPress={() => setExpanded(true)}>
              <ThemedText style={styles.showMoreText}>Show more...</ThemedText>
            </Pressable>
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
