import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert} from 'react-native'
import {Header} from './modules/header'
import { Ionicons } from '@expo/vector-icons';

import Fire from '../fire'
const firebase = require("firebase");
require("firebase/firestore");

export default class BookInfo extends React.Component {
  state = {
    info: this.props.navigation.getParam('info'),
    id: this.props.navigation.getParam('id'),
    adding:false
  }

  addBook = async () => {
    this.setState({adding: true});
    const uid = Fire.shared.uid;
    Fire.shared.firestore
      .collection("users")
      .doc(uid)
      .set({
        library: firebase.firestore.FieldValue.arrayUnion(this.state.id)
      },
      { merge: true })
      .then(() => {
          this.setState({adding: false});
          alert('Livro adicionado com sucesso');
      })
      .catch(error => {
          alert('Erro ao adicionar livro:', error);
      });
  };

  renderRating(rating){
    rating = rating==undefined ? 0 : rating;
    let stars = [];
    for(let i = 0; i < rating; i++){
      stars.push(
        <Ionicons key={i} name="md-star" size={20} color='#ffd700'/>
      );
    };
    for(let i = 0; i < 5-rating; i++){
      stars.push(
        <Ionicons key={i} name="md-star-outline" size={20} color='#ffd700'/>
      );
    };
    return stars;
  }

  renderAddButton(){
    return (
      <TouchableOpacity style={styles.button} onPress={() => this.addBook()}>
        <Text style={{color:'#fff', fontWeight:'400'}}>Adicionar a biblioteca</Text>
      </TouchableOpacity>
    )
  }

  render() {
    const {info} = this.state
    let authors = [], categories = [];
    if(info.authors)info.authors.forEach(author => authors.push(author, ', '));
    authors.pop();
    if(info.categories)info.categories.forEach(cat => categories.push(cat, ', '));
    categories.pop();
    return (
      <ScrollView style={styles.container}>
        <View style={{alignItems:'center'}}>
        <Header title='' navigation={this.props.navigation} arrowBack={true}/>
        <Image source={{uri: info.imageLinks.smallThumbnail}}
                      style={{ width: 250, height: 300, marginTop:10 }}
                      resizeMode="contain"/>
        <Text style={{padding:5, fontSize: 20, marginTop:10}}>{info.title}</Text>
        <Text style={{padding:15, marginTop: 10}}>{authors.length>1 ? 'Autores: ' : 'Autor: '}{authors}</Text>
        <View style={{flexDirection:'row', marginTop:10}}>
          <Text>Avaliação: </Text>
          {this.renderRating(info.averageRating)}
          <Text style={{marginLeft:5}}>{info.averageRating}</Text>
        </View>

        <View style={{width:'100%', marginTop:10, padding:15}}>
          <Text>Editora: {info.publisher}</Text>
          <Text>Data de publicação: {info.publishedDate}</Text>
          <Text>Número de páginas: {info.pageCount}</Text>
          <Text>Categoria: {info.categories}</Text>
          <Text>Linguagem: {info.language}</Text>
        </View>

        <View style={styles.description}>
          <Text style={{fontSize:17, fontWeight:'500'}}>Descrição:</Text>
          <Text>{info.description}</Text>
        </View>
        {this.renderAddButton()}
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  description: {
    width:'100%',
    padding:15,
    borderBottomColor:'#ccc',
    borderBottomWidth:0.5,
    borderTopColor:'#ccc',
    borderTopWidth:0.5,
    marginTop:20,
  },
  button: {
    marginTop:10,
    width:'50%',
    height:40,
    backgroundColor:'#5ac18e',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius:10,
  }
})
