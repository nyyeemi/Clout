import {Dimensions, Modal, Pressable, StyleSheet, View} from 'react-native';

import {Image} from 'expo-image';

import {FootnoteText} from '../../components/ui/typography';
import {useTheme} from '../../hooks/useTheme';

type LeaderboardModalProps = {
  onRequestClose: () => void;
  selectedImage: string | null;
};

export const LeaderboardModal = ({
  onRequestClose,
  selectedImage,
}: LeaderboardModalProps) => {
  const {colors} = useTheme();
  return (
    <Modal
      visible={!!selectedImage}
      transparent={true}
      animationType="fade"
      onRequestClose={onRequestClose}>
      <Pressable style={styles.modalOverlay} onPress={onRequestClose}>
        <View style={styles.modalContent}>
          {selectedImage && (
            <Image
              source={selectedImage}
              style={styles.fullImage}
              contentFit="cover"
            />
          )}
          <FootnoteText
            style={[{color: colors.textSecondary}, styles.footNote]}>
            Tap anywhere to close
          </FootnoteText>
        </View>
      </Pressable>
    </Modal>
  );
};

const {width} = Dimensions.get('window');
const IMAGE_WIDTH = width * 0.95;
const IMAGE_HEIGHT = (IMAGE_WIDTH / 3) * 4;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)', // Darken background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    height: '70%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    borderRadius: 12,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  leaderboardItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginVertical: 4,
    borderRadius: 12,
  },
  footNote: {marginTop: 30},
});
