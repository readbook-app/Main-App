import React from 'react'
import {View, Text, StyleSheet, Image, TouchableOpacity, ScrollView} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import Fire from '../fire'

export default class Profile extends React.Component {
  constructor(){
    super();
    console.ignoredYellowBox = ['Setting a timer'];
  }

  state = {
    user: {
      name: '',
      email: '',
      avatar: null,
    },
  }

  unsubscribe: null;

  async componentDidMount() {
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.getUserData()
    })
  }

  getUserData(){
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
    this.focusListener.remove()
  }

  renderAvatar(){
    if(this.state.user.avatar){
      return(<Image source={{uri: this.state.user.avatar}} style={{width: 100, height: 100, borderRadius: 50, marginTop: 50}}/>);
    }else{
      return(<Image source={require('../assets/user.png')} style={{width: 100, height: 100, borderRadius: 50, marginTop: 50}}/>);
    }
  }

  render() {
    return (
      <ScrollView>
      <View style={styles.container}>
      {this.renderAvatar()}
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 20 }}>{this.state.user.name}</Text>
      <Text style={{ fontSize: 15, marginBottom: 20 }}>{this.state.user.email}</Text>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={styles.infoCard}><Text style={{ fontWeight: 'bold' }}>{'1160'}</Text><Text>Seguindo</Text></View>
      <View style={styles.infoCard}><Text style={{ fontWeight: 'bold' }}>{'3216'}</Text><Text>Seguidores</Text></View>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={styles.infoCard}><Text style={{ fontWeight: 'bold' }}>{'2'}</Text><Text>Lendo</Text></View>
      <View style={styles.infoCard}><Text style={{ fontWeight: 'bold' }}>{'53'}</Text><Text>Lidos</Text></View>
      </View>

      <View style={{marginTop: '30%'}}/>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity style={{...styles.collection, backgroundColor: '#ec5686'}}
        onPress={() => this.props.navigation.navigate('Library')}>
          <Text style={{color: '#fff', fontSize: 20}}>Quero Ler</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{marginTop: 10}}
        onPress={() => this.props.navigation.navigate('Explore')}>
          <Icon name='md-add-circle' size={60} color='#ec5686' />
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity style={{...styles.collection, backgroundColor: '#ffa242'}}
        onPress={() => this.props.navigation.navigate('Library')}>
          <Text style={{color: '#fff', fontSize: 20}}>Lendo</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Explore')}>
          <Icon name='md-add-circle' size={60} color='#ffa242' />
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity style={{...styles.collection, backgroundColor: '#9bc2db'}}
        onPress={() => this.props.navigation.navigate('Library')}>
          <Text style={{color: '#fff', fontSize: 20}}>Lidos</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Explore')}>
          <Icon name='md-add-circle' size={60} color='#9bc2db' />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={{marginTop: 20,
                                marginBottom: 20,
                                padding:10,
                                borderRadius:5,
                                borderColor:'#ccc',
                                borderWidth: 0.5}}
                        onPress={() => Fire.shared.signOut()}>
        <Text style={{color:'#088da5', fontSize:20, fontWeight:'900'}}>Log Out</Text>
      </TouchableOpacity>
      </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor:'#fff',
  },
  infoCard: {
    alignItems: 'center',
    width: '30%',
    marginTop: 20
  },
  collection: {
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    marginRight: 10,
    width: '70%',
  },
})
