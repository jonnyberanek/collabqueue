import React from 'react'
import PropTypes from 'prop-types'

import { View, Button } from 'react-native'

import Screen from 'components/abstracts/Screen'

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
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style = {styles.screen}>
        <Button
          title="Start a Party!"
          onPress={() => navigate("HostDashboard", { code: "01234" })}
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
