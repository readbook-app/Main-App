import React from 'react'
import {View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {Header} from './modules/header'
import Icon from 'react-native-vector-icons/Ionicons';
import * as firebase from 'firebase'

export default class SignIn extends React.Component {
  state = {
    email: '',
    password: '',
    errorMessage: null
  }

  handleSignIn = () => {
    const { email, password } = this.state
    firebase
      .auth()
      .signInWithEmailAndPassword(email.trim(), password)
      .then(() => this.props.navigation.navigate('Loading'))
      .catch(error => this.setState({ errorMessage: error.message }))
  }

  render() {
    return (
      <ScrollView style={styles.outerContainer}>
      <KeyboardAwareScrollView >
      <Header title='' navigation={this.props.navigation} arrowBack={true} />
      <View style={styles.container}>
        <Text style={styles.greeting}>{'Oi!!\nBem vindo de volta'}</Text>
        {this.state.errorMessage &&
          <Text style={{ marginTop: 10, color: 'red', fontSize: 20, marginLeft: '5%', textAlign: 'center' }}>
            {this.state.errorMessage}
          </Text>}

          <Text style={styles.placeholder}>Endereço de email</Text>
          <TextInput
            autoCapitalize="none"
            style={styles.textInput}
            onChangeText={email => this.setState({ email })}
            value={this.state.email}
          />
          <Text style={styles.placeholder}>Senha</Text>
          <TextInput
            secureTextEntry
            autoCapitalize="none"
            style={styles.textInput}
            onChangeText={password => this.setState({ password })}
            value={this.state.password}
          />

          <TouchableOpacity
          style={styles.button}
          onPress={this.handleSignIn}>
            <Text style={{ color: '#fff', fontSize: 15 }}>Entrar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ alignItems: 'center', marginTop: 20 }}
                            onPress={()=>this.props.navigation.navigate('SignUp')}>
            <Text>AInda não possui uma conta? <Text style={{ color: 'red' }}>Registre-se</Text></Text>
          </TouchableOpacity>
          </View>
      </KeyboardAwareScrollView>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: '#fff',
    flex: 1,
  },
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
  },
})
