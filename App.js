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

// import { HomeScreen, HostDashboardScreen } from "./components/screens/"
import HomeScreen from "./components/screens/HomeScreen"
import HostDashboardScreen from "./components/screens/HostDashboardScreen"
import GuestJoinScreen from "./components/screens/GuestJoinScreen"
import GuestDashboardScreen from "./components/screens/GuestDashboardScreen"
import SongInfoListItem from "./components/views/SongInfoListItem";


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

//const App = <HomeScreen/>;

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
