import React from 'react'
import {View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Image, ScrollView, ActivityIndicator} from 'react-native'
import {Header} from './modules/header'
import { Ionicons } from '@expo/vector-icons';
import {firebaseConfig} from '../firebaseKeys'
import Fire from '../fire'
const firebase = require("firebase");
require("firebase/firestore");

export default class Library extends React.Component {
  state = {
    ids: null,
    loading:true,
    gotData:false,
    library: [],
  }
  unsubscribe = null;

  componentDidMount(){
    this.getData();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getData(){
    this.setState({gotData:false});
    const uid = Fire.shared.uid;
    let ids = [];
    this.unsubscribe = Fire.shared.firestore
      .collection("users")
      .doc(uid)
      .onSnapshot(infos => {
        this.setState({ids: infos.data().library});
        if(this.state.ids){
          this.handleSearch();
          this.setState({gotData:true});
        }else{
          this.setState({loading:false});
          this.setState({gotData:false});
        }
      })
  }

  handleSearch = async () => {
    this.setState({loading:true});
    let library = [];
    for(let i = 0; i<this.state.ids.length; i++){
      let id = this.state.ids[i];
      let content = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}?&key=${firebaseConfig.apiKey}`);
      let result = await content.json();
      library.push(result);
    }
    this.setState({library: library});
    this.setState({loading:false});
  }

  renderItem(item){
    let info = item.volumeInfo;
    let authors = [];
    if(info.authors)info.authors.forEach(author => authors.push(author, ', '));
    authors.pop();
    return (
      <View style={styles.bookCard}>
        {this.renderThumbnail(info)}
        <View style={{width:'60%',padding:10}}>
          <Text style={{fontSize: 20}}>{info.title}</Text>
          <Text style={{marginTop: 5}}>{authors.length>1 ? 'Autores: ' : 'Autor: '}{authors}</Text>
          <View style={{flexDirection:'row', marginTop: 5}}>
            {this.renderRating(info.averageRating)}
          </View>
        </View>
      </View>
    )
  }

  renderLibrary(){
    let {library, gotData} = this.state;
    if(this.state.loading){
      return <ActivityIndicator style={{position:'absolute', top:'45%', left:'45%'}} size="large" />
    }else{
      if(gotData){
        if(!library[0].error){
          return (
            <FlatList
              data={library}
              renderItem={({ item }) => this.renderItem(item)}
              keyExtractor = { (item, index) => String(index)}
              showsVerticalScrollIndicator={false}
            />
          )
        }else{
          return (
            <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
              <Text style={{color:'red'}}>Erro ao carregar biblioteca</Text>
            </View>
          )
        }
      }else{
        return (
          <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <Text>Você ainda não possui nenhum livro em sua biblioteca</Text>
          </View>
        )
      }
    }
  }

  renderThumbnail(info){
    if(info.imageLinks!==undefined){
      return <Image source={{uri: info.imageLinks.smallThumbnail}}
                    style={{ width: 150, height: 200 }}
                    resizeMode="contain"/>;
    }else{
      return (
        <View style={{backgroundColor:'#ddd',
                      width:150,
                      height:200,
                      borderRadius:10,
                      justifyContent:'center',
                      alignItems:'center'}}>
          <Text style={{color:'#666', position:'absolute', left:'25%'}}>Foto não disponível :c</Text>
        </View>
      )
    }
  }

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

  render() {
    return (
      <View style={styles.container}>
        <Header title='Biblioteca' navigation={this.props.navigation} arrowBack={true} />
        {this.renderLibrary()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex:1,
  },
  bookCard: {
    width:'100%',
    flexDirection:'row',
    padding:15,
    borderBottomColor:'#ccc',
    borderBottomWidth:0.5,
    borderTopColor:'#ccc',
    borderTopWidth:0.5,
    marginTop:20,
  },
})
