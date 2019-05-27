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

class GuestDashboardScreen extends Screen {
  static navigationOptions = {
    title: "Blah's Party"
  };
  render () {
    //todo: search bar and render search results
    return (<View style={styles.screen}></View>)
  }
}

/* list example for later
<FlatList
  data={[
    {key: 1, title: "x", author: "Boys"},
    {key: 2, title: "y", author: "Girls"},
    {key: 3, title: "z", author: "Cats"}
    ]}
  renderItem={(item, x) => {
    const {title, author} = item.item
      return <SongListInfoItem title={title} author={author} album={author}/>
    }
  }
/>

*/

export default GuestDashboardScreen;
