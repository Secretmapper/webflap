import React from 'react'
import { StyleSheet, View } from 'react-native'

export default function Layout(props) {
  return (
    <View style={styles.container}>
      <View style={styles.side}>{props.side}</View>
      <View style={styles.main}>{props.main}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row'
  },
  main: {
    flexDirection: 'column',
    flex: 1
  },
  side: {
    flexDirection: 'column',
    flexShrink: 0,
    width: 250,
    zIndex: 2
  }
})
