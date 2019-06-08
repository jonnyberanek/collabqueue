import React from 'react'
import PropTypes from 'prop-types'

import { View, Text, TextInput, Button } from 'react-native'

import Screen from 'components/abstracts/Screen'

import SpotifyApiCaller from "groupdj/controllers/SpotifyApiCaller"

import * as firebase from "firebase/app";
import "firebase/firestore";

const styles = {
  screen: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  }
}



class GuestJoinScreen extends Screen {
  state={}
  static navigationOptions = {
    title: "Join a party"
  };

  constructor(props){
    super(props)
    var spotify = new SpotifyApiCaller();
    spotify.searchTrack("cowboy").then((r) => {console.log(r);})
    this.db = firebase.firestore();
  }

  _clickJoin = async () => {
    const code = this.state.partyCode.toLowerCase();
    const docs = await this.db.collection('parties').where('code', '==', code).get()
    if(!docs.empty){
      this.props.navigation.navigate("HostDashboard", {code})
    }


  }

  render () {
    return (<View style={styles.screen}>
      <TextInput
        ref={(elem) => { this.code = elem }}
        onChangeText={(code) => this.setState({partyCode: code})}
        value={this.state.partyCode}
        placeholder="Enter a party code!"
      />
    <Button title="Join!" onPress={this._clickJoin}></Button>
      <Button title="Scan a party code"></Button>
    </View>)
  }
}

export default GuestJoinScreen;
