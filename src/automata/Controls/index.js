import React from 'react'
import { StyleSheet, Button, View } from 'react-native'

export default function Controls(props) {
  return (
    <View style={styles.container}>
      <Button title="Play" onPress={() => {}} />
      <Button title="Next" onPress={props.onNext} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row'
  }
})
