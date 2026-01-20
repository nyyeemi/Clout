import {Modal, Pressable, StyleSheet, View} from 'react-native';

import {Image} from 'expo-image';

import {FootnoteText} from '../../components/ui/typography';

type LeaderboardModalProps = {
  onRequestClose: () => void;
  selectedImage: string | null;
};

export const LeaderboardModal = ({
  onRequestClose,
  selectedImage,
}: LeaderboardModalProps) => {
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
              contentFit="contain"
            />
          )}
          <FootnoteText style={{color: 'white', marginTop: 10}}>
            Tap anywhere to close
          </FootnoteText>
        </View>
      </Pressable>
    </Modal>
  );
};

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
    width: '100%',
    height: '100%',
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
});
