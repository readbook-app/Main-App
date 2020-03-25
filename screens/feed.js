import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, ScrollView, FlatList, LayoutAnimation} from 'react-native'
import {Header} from './modules/header'
import Fire from '../fire'
import moment from 'moment'
import { Ionicons } from '@expo/vector-icons';

const firebase = require("firebase");
require("firebase/firestore");

export default class Feed extends React.Component {
  state = {
    posts: [],
    loadingPosts: false,
  }
  unsubscribe: null;

  componentDidMount(){
    let arr = []
    this.unsubscribe = Fire.shared.firestore
      .collection("posts")
      .onSnapshot(posts => {
        posts.forEach(post => {
          arr.push(post.data());
        });
        this.setState({posts:arr});
        this.setState({loadingPosts: true});
        arr = [];
      })
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  renderItem(post){
    return(
      <View key={post.uid} style={styles.postCard}>
        <View style={styles.postHeader}>
          <Image source={{uri:post.avatar}} style={{width:30, height:30, borderRadius: 30, padding: 25}} />
          <View>
            <Text style={{ padding: 5}}>{post.name}</Text>
            <Text style={{color:'#ccc', marginLeft: 5}}>{moment(post.timestamp).fromNow()}</Text>
          </View>
        </View>
        <Text style={styles.postBody}>{post.text}</Text>
        <Image source={{uri: post.image}} style={styles.postImage} resizeMode="contain"/>
        <View style={{flexDirection:'row', marginTop:10}}>
          <Ionicons name="md-heart-empty" size={30} color='#c0c0c0' style={{marginRight:10}}/>
          <Ionicons name="md-chatboxes" size={30} color='#c0c0c0'/>
          <Ionicons name="md-bookmark" size={30} style={{position:'absolute', right:10}} color='#c0c0c0'/>
        </View>
      </View>
    );
  }

  handleRenderLoading(){
    if(!this.state.loadingPosts){
      return (
        <View style={{flex: 1, alignItems:'center', justifyContent:'center'}}>
          <Text style={{color:'#666', fontWeight:'900'}}>Carregando posts...</Text>
        </View>
      );
    }else{
      return(
        <FlatList
          data={this.state.posts}
          renderItem={({ item }) => this.renderItem(item)}
          keyExtractor={item => item.text}
          showsVerticalScrollIndicator={false}
        />
      );
    }
  }

  render() {
    LayoutAnimation.easeInEaseOut();
    return (
      <SafeAreaView style={styles.container}>
        <Header title='Feed' arrowBack={false}/>
        {this.handleRenderLoading()}
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent:'center',
    backgroundColor:'#eee',
  },
  loadingContainer: {
    justifyContent: 'center'
  },
  postCard: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 10,
    marginLeft: '2.5%',
    borderRadius: 10,
    borderColor: '#ccc',
    width:'95%',
  },
  postHeader: {
    flexDirection: 'row',
  },
  postBody: {
    padding: 10,
    marginTop: 5,
    marginBottom: 5
  },
  postImage: {
    width: '100%',
    height: 300,
    marginTop: 10,
    borderRadius: 25,
  }
})
