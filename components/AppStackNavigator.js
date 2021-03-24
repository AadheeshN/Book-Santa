import * as React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import BookDonateScreen from '../screens/BookDonateScreen';
import RecieverDetailsScreen from '../screens/RecieverDetailsScreen';

export const AppStackNavigator = createStackNavigator({
    bookDonateList : {screen : BookDonateScreen, 
    navigationOptions : {
        headerShown: false,
    }},
    
    RecieverDetails : {screen : RecieverDetailsScreen, 
        navigationOptions : {
            headerShown: false,
        }},
},
    {
        initialRouteName: 'bookDonateList',
    }
)