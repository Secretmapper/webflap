import React from 'react'
import { StyleSheet, Button, Text, View } from 'react-native'

export function Instructions(props) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        WebFLAP is a modern finite automaton maker and visualizer
      </Text>
      <Text style={styles.text}>
        Create a node by clicking anywhere on the canvas
      </Text>
      <Text style={styles.text}>Drag between two nodes to create an edge</Text>
      <Text style={styles.text}>
        Long press/hold on a node/edge to set their labels
      </Text>
      <Text style={styles.textBottom}>
        You can view these instructions again at any time by clicking 'How to
        use' on the left
      </Text>
      <Text style={styles.actions}>
        <Button title="Start Editing" onPress={props.onClose} />
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {},
  heading: {
    textAlign: 'center',
    fontSize: 18,
    paddingTop: 4,
    paddingBottom: 16
  },
  text: {
    marginBottom: 8
  },
  textBottom: {
    marginBottom: 16
  },
  actions: {
    textAlign: 'center'
  }
})

export default Instructions
