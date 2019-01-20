import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default function Configurations(props) {
  return (
    <View style={styles.container}>
      {props.configurations.map(config => (
        <View key={config.hash} style={styles.config}>
          <Text>{config.state.data.label}</Text>
          <Text>
            <Text style={styles.processed}>{getProcessedStr(config)}</Text>
            <Text style={styles.unprocessed}>{config.unprocessed}</Text>
          </Text>
        </View>
      ))}
    </View>
  )
}

// TODO: put this in a helper
const getProcessedStr = config =>
  config.input.substr(0, config.input.length - config.unprocessed.length)

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
  },
  processed: {
    color: 'green'
  },
  unprocessed: {
    color: 'red'
  }
})
