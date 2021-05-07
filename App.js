
import * as React from 'react';
import { StyleSheet, Text, View ,TextInput} from 'react-native';
import TransactionScreen from './screen/transactionScreen';
import SearchScreen from './screen/searchScreen';
import LoginScreen from './screen/loginScreen';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createAppContainer} from 'react-navigation'
export default class App extends React.Component {
  render(){
  return (
   <AppContainer/>
  );
  }
}
const BottomNavigator=createBottomTabNavigator({
TransactionScreen:{screen:TransactionScreen},
SearchScreen:{screen:SearchScreen}
})
const AppContainer=createAppContainer(BottomNavigator)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
