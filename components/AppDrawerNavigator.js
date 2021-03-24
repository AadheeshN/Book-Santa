import * as React from 'react';
import { AppTabNavigator } from './AppTabNavigator';
import { createDrawerNavigator } from 'react-navigation-drawer';
import  CustomSideBarMenu  from './CustomSideBarMenu';
import SettingsScreen from '../screens/SettingsScreen';
import MyDonationScreen from '../screens/MyDonationsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ReceivedBooks from '../screens/MyReceivedBooksScreen';

export const AppDrawerNavigator = createDrawerNavigator({
    Home: {screen: AppTabNavigator},
    MyDonations: {screen: MyDonationScreen},
    Settings: {screen: SettingsScreen},
    Notifications: {screen: NotificationsScreen},
    ReceivedBooks: {screen: ReceivedBooks},
},
  {
    contentComponent: CustomSideBarMenu
  },
  {
      initialRouteName: 'Home',
  }
)