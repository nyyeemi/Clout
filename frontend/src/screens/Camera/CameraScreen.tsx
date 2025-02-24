import React, {useState, useRef} from 'react';
import {View, TouchableOpacity, Image, Text, SafeAreaView} from 'react-native';
import {
  useCameraDevices,
  useCameraPermission,
  Camera,
  CameraDevice,
} from 'react-native-vision-camera';
//import {useNavigation} from '@react-navigation/native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faCamera,
  faSync,
  faCheck,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {Style} from './style';

export const CameraScreen = (): JSX.Element => {
  const [cameraType, setCameraType] = useState<'back' | 'front'>('back');
  const [photo, setPhoto] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  const devices = useCameraDevices();
  //const navigation = useNavigation();
  const cameraRef = useRef<Camera>(null);
  const {hasPermission, requestPermission} = useCameraPermission();

  if (!hasPermission) {
    requestPermission();
    return <Text>Requesting camera permission...</Text>;
  }

  const frontCamera = devices.find(device => device.position === 'front');
  const backCamera = devices.find(device => device.position === 'back');

  if (!frontCamera && !backCamera) {
    return (
      <SafeAreaView>
        <Text>No camera found</Text>
      </SafeAreaView>
    );
  }

  const activeDevice: CameraDevice | undefined =
    cameraType === 'front' ? frontCamera : backCamera;

  if (!activeDevice) {
    return <Text>No active camera found</Text>;
  }

  // Get ultrawide format
  const ultraWideFormat = activeDevice.formats.find(f => f.fieldOfView > 100);

  const minZoom = activeDevice.minZoom ?? 1;
  const maxZoom = activeDevice.maxZoom ?? 10;

  // Zoom pinching
  const pinchGesture = Gesture.Pinch().onUpdate(e => {
    let newZoom = Math.max(minZoom, Math.min(e.scale, maxZoom));
    setZoom(newZoom);
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

  return (
    <View style={Style.container}>
      {!photo ? (
        <>
          <GestureDetector gesture={pinchGesture}>
            <Camera
              ref={cameraRef}
              style={Style.camera}
              device={activeDevice}
              isActive
              photo
              zoom={zoom}
              format={zoom < 1 && ultraWideFormat ? ultraWideFormat : undefined}
            />
          </GestureDetector>

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
