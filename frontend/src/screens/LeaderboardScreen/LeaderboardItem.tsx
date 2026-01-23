import {
  Image,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';

import {HeadlineText, Title3Text} from '../../components/ui/typography';
import {useTheme} from '../../hooks/useTheme';
import {LeaderboardEntryType} from '../../redux/api/endpoints/competitions';

type LeaderBoardItemProps = {
  data: LeaderboardEntryType;
  index: number;
  onImagePress: (url: string) => void;
  handleNavigate: (username: string) => void;
};

export const LeaderboardItem = ({
  data,
  index,
  onImagePress,
  handleNavigate,
}: LeaderBoardItemProps) => {
  const {colors} = useTheme();

  return (
    <View
      style={[styles.leaderboardItemContainer, {backgroundColor: colors.card}]}>
      <View style={{flexDirection: 'row', gap: 16, alignItems: 'center'}}>
        <Title3Text variant="heavy">{index.toString()}.</Title3Text>
        <TouchableOpacity onPress={() => handleNavigate(data.username)}>
          <HeadlineText variant="medium">{data.username}</HeadlineText>
        </TouchableOpacity>
      </View>

      <TouchableHighlight
        onPress={() => onImagePress(data.image_url)}
        style={styles.imageContainer}>
        <Image style={styles.itemImage} source={{uri: data.image_url}} />
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  leaderboardItemContainer: {
    flexDirection: 'row',
    paddingLeft: 16,
    marginVertical: 3,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    // iOS
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: {width: 0, height: 1},

    // Android
    elevation: 2,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 9,

    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 2,
    shadowOffset: {width: 0, height: 1},

    // Android
    elevation: 2,
  },
  imageContainer: {
    // iOS
    margin: 6,
    borderRadius: 9,
  },
});
