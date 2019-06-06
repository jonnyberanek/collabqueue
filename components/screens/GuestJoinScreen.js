import React from 'react'
import PropTypes from 'prop-types'

import { View, Text, TextInput, Button } from 'react-native'

import Screen from 'components/abstracts/Screen'

const styles = {
  screen: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  }
}

class GuestJoinScreen extends Screen {
  static navigationOptions = {
    title: "Join a party"
  };
  render () {
    return (<View style={styles.screen}>
      <TextInput placeholder="Enter a party code!"></TextInput>
      <Button title="Join!"></Button>
      <Button title="Scan a party code"></Button>
    </View>)
  }
}

export default GuestJoinScreen;
