import React from 'react'
import { StyleSheet, Button, TextInput, View } from 'react-native'

export default function Controls(props) {
  return (
    <View style={styles.container}>
      <TextInput
        value={props.inputString}
        onChange={props.onInputStringChange}
        style={styles.input}
        placeholder="Input String"
      />
      <Button title="Play" onPress={props.onPlay} />
      <Button title="Next" onPress={props.onNext} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row'
  },
  input: {
    outline: 'none'
  }
})
