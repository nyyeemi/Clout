import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  faArrowLeft,
  faBolt,
  faCamera,
  faCheck,
  faSlash,
  faSync,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import RNFS from 'react-native-fs';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Reanimated, {
  Extrapolation,
  interpolate,
  useAnimatedProps,
  useSharedValue,
} from 'react-native-reanimated';
import {
  Camera,
  CameraDevice,
  CameraProps,
  useCameraDevices,
  useCameraPermission,
} from 'react-native-vision-camera';

import Input from '../../components/Input/Input';
import {Spinner} from '../../components/Spinner/Spinner';
import {ThemedSafeAreaView} from '../../components/ui/themed-view';
import {ThemedText} from '../../components/ui/typography';
import {useCreatePostMutation} from '../../redux/api/endpoints/posts';
import {setNotification} from '../../redux/slices/notificationsSlice';
import {Style} from './style';

Reanimated.addWhitelistedNativeProps({zoom: true});
const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);

export const CameraScreen = (): JSX.Element => {
  const zoomOffset = useSharedValue(0);
  const [flashMode, setFlashMode] = useState<'on' | 'off' | 'auto'>('off');
  const [cameraType, setCameraType] = useState<'back' | 'front'>('back');
  const [photo, setPhoto] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [hasPosted, setHasPosted] = useState(false); // TODO: init from server
  const [createPost, {isLoading: isCreatingPost}] = useCreatePostMutation();

  const navigation = useNavigation();

  const devices = useCameraDevices();
  const frontCamera = devices.find(device => device.position === 'front');
  const backCamera = devices.find(device => device.position === 'back');

  const activeDevice: CameraDevice =
    cameraType === 'front'
      ? (frontCamera ?? backCamera!)
      : (backCamera ?? frontCamera!);

  const zoom = useSharedValue(activeDevice?.neutralZoom ?? 1);
  const animatedProps = useAnimatedProps<CameraProps>(
    () => ({zoom: zoom.value}),
    [zoom],
  );

  const [retryCount, setRetryCount] = useState(0);

  const MAX_RETRIES = 3;
  const RETRY_INTERVAL_MS = 1000;

  useFocusEffect(
    useCallback(() => {
      setRetryCount(0); // reset on screen entry
    }, []),
  );

  useEffect(() => {
    if (activeDevice) {
      return;
    }

    if (retryCount < MAX_RETRIES) {
      const timeout = setTimeout(() => {
        setRetryCount(prev => prev + 1);
      }, RETRY_INTERVAL_MS);

      return () => clearTimeout(timeout);
    } else {
      Alert.alert('Error', 'No camera device found', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    }
  }, [retryCount, activeDevice, navigation]);

  const cameraRef = useRef<Camera>(null);
  const {hasPermission, requestPermission} = useCameraPermission();

  if (!hasPermission) {
    requestPermission();
    return <Text>Requesting camera permission...</Text>;
  }

  if (!activeDevice) {
    return <Spinner />;
  }

  const minZoom = activeDevice?.minZoom ?? 1;
  const maxZoom = Math.min(activeDevice?.maxZoom ?? 10, 10);

  const pinchGesture = Gesture.Pinch()
    .onBegin(() => {
      zoomOffset.value = zoom.value;
    })
    .onUpdate(e => {
      const newZoom = zoomOffset.value * e.scale;
      zoom.value = interpolate(
        newZoom,
        [1, 10],
        [minZoom, maxZoom],
        Extrapolation.CLAMP,
      );
    });

  const takePicture = async () => {
    if (cameraRef.current) {
      const photoData = await cameraRef.current.takePhoto({
        flash: flashMode,
      });
      setPhoto(`file://${photoData.path}`);
    }
  };

  const toggleCamera = () => {
    setCameraType(prev => (prev === 'back' ? 'front' : 'back'));
  };

  const confirmPhoto = async () => {
    const filename = `${Date.now()}.jpg`;
    const localPath = `${RNFS.DocumentDirectoryPath}/${filename}`;

    if (photo) {
      await RNFS.copyFile(photo, localPath);
    } else {
      Alert.alert('Error saving photo');
      return;
    }
    const fileUrl = `file://${localPath}`;

    const createPostPayload = {
      image_url: fileUrl,
      caption: caption || undefined,
      is_visible: true,
    };
    try {
      const payload = await createPost(createPostPayload).unwrap();
      console.log('fulfilled:', payload);
    } catch (error) {
      console.log('error', error);
      setNotification({
        type: 'error',
        message: 'Error saving photo',
      });
      return;
    }
    setNotification({
      type: 'success',
      message: 'Photo taken successfully',
    });
    setPhoto(null);
    setHasPosted(true);
  };

  const cancelPhoto = () => {
    setPhoto(null);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const toggleFlashMode = () => {
    setFlashMode(prev =>
      prev === 'off' ? 'on' : prev === 'on' ? 'auto' : 'off',
    );
  };

  return hasPosted ? (
    <ThemedSafeAreaView style={styles.hasVoted}>
      <ThemedText>You already have posted for this competition</ThemedText>
    </ThemedSafeAreaView>
  ) : (
    <View style={Style.container}>
      {!photo ? (
        <>
          <GestureDetector gesture={pinchGesture}>
            <ReanimatedCamera
              ref={cameraRef}
              style={Style.camera}
              device={activeDevice}
              isActive
              photo
              animatedProps={animatedProps}
            />
          </GestureDetector>
          <TouchableOpacity onPress={handleBack} style={Style.backButton}>
            <FontAwesomeIcon icon={faArrowLeft} size={30} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleFlashMode} style={Style.flashButton}>
            <View>
              <FontAwesomeIcon
                icon={faBolt}
                size={flashMode === 'auto' ? 20 : 30}
                color={flashMode === 'off' ? 'grey' : 'white'}
              />
              {flashMode === 'off' && (
                <FontAwesomeIcon
                  icon={faSlash}
                  size={32}
                  color="grey"
                  style={Style.flashSlashIcon}
                />
              )}
            </View>
            {flashMode === 'auto' && <Text style={Style.flashText}>AUTO</Text>}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={toggleCamera}
            style={Style.changeCameraButton}>
            <FontAwesomeIcon icon={faSync} size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={takePicture} style={Style.captureButton}>
            <FontAwesomeIcon icon={faCamera} size={40} color="white" />
          </TouchableOpacity>
        </>
      ) : (
        <ThemedSafeAreaView style={styles.previewContainer}>
          <Image source={{uri: photo}} style={styles.previewImage} />
          <Input
            label="Caption"
            value={caption}
            onChangeText={setCaption}
            style={styles.input}
            containerStyle={styles.inputContainer}
            autoCapitalize="none"
          />
          <View style={styles.previewControls}>
            <TouchableOpacity
              onPress={cancelPhoto}
              style={Style.cancelButton}
              disabled={isCreatingPost}>
              <FontAwesomeIcon icon={faTimes} size={30} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={confirmPhoto}
              style={Style.confirmButton}
              disabled={isCreatingPost}>
              <FontAwesomeIcon icon={faCheck} size={30} color="white" />
            </TouchableOpacity>
          </View>
        </ThemedSafeAreaView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    width: '90%',
    marginTop: 15,
    //backgroundColor: 'blue',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    color: 'white',
  },
  previewContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 50,
  },
  previewImage: {
    width: '90%',
    height: '70%',
    borderRadius: 10,
  },
  previewControls: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    //backgroundColor: 'red',
  },
  hasVoted: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
