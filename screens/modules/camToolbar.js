import React from 'react';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { View, TouchableWithoutFeedback, TouchableOpacity, StyleSheet } from 'react-native';

const { FlashMode: CameraFlashModes, Type: CameraTypes } = Camera.Constants;

export default ({
    capturing = false,
    cameraType = CameraTypes.back,
    flashMode = CameraFlashModes.off,
    setFlashMode, setCameraType,
    onCapture
}) => (
    <View style={styles.bottomToolbar}>
      <TouchableOpacity onPress={() => setFlashMode(
          flashMode === CameraFlashModes.on ? CameraFlashModes.off : CameraFlashModes.on
      )}
      style={styles.flashMode}>
          <Ionicons
              name={flashMode == CameraFlashModes.on ? "md-flash" : 'md-flash-off'}
              color="white"
              size={30}
          />
      </TouchableOpacity>

      <TouchableOpacity
          onPress={onCapture}>
          <View style={styles.capture}>
          <View style={styles.captureInside}></View>
          </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setCameraType(
          cameraType === CameraTypes.back ? CameraTypes.front : CameraTypes.back
      )}
      style={styles.cameraMode}>
          <Ionicons
              name="md-reverse-camera"
              color="white"
              size={30}
          />
      </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
  bottomToolbar: {
    flex:1,
    flexDirection: 'row',
    justifyContent:'center',
    alignItems:'center',
    position:'absolute',
    left:'37%',
    bottom:'5%',
  },
  flashMode: {
    position:'absolute',
    left:-80,
  },
  capture: {
    width:100,
    height:100,
    borderWidth:2,
    borderColor:'#fff',
    borderRadius:50,
    padding:10,
    alignItems:'center',
    justifyContent:'center',
  },
  captureInside: {
    width:90,
    height:90,
    borderRadius:50,
    backgroundColor:'#fff'
  },
  cameraMode: {
    position:'absolute',
    left:160,
  }
})
