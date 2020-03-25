import React from 'react'
import {View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Image, ActivityIndicator} from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import {firebaseConfig} from '../firebaseKeys'
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

class Explore extends React.Component {
  state = {
    search: '',
    searching:false,
    results: null,
  }

  // componentDidMount(){
  //   this.handleSearch();
  // }

  handleSearch = async () => {
    this.setState({searching:true});
    const result = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${this.state.search}&key=${firebaseConfig.apiKey}`);
    const json = await result.json();
    this.setState({searching:false});
    this.setState({results: json.items});
    console.log(this.state.results);
  }

  renderItem(item){
    let info = item.volumeInfo;
    let authors = [];
    if(info.authors)info.authors.forEach(author => authors.push(author, ', '));
    authors.pop();
    return (
      <TouchableOpacity style={styles.bookCard}
                        onPress={() =>
                          this.props.navigation.navigate('BookInfo', {info:info, id:item.id})
                        }>
        {this.renderThumbnail(info)}
        <View style={{width:'60%',padding:10}}>
          <Text style={{fontSize: 20}}>{info.title}</Text>
          <Text style={{marginTop: 5}}>{authors.length>1 ? 'Autores: ' : 'Autor: '}{authors}</Text>
          <View style={{flexDirection:'row', marginTop: 5}}>
            {this.renderRating(info.averageRating)}
          </View>
        </View>
      </TouchableOpacity>
    )
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

  renderSearchList(){
    let {results} = this.state;
    if(results){
      if(!results[0].error){
        return (
          <FlatList
            data={results}
            renderItem={({ item }) => this.renderItem(item)}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
          />
        )
      }else{
        return (
          <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <Text style={{color:'red'}}>Erro ao carregar busca</Text>
          </View>
        )
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            style={{width:'80%', height:50, marginLeft:'5%', fontSize:20}}
            placeholder="Pesquisar livro por nome"
            onChangeText={search => this.setState({search: search})}
            value={this.state.search}
            onSubmitEditing={this.handleSearch}
          />
          <TouchableOpacity  style={{position:'absolute', right:20, marginRight:10}} onPress={this.handleSearch}>
            <Ionicons name="ios-search" size={30} color='#c0c0c0'/>
          </TouchableOpacity>
        </View>

        {this.state.searching && <ActivityIndicator style={{position:'absolute', top:'45%', left:'45%'}} size="large" />}
        {this.renderSearchList()}
      </View>
    )
  }
}

import BookInfo from './bookInfo'

const AppNavigator = createStackNavigator({
  Explore: {
    screen: Explore,
    navigationOptions: {
      tabBarLabel: '',
      title: '',
      headerShown: false,
    },
  },
  BookInfo: {
    screen: BookInfo,
    navigationOptions: {
      tabBarLabel: '',
      title: '',
      headerShown: false,
    },
  },
});

export default createAppContainer(AppNavigator);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  searchContainer: {
    width:'100%',
    height:50,
    flexDirection:'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomColor: '#ccc',
    borderBottomWidth: 0.5,
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
  }
})
