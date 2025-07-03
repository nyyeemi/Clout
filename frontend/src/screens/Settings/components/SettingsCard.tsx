import {StyleSheet, View} from 'react-native';

import {useTheme} from '@react-navigation/native';

import {Title3Text} from '../../../components/ui/typography';
import {SettingsCardItem, SettingsCardItemType} from './SettingsCardItem';

type SettingsCardType = {
  header: string;
  itemTitleList: SettingsCardItemType[];
};

export const SettingsCard = ({header, itemTitleList}: SettingsCardType) => {
  const {colors} = useTheme();

  return (
    <View
      style={[
        stylesCard.container,
        {borderBottomColor: colors.border, backgroundColor: colors.card},
      ]}>
      <Title3Text variant="bold" style={stylesCard.headerTextContainer}>
        {header}
      </Title3Text>
      {itemTitleList.map((item, index) => (
        <SettingsCardItem
          key={item.title}
          icon={item.icon}
          title={item.title}
          contentType={item.contentType}
          isLastItem={index === itemTitleList.length - 1}
        />
      ))}
    </View>
  );
};

const stylesCard = StyleSheet.create({
  container: {
    paddingLeft: 10,
    borderRadius: 10,
  },
  headerTextContainer: {
    paddingVertical: 5,
  },
});
