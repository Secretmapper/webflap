import React from 'react'
import { StyleSheet, Button, TextInput, View } from 'react-native'

export default function Controls(props) {
  return (
    <View>
      <TextInput
        value={props.inputString}
        onChange={props.onInputStringChange}
        style={styles.input}
        placeholder="Input String"
      />
      <View style={styles.controls}>
        <Button style={styles.control} title="Play" onPress={props.onPlay} />
        <View style={styles.controlGap} />
        <Button style={styles.control} title="Next" onPress={props.onNext} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'rgba(240, 240, 240, 1)',
    fontSize: 14,
    marginBottom: 4,
    outline: 'none',
    padding: 8
  },
  controls: {
    flexDirection: 'row',
    marginBottom: 8
  },
  controlGap: {
    width: 4
  }
})
