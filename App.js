import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

//IMPORT SCREENS
import Loading from './screens/loading'
import SignIn from './screens/signin'
import SignUp from './screens/signup'
import Main from './screens/main'
import Cam from './screens/cam'

const AppNavigator = createStackNavigator(
  {
    Loading: {
        screen: Loading,
        navigationOptions: {
          headerShown: false,
        },
      },
    SignIn: {
        screen: SignIn,
        navigationOptions: {
          headerShown: false,
        },
      },
    SignUp: {
        screen: SignUp,
        navigationOptions: {
          headerShown: false,
        },
      },
    Main: {
        screen: Main,
        navigationOptions: {
          headerShown: false,
        },
      },
    Cam: {
        screen: Cam,
        navigationOptions: {
          tabBarLabel: '',
          title: '',
          headerShown: false,
        },
      },
  },
  {
    initialRouteName: 'Loading',
  }
);

export default createAppContainer(AppNavigator);
