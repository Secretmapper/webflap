import React from 'react'
import { StyleSheet, View } from 'react-native'
import Editor from './Editor'
import Configurations from './Configurations'

export default function Automata() {
  return (
    <View style={styles.container}>
      <Editor />
      <Configurations />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
