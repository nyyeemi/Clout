import {StyleSheet, TouchableOpacity, View} from 'react-native';

import {FlashList} from '@shopify/flash-list';

import {BodyText, FootnoteText} from '../../components/ui/typography';
import {useTheme} from '../../hooks/useTheme';
import {CompetitionType} from '../../redux/api/endpoints/competitions';

type CompetitionBarProps = {
  selectedId: string;
  competitions: CompetitionType[];
  onPress: (id: string) => void;
};

export const CompetitionBar = ({
  competitions,
  selectedId,
  onPress,
}: CompetitionBarProps) => {
  const {colors} = useTheme();

  const renderItem = ({item}: {item: CompetitionType}) => {
    const date = new Date(item.start_time);
    const formattedDate = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;

    return (
      <TouchableOpacity onPress={() => onPress(item.id)}>
        <View
          style={[
            styles.barItem,
            {
              backgroundColor:
                selectedId == item.id ? colors.border : colors.card,
            },
          ]}>
          <BodyText variant="medium">{item.category}</BodyText>
          <FootnoteText style={{color: colors.textSecondary}}>
            {formattedDate}
          </FootnoteText>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <FlashList
      data={competitions}
      renderItem={renderItem}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  barItem: {
    minWidth: 96,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginHorizontal: 8,
    borderRadius: 18,
  },
});
