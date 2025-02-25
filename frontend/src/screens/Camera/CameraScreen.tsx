import React, {useState, useRef, useCallback} from 'react';
import {View, TouchableOpacity, Image, Text, SafeAreaView} from 'react-native';
import {
  useCameraDevices,
  useCameraPermission,
  Camera,
  CameraDevice,
  CameraProps,
} from 'react-native-vision-camera';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faCamera,
  faSync,
  faCheck,
  faTimes,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {Style} from './style';
import {useDispatch} from 'react-redux';
import {setCameraActive} from '../../redux/slices/cameraSlice';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Reanimated, {
  useSharedValue,
  useAnimatedProps,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';

Reanimated.addWhitelistedNativeProps({zoom: true});
const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);

export const CameraScreen = (): JSX.Element => {
  const zoomOffset = useSharedValue(0);

  const [cameraType, setCameraType] = useState<'back' | 'front'>('back');
  const [photo, setPhoto] = useState<string | null>(null);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const devices = useCameraDevices();
  const frontCamera = devices.find(device => device.position === 'front');
  const backCamera = devices.find(device => device.position === 'back');
  const activeDevice: CameraDevice | undefined =
    cameraType === 'front' ? frontCamera : backCamera;

  const zoom = useSharedValue(activeDevice?.neutralZoom ?? 1);
  const animatedProps = useAnimatedProps<CameraProps>(
    () => ({zoom: zoom.value}),
    [zoom],
  );

  useFocusEffect(
    useCallback(() => {
      dispatch(setCameraActive(true));
      return () => {
        dispatch(setCameraActive(false));
      };
    }, [dispatch]),
  );

  const cameraRef = useRef<Camera>(null);
  const {hasPermission, requestPermission} = useCameraPermission();

  if (!hasPermission) {
    requestPermission();
    return <Text>Requesting camera permission...</Text>;
  }

  if (!frontCamera && !backCamera) {
    return (
      <SafeAreaView>
        <Text>No camera found</Text>
      </SafeAreaView>
    );
  }

  if (!activeDevice) {
    return <Text>No active camera found</Text>;
  }

  const minZoom = activeDevice.minZoom ?? 1;
  const maxZoom = Math.min(activeDevice.maxZoom ?? 10, 10);

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
      const photoData = await cameraRef.current.takePhoto();
      setPhoto(`file://${photoData.path}`);
    }
  };

  const toggleCamera = () => {
    setCameraType(prev => (prev === 'back' ? 'front' : 'back'));
  };

  const confirmPhoto = () => {
    console.log('Sending image:', photo);
    setPhoto(null);
  };

  const cancelPhoto = () => {
    setPhoto(null);
  };

  const handleBack = () => {
    dispatch(setCameraActive(false));
    navigation.goBack();
  };

  return (
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
          <View style={Style.controls}>
            <TouchableOpacity onPress={toggleCamera} style={Style.button}>
              <FontAwesomeIcon icon={faSync} size={30} color="white" />
            </TouchableOpacity>

            <TouchableOpacity onPress={takePicture} style={Style.captureButton}>
              <FontAwesomeIcon icon={faCamera} size={40} color="white" />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={Style.previewContainer}>
          <Image source={{uri: photo}} style={Style.previewImage} />

          <View style={Style.previewControls}>
            <TouchableOpacity onPress={cancelPhoto} style={Style.cancelButton}>
              <FontAwesomeIcon icon={faTimes} size={30} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={confirmPhoto}
              style={Style.confirmButton}>
              <FontAwesomeIcon icon={faCheck} size={30} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};
