import {StyleSheet, TextInput, TextInputProps, View} from 'react-native';

import {faCircleRight} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {useTheme} from '@react-navigation/native';

import {OpacityPressable} from './OpacityPressable/OpacityPressable';

type InputCardProps = {
  handleSubmit?: () => void;
  showButton?: boolean;
  name: string;
  value: string;
  onChangeText: (text: string) => void;
  disableButton?: boolean;
} & TextInputProps;

export const InputWithButton = ({
  handleSubmit,
  showButton = true,
  value,
  onChangeText,
  disableButton,
  ...props
}: InputCardProps) => {
  const {colors} = useTheme();

  return (
    <View
      style={[
        styles.inputAndButton,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}>
      <TextInput
        inputMode="text"
        autoCapitalize="none"
        clearButtonMode="while-editing"
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            color: colors.text,
          },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={colors.border}
        maxLength={25}
        {...props}
      />
      {showButton && handleSubmit && (
        <OpacityPressable onPress={handleSubmit} disabled={disableButton}>
          <FontAwesomeIcon
            icon={faCircleRight}
            color={colors.primary}
            size={20}
          />
        </OpacityPressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    flex: 1,
  },
  inputAndButton: {
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    height: 40,
    borderRadius: 10,
    padding: 10,
  },
});
