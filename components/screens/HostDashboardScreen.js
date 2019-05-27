import React from 'react'
import PropTypes from 'prop-types'
import { View, Text } from 'react-native'

import Screen from '../abstracts/Screen'

const styles = {
  screen: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  }
}

class HostDashboardScreen extends Screen {

  static navigationOptions = {
    title: "Your Party"
  };

  render () {
    const { state } = this.props.navigation
    return (<View style={styles.screen}>
      <Text>{state.params.code}</Text>
    </View>)
  }
}

export default HostDashboardScreen;
