import React, {useState} from 'react';
import {
  BottomSheetFooter,
  BottomSheetFooterProps,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import {View, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '@react-navigation/native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCircleUp} from '@fortawesome/free-solid-svg-icons';
import {OpacityPressable} from '../../components/OpacityPressable/OpacityPressable';

type CommentFooterType = BottomSheetFooterProps & {
  handleAddComment: (input: string) => void;
};

export const CommentInputFooter = ({
  handleAddComment,
  ...props
}: CommentFooterType) => {
  const [input, setInput] = useState('');
  const {colors} = useTheme();
  const insets = useSafeAreaInsets();

  const addComment = () => {
    handleAddComment(input);
    setInput('');
  };

  return (
    <BottomSheetFooter
      {...props}
      style={{paddingBottom: insets.bottom, backgroundColor: colors.card}}>
      <View style={[styles.footerContainer, {backgroundColor: colors.card}]}>
        <BottomSheetTextInput
          style={[styles.input, {color: colors.text}]}
          placeholder="Write a comment"
          value={input}
          onChangeText={setInput}
        />
        <OpacityPressable disabled={input.length < 1} onPress={addComment}>
          <FontAwesomeIcon icon={faCircleUp} color={colors.primary} size={25} />
        </OpacityPressable>
      </View>
    </BottomSheetFooter>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    padding: 4,
    margin: 4,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderRadius: 10,
    fontSize: 16,
    lineHeight: 20,
    padding: 8,
    backgroundColor: 'rgba(151, 151, 151, 0.25)',
  },
});
