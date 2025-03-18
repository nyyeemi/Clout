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

type Props = {
  caption: string | null;
};

export const BottomBar = ({caption}: Props): JSX.Element => {
  const [isLiked, setIsLiked] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const likesCount = 12; // Mock-data
  const commentsCount = 12; // Mock-data

  const toggleLike = (newState: boolean) => {
    setIsLiked(newState);

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
          <Pressable onPress={showLikes}>
            <ThemedText variant="bold">{likesCount}</ThemedText>
          </Pressable>
        </View>

        <Pressable onPress={openCommentSection} style={styles.iconAndNumber}>
          <ThemedIcon icon={faComment} size={25} />
          <ThemedText variant="bold">{commentsCount}</ThemedText>
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
