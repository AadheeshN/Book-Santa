import * as React from 'react';
import { Image, StyleSheet } from 'react-native';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import DonateScreen from '../screens/BookDonateScreen';
import RequestScreen from '../screens/BookRequestScreen';
import { AppStackNavigator } from '../components/AppStackNavigator';

export const AppTabNavigator = createBottomTabNavigator({
    DonateBooks : {
        screen: AppStackNavigator,
        navigationOptions: {
            tabBarIcon: <Image source = {require('../assets/request-book.png')}  style = {{ width: 20, height: 20 }}/>, 
            tabBarLabel: 'Donate Books'
        } 
    },

    RequestBooks : {
        screen: RequestScreen,
        navigationOptions: {
            tabBarIcon: <Image source = {require('../assets/request-list.png')}  style = {{ width: 20, height: 20 }}/>, 
            tabBarLabel: 'Request Books'
        } 
    },

})