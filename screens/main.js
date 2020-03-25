import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator, createMaterialTopTabNavigator } from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import Profile from './profile'
import Feed from './feed'
import Explore from './explore'
import Library from './library'
import Post from './post'

const mainNavigation = createMaterialTopTabNavigator({
  Feed: {
        screen: Feed,
        navigationOptions: {
          tabBarLabel: '',
          title: '',
        },
      },
  Explore: {
        screen: Explore,
        navigationOptions: {
          tabBarLabel: '',
          title: '',
        },
      },
 Post: {
        screen: Post,
        navigationOptions: {
          tabBarLabel: '',
          title: '',
        },
      },
  Library: {
        screen: Library,
        navigationOptions: {
          tabBarLabel: '',
          title: '',
        },
      },
  Profile: {
        screen: Profile,
        navigationOptions: {
          title: '',
          tabBarLabel: '',
        },
      },
},
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Feed') {
          iconName = `md-home`;
        } else if (routeName === 'Explore') {
          iconName = `md-search`;
        }
        else if (routeName === 'Library') {
          iconName = `md-book`;
        }
        else if (routeName === 'Profile') {
          iconName = `md-person`;
        }
        else return <Icon name='md-add' size={30} color='#ec5686'/>;
        return <Icon name={iconName} size={30} color={tintColor}/>;
      },
    }),
    tabBarPosition: 'bottom',
    tabBarOptions: {
      activeTintColor: '#ec5686',
      inactiveTintColor: 'gray',
      style: {
        backgroundColor:'#fff',
        height: 50,
      },
      indicatorStyle: {
        height: 0
      },
      showIcon: true,
    },
    initialRouteName: 'Feed',
});

export default createAppContainer(mainNavigation);
