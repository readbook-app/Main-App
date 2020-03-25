import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet, Image } from 'react-native'
import * as firebase from 'firebase'
import Fire from '../fire'
import { withNavigation } from 'react-navigation';

class Loading extends React.Component {
  componentDidMount() {
    this.handleAuth();
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      this.handleAuth();
    });
  }

  handleAuth(){
    firebase.auth().onAuthStateChanged(user => {
      if(user) this.props.navigation.navigate('Main', {title:''})
      else this.props.navigation.navigate('SignUp')
    })
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={{width: 100, height: 100, marginBottom: 30}}
          source={require('../assets/book.png')}
        />
        <ActivityIndicator size="large" />
        <Text style={{ fontSize: 20, marginTop: 20 }}>Carregando sua biblioteca...</Text>
      </View>
    )
  }
}

export default withNavigation(Loading);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  }
})
