import {StyleSheet, Text, View} from 'react-native';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

import {BodyText, ThemedIcon, Title3Text} from '../../components/ui/typography';
import {useTheme} from '../../hooks/useTheme';

type InfoBoxProps = {
  title: string;
  icon?: any;
  mainInfo: string | number | undefined;
  footerText: string;
  aspectRatio: number;
  size?: 'body' | 'title';
  hasIcon?: boolean;
  category?: string;
};

export const InfoBox = ({
  title,
  icon,
  mainInfo,
  footerText,
  aspectRatio,
  size = 'title',
  hasIcon = false,
  category,
}: InfoBoxProps) => {
  const {colors} = useTheme();

  const MainInfo = size === 'title' ? Title3Text : BodyText;

  return (
    <View
      style={[
        styles.dailyStreak,
        {backgroundColor: colors.card, aspectRatio: aspectRatio},
      ]}>
      <Title3Text style={{color: colors.primary}}>{title}</Title3Text>
      {category && <Title3Text variant="heavy">{category}</Title3Text>}
      <View style={styles.emojiAndText}>
        {hasIcon && <ThemedIcon icon={icon} />}
        <MainInfo>{mainInfo}</MainInfo>
      </View>
      <BodyText>{footerText}</BodyText>
    </View>
  );
};

const styles = StyleSheet.create({
  dailyStreak: {
    borderRadius: 20,
    padding: 10,
    flex: 1,
    justifyContent: 'space-between',
    maxWidth: '100%',
  },
  emojiAndText: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    //backgroundColor: 'tomato',
  },
});
