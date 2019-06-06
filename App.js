/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, Button, Modal, FlatList } from "react-native";
import { createStackNavigator, createAppContainer } from "react-navigation";


import HomeScreen from "screens/HomeScreen"
import HostDashboardScreen from "screens/HostDashboardScreen"
import GuestJoinScreen from "screens/GuestJoinScreen"
import GuestDashboardScreen from "screens/GuestDashboardScreen"
import SongInfoListItem from "views/SongInfoListItem";

import * as firebase from "firebase/app";

firebase.initializeApp(require("./firebase-info.js"))


const instructions = Platform.select({
  ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
  android:
    "Double tap R on your keyboard to reload,\n" +
    "Shake or press menu button for dev menu"
});


const MainNavigator = createStackNavigator({
  Home: { screen: HomeScreen },
  HostDashboard: { screen: HostDashboardScreen },
  GuestDashboastScreen: { screen: GuestDashboardScreen },
  GuestJoinScreen: {screen: GuestJoinScreen}
});

const App = createAppContainer(MainNavigator);

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});
