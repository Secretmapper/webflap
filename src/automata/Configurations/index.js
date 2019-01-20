import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default function Configurations() {
  const configurations = ['a', 'b']

  return (
    <View style={styles.container}>
      {configurations.map(config => (
        <View key={config} style={styles.config}>
          <Text>q0</Text>
          <Text>string</Text>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    minHeight: 150
  },
  config: {
    borderWidth: 1,
    borderLeftWidth: 0,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    width: 150
  }
})
