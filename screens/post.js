import React from 'react'
import {View, Text, TextInput, Image, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, LayoutAnimation} from 'react-native'
import {Header} from './modules/header'
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions';
import Fire from '../fire'
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

const firebase = require("firebase");
require("firebase/firestore");

class Post extends React.Component {
  state = {
    user: {
      name: '',
      email: '',
      avatar: null,
    },
    hasPermissions: null,
    image: null,
    body: '',
    publishing: false,
  }

  unsubscribe: null;

  async componentDidMount(){
    const camera = await Permissions.askAsync(Permissions.CAMERA);
    const audio = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    const cameralRoll = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    const hasCameraPermission = (camera.status === 'granted' && audio.status === 'granted' && cameralRoll.status === 'granted');

    this.setState({ hasCameraPermission });

    const uid = Fire.shared.uid;
    this.unsubscribe = Fire.shared.firestore
      .collection("users")
      .doc(uid)
      .onSnapshot(user => {
        this.setState({
          user:{...user.data()}
        });
      });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };

  handlePost = () => {
    this.setState({publishing: true});
    Fire.shared
      .addPost({text: this.state.body.trim(),
                localUri: this.state.image,
                user: this.state.user})
      .then(ref => {
        this.setState({body: '', image: null, publishing: false});
        this.props.navigation.goBack();
      })
      .catch(error => {
        alert(error);
      })
  };

  renderPostButton(){
    if(this.state.user.name!==''&&!this.state.publishing){
      return(
        <TouchableOpacity
          style={styles.button}
          onPress={this.handlePost}>
          <Text style={{ color: '#fff', fontSize: 15 }}>Postar</Text>
        </TouchableOpacity>
      );
    }else{
      return(
        <TouchableOpacity
          style={styles.buttonOnHold}>
          <Text style={{ color: '#fff', fontSize: 15 }}>Carregando...</Text>
        </TouchableOpacity>
      );
    }
  }

  renderAvatar(){
    if(this.state.user.avatar){
      return(<Image source={{uri: this.state.user.avatar}} style={styles.profilePic}/>);
    }else{
      return(<Image source={require('../assets/user.png')} style={styles.profilePic}/>);
    }
  }

  renderImageContainer(){
    if(this.state.image || this.props.navigation.getParam('photo')){
      return(
        <TouchableOpacity onPress={this.pickImage}>
          <Image source={{ uri: this.state.image || this.props.navigation.getParam('photo') }}
                      style={{ width: 350, height: 300, borderRadius: 25 }}
                      resizeMode="contain"/>
        </TouchableOpacity>
      );
    }else{
      return(
        <TouchableOpacity onPress={this.pickImage}>
          <View style={styles.imageOnHold}>
            <Text style={{color:'#ccc'}}>Carregue uma imagem</Text>
          </View>
        </TouchableOpacity>
      );
    }
  }

  render() {
    LayoutAnimation.easeInEaseOut();

    return (
      <ScrollView style={styles.container}>
      <View style={{alignItems:'center'}}>
      <Header title='Post' navigation={this.props.navigation} arrowBack={false}/>
      <View style={styles.inputContainer}>
        {this.renderAvatar()}
        <TextInput
          style={{flex:1}}
          autoFocus={false}
          multiline={true}
          numberOfLines={4}
          placeholder="O que você deseja compartilhar?"
          onChangeText={text => this.setState({body: text})}
          value={this.state.body}
          />
        <TouchableOpacity style={{marginTop: 20}} onPress={() => {
          this.setState({ image: null });
          this.props.navigation.navigate('Cam')}
        }>
          <Icon name='md-camera' size={30} color='#ccc' />
        </TouchableOpacity>
      </View>

      {this.renderImageContainer()}

      {this.renderPostButton()}
      </View>
      </ScrollView>
    )
  }
}

const AppNavigator = createStackNavigator({
  Post: {
    screen: Post,
    navigationOptions: {
      tabBarLabel: '',
      title: '',
      headerShown: false,
    }
  }
  }
);

export default createAppContainer(AppNavigator);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  inputContainer: {
    padding: 32,
    flexDirection: 'row',
  },
  profilePic: {
    marginRight: 10,
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  button: {
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ec5686',
    width: '90%',
    height: 40,
    borderRadius: 10,
  },
  buttonOnHold: {
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ccc',
    width: '90%',
    height: 40,
    borderRadius: 10,
  },
  imageOnHold: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 350,
    height: 300,
    borderRadius: 25,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#ccc',
  },
})
