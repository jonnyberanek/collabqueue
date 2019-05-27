import React from 'react'
import PropTypes from 'prop-types'

import { View, Text } from 'react-native'

class SongInfoListItem extends React.Component {

  constructor(props){
    super(props)
    console.log(props);
  }

  render () {
    console.log(this.props);
    const {title, author, album} = this.props;
    return(
      <View style={{margin:5, borderRadius: 5, backgroundColor: "lightgray", padding: 10}}>
        <Text>{title}</Text>
        <Text>{author}</Text>
        <Text>{album}</Text>
      </View>
    )
  }
}

export default SongInfoListItem;
