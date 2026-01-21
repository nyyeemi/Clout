import {StyleSheet, View} from 'react-native';

import Svg, {Path} from 'react-native-svg';

import {Title1Text, Title3Text} from '../ui/typography';

export const CloudBadge = ({
  size = 46,
  bg = 'white',
  border = '#6B5BFF',
  text = '',
  textColor = '#000000',
  textSize = 'small',
}: {
  size?: number;
  bg: string;
  border: string;
  text: string;
  textColor?: string;
  textSize?: string;
}) => {
  return (
    <View style={{width: size, height: size}}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Path
          d="M50 10
             C62 6, 76 12, 80 24
             C92 28, 96 44, 88 54
             C92 68, 82 84, 66 82
             C58 92, 42 92, 34 82
             C18 84, 8 68, 12 54
             C4 44, 8 28, 20 24
             C24 12, 38 6, 50 10 Z"
          fill={bg}
          stroke={border}
          strokeWidth={6}
          strokeLinejoin="round"
        />
      </Svg>

      <View style={styles2.center}>
        {textSize === 'large' && (
          <Title1Text variant="heavy" style={{color: textColor}}>
            {text}
          </Title1Text>
        )}
        {textSize === 'small' && (
          <Title3Text variant="bold" style={{color: textColor}}>
            {text}
          </Title3Text>
        )}
      </View>
    </View>
  );
};

const styles2 = StyleSheet.create({
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
