import React from 'react'
import { StyleSheet, Button, TextInput, View } from 'react-native'

export default function Controls(props) {
  return (
    <View>
      <View style={styles.textWithButtonContainer}>
        <TextInput
          value={props.inputString}
          onChange={props.onInputStringChange}
          style={styles.input}
          placeholder="Input String"
          autoFocus
        />
        <Button style={styles.control} title="GO" onPress={props.onPlay} />
      </View>
      {props.isStepByStepStarted && (
        <View style={styles.controls}>
          <Button style={styles.control} title="Reset" onPress={props.onPlay} />
          <View style={styles.controlGap} />
          <Button style={styles.control} title="Next" onPress={props.onNext} />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  textWithButtonContainer: {
    flexDirection: 'row',
    marginBottom: 8
  },
  input: {
    backgroundColor: 'rgba(240, 240, 240, 1)',
    borderColor: 'rgba(0,0,0,0.2)',
    borderWidth: 1,
    fontSize: 14,
    outlineStyle: 'none',
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
