import React, {useState} from 'react';
import globalStyle from '../../assets/styles/globalStyle';
import {ThemedView} from '../../components/ui/themed-view';
import {ThemedIcon, ThemedText} from '../../components/ui/typography';
import {Pressable, StyleSheet, View} from 'react-native';
import {horizontalScale, verticalScale} from '../../assets/styles/scaling';
import {CustomUser} from '../Profile/components/ProfileInfoCard';
import {faHeart as fasHeart} from '@fortawesome/free-solid-svg-icons';
import {
  faComment,
  faHeart as farHeart,
} from '@fortawesome/free-regular-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

type Props = {
  user: CustomUser;
  user_id: number;
  caption: string | null;
};

export const BottomBar = ({user, user_id, caption}: Props): JSX.Element => {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(false);

  const handleNavigate = () => {
    console.log('NAVIGATE TO SPECIFIC PROFILE', user_id);
  };

  const likeImage = () => {
    setIsLiked(true);
    // TODO: API call for liking the picture
  };

  const unLikeImage = () => {
    setIsLiked(false);
    // TODO: API call for unliking the picture
  };

  const openCommentSection = () => {
    console.log('comment section opened');
  };

  return (
    <ThemedView style={[globalStyle.flex, style.container]}>
      <View style={style.likeCommentContainer}>
        {isLiked ? (
          <Pressable onPress={() => unLikeImage()}>
            <FontAwesomeIcon icon={fasHeart} color="red" size={25} />
          </Pressable>
        ) : (
          <Pressable onPress={() => likeImage()}>
            <ThemedIcon icon={farHeart} size={25} />
          </Pressable>
        )}
        <Pressable onPress={() => openCommentSection()}>
          <ThemedIcon icon={faComment} size={25} />
        </Pressable>
      </View>

      <Pressable onPress={() => handleNavigate()}>
        <ThemedText variant="bold">{user.username}</ThemedText>
      </Pressable>

      {caption && (
        <View>
          <ThemedText numberOfLines={expanded ? undefined : 2}>
            {caption}
          </ThemedText>
          {!expanded &&
            caption.length > 100 && ( // Näytä "Show more" vain jos teksti on pitkä
              <Pressable onPress={() => setExpanded(true)}>
                <ThemedText style={style.showMoreText}>Show more...</ThemedText>
              </Pressable>
            )}
          {expanded && (
            <Pressable onPress={() => setExpanded(false)}>
              <ThemedText style={style.showMoreText}>Show less</ThemedText>
            </Pressable>
          )}
        </View>
      )}
    </ThemedView>
  );
};

const style = StyleSheet.create({
  container: {
    height: 'auto',
    justifyContent: 'space-between',
    flexDirection: 'column',
    marginLeft: horizontalScale(10),
    gap: 8,
    paddingVertical: verticalScale(3),
  },
  likeCommentContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  showMoreText: {
    color: '#2889eb',
    marginTop: 5,
  },
});
