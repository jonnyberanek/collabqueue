import React from 'react'
import PropTypes from 'prop-types'

import { View, Button } from 'react-native'

import Screen from 'components/abstracts/Screen'

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



class HomeScreen extends Screen {
  static navigationOptions = {
    title: "Welcome"
  };

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
  }
}

export default HomeScreen;
