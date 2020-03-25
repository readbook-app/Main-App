import React, { useState, useEffect } from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator} from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';

import Toolbar from './modules/camToolbar'

export default class Cam extends React.Component {
  camera = null;

  state = {
      capture: null,
      capturing: null,
      hasCameraPermission: null,
      cameraType: Camera.Constants.Type.back,
      flashMode: Camera.Constants.FlashMode.off,
  };

  setFlashMode = (flashMode) => this.setState({ flashMode });
  setCameraType = (cameraType) => this.setState({ cameraType });

  handleShortCapture = async () => {
      this.setState({ capturing: true});
      const photoData = await this.camera.takePictureAsync();
      this.setState({ capturing: false});
      this.props.navigation.navigate('Post', {photo: photoData.uri});
  };

  async componentDidMount() {
      const camera = await Permissions.askAsync(Permissions.CAMERA);
      const audio = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
      const hasCameraPermission = (camera.status === 'granted' && audio.status === 'granted');

      this.setState({ hasCameraPermission });
  };

  render() {
    const { hasCameraPermission, flashMode, cameraType, capturing } = this.state;

    return (
      <View style={styles.container}>
      <Camera
          type={this.state.cameraType}
          flashMode={this.state.flashMode}
          style={styles.camera}
          ref={camera => this.camera = camera}
      />
      <TouchableOpacity style={styles.back} onPress={() => this.props.navigation.navigate('Post')}>
        <Ionicons
            name='md-arrow-back'
            color="white"
            size={30}
        />
      </TouchableOpacity>
      {this.state.capturing &&
      <View style={styles.capturing}>
        <Text>Salvando foto</Text>
        <ActivityIndicator size="large" />
      </View>}
      <Toolbar
          capturing={capturing}
          flashMode={flashMode}
          cameraType={cameraType}
          setFlashMode={this.setFlashMode}
          setCameraType={this.setCameraType}
          onCapture={this.handleShortCapture}
                />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  back: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    left:10,
    top:32,
    width:80,
    height:40,
    borderRadius:50,
    padding:5,
  },
  camera:{
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  capturing: {
    alignItems:'center',
    justifyContent:'center',
    width: '90%',
    height: 100,
    backgroundColor:'#fff',
    borderRadius:20,
  }
})
