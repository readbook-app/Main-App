import React from 'react'
import {View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Image, ScrollView, ActivityIndicator} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import * as firebase from 'firebase'
import Icon from 'react-native-vector-icons/Ionicons';
import UserPermissions from '../utilities/user-permissions'
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker'
import Fire from '../fire'

export default class SignUp extends React.Component {
  state = {
    user: {
      name: '',
      email: '',
      password: '',
      confirmedPassword:'',
      avatar: null,
    },
    hasPermissions: null,
    creatingAccount:false,
    errorMessage: null
  }

  async componentDidMount() {
      const camera = await Permissions.askAsync(Permissions.CAMERA);
      const audio = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
      const cameralRoll = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      const hasCameraPermission = (camera.status === 'granted' && audio.status === 'granted' && cameralRoll.status === 'granted');

      this.setState({ hasCameraPermission });
  };

  setAvatar = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    if (!result.cancelled) {
      this.setState({user:{...this.state.user, avatar: result.uri }});
    }
  };

  handleSignUp = () => {
    this.setState({errorMessage:null});
    if(this.state.user.name.trim()!==''){
      if(this.state.user.email.trim()!==''){
        if(this.state.user.password.trim()!==''){
          if(this.state.user.password.trim()==this.state.user.confirmedPassword.trim()){
            this.setState({creatingAccount:true});
            Fire.shared.addUser(this.state.user);
            this.setState({creatingAccount:false});
          }else {
            this.setState({errorMessage:'A senha confirmada deve corresponder com a primeira'});
          }
        }else{
          this.setState({errorMessage:'Por favor, digite uma senha'});
        }
      }else{
        this.setState({errorMessage:'Por favor, digite seu email'});
      }
    }else{
      this.setState({errorMessage:'Por favor, digite seu nome'});
    }
  }

  render() {
    return (
      <ScrollView style={styles.container}>
      <KeyboardAwareScrollView >
        <Text style={styles.greeting}>{'Bem vindo!\nCadastre-se para começar a leitura'}</Text>
        {this.state.errorMessage &&
          <Text style={{ marginTop: 10, color: 'red', fontSize: 20, marginLeft: '5%', textAlign: 'center' }}>
            {this.state.errorMessage}
          </Text>}

        <TouchableOpacity style={{ alignItems: 'center', marginTop: 20, marginBottom: 10 }}
                          onPress={this.setAvatar}>
          <View style={styles.avatar}>
          {
            this.state.user.avatar ?
              <Image source={{uri: this.state.user.avatar}} style={{width:100, height:100, borderRadius:50}} />
              : <Icon name='md-add' size={30} color='#fff' />
          }
          </View>
        </TouchableOpacity>

        <Text style={styles.placeholder}>Nome</Text>
        <TextInput
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={name => this.setState({user:{...this.state.user, name }})}
          value={this.state.name}
        />
        <Text style={styles.placeholder}>Endereço de email</Text>
        <TextInput
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={email => this.setState({user:{...this.state.user, email }})}
          value={this.state.email}
        />
        <Text style={styles.placeholder}>Senha</Text>
        <TextInput
          secureTextEntry
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={password => this.setState({user:{...this.state.user, password }})}
          value={this.state.password}
        />
        <Text style={styles.placeholder}>Confirmar senha</Text>
        <TextInput
          secureTextEntry
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={confirmedPassword => this.setState({user:{...this.state.user, confirmedPassword }})}
          value={this.state.confirmedPassword}
        />

        <TouchableOpacity
        style={styles.button}
        onPress={this.handleSignUp}>
          <Text style={{ color: '#fff', fontSize: 15 }}>Registrar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center', marginTop: 20 }}
                          onPress={()=>this.props.navigation.navigate('SignIn')}>
          <Text>Já possui uma conta? <Text style={{ color: 'red' }}>Entre</Text></Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    padding: 20,
  },
  greeting: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: '400',
    textAlign: 'center',
  },
  avatar: {
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    borderRadius: 100/2,
  },
  placeholder: {
    marginTop: 20,
    marginLeft: '5%',
    color: '#a9b7ae',
    textTransform: 'uppercase'
  },
  textInput: {
    marginLeft: '5%',
    padding: 3,
    height: 40,
    width: '90%',
    fontSize: 15,
    borderColor: '#a9b7ae',
    borderRadius: 5,
    borderWidth: 1,
    marginTop: 8
  },
  button: {
    marginTop: 20,
    marginLeft: '5%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ec5686',
    width: '90%',
    height: 40,
    borderRadius: 10,
  },
  bottomText: {
    alignItems: 'center',
    marginTop: 10
  }
})
