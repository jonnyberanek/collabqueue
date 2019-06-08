import React from 'react'
import PropTypes from 'prop-types'

import { View, Button } from 'react-native'

import Screen from 'components/abstracts/Screen'

import Spotify from "groupdj/controllers/Spotify"

import * as firebase from "firebase/app";
import "firebase/firestore";

const styles = {
  screen: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-evenly',
      alignItems: 'center'
  },
  buttons: {

  }
}

var s = new Spotify("a498abe489094bad89a2acf08d36b299", "user-read-private user-read-email", "https://us-central1-collabqueue.cloudfunctions.net/spotifyCallback");
var r = s.request('GET', 'https://api.spotify.com/v1/search', { q: "cowboy", type:'track'})
r.then((x) => {
  console.log(x);
}).catch((e) => {
  console.error(e);
})



class HomeScreen extends Screen {
  static navigationOptions = {
    title: "Welcome"
  };

  constructor(props){
    super(props)

  }

  _createParty = async () => {
    const db = firebase.firestore();

    const makeid = () => {
      var res = ""
      const pc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      for(var i = 0; i < 6; i++){ res += pc[Math.floor(Math.random()*pc.length)]}
      return res
    }

    var possibleCode = makeid();

    const parties = await db.collection('parties').get();

    const usedCodes = parties.docs.map((doc) => doc.data().code)
    while(usedCodes.some(c => c == possibleCode)){
      possibleCode = makeid();
    }

    const createdParty = await db.collection('parties').add({
      code: possibleCode,
      host_id: "xyz",
    })

    if(createdParty){
      this.props.navigation.navigate("HostDashboard", { code: possibleCode })
    }
    else{
      // TODO: notify user of error
    }


  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style = {styles.screen}>

        <Button
          title="Start a Party!"
          onPress={this._createParty}
        />
        <Button
          title="Join a Party!"
          onPress = { () => navigate("GuestJoinScreen")}
        />


    </View>
    );
    // return(
    //   <SpotifyWebView />
    // )
  }
}

export default HomeScreen;
