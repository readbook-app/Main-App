import React,{Component} from 'react'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'
// import Constants from 'expo-constants';
import Icon from 'react-native-vector-icons/Ionicons';

export class Header extends Component {
  render() {
    return (
      <View style={styles.headerContainer}>
        {this.props.arrowBack &&
        <TouchableOpacity style={styles.back} onPress={() => this.props.navigation.goBack()}>
          <Icon name='md-arrow-back' size={30} />
        </TouchableOpacity>}
        <Text style={{fontSize:20, fontWeight:'600'}}>{this.props.title}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    width:'100%',
    height:50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderBottomColor: '#ccc',
    borderBottomWidth: 0.5,
    flexDirection: 'row',
  },
  back: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    left:0,
    width:80,
    height:40,
    padding:5,
  }
})
