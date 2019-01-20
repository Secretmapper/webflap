import React, { useRef } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { isConfigAccepted } from '../helpers'
import useHover from '../../core/hooks/useHover'

export default function Configurations(props) {
  return (
    <View style={styles.container}>
      {props.configurations.map(config => (
        <Config
          key={config.hash}
          config={config}
          finalStates={props.finalStates}
        />
      ))}
    </View>
  )
}

function Config(props) {
  const touchableRef = useRef(null)
  const isHovered = useHover(touchableRef)

  return (
    <View
      ref={touchableRef}
      style={[
        styles.config,
        !!isHovered && styles.configHovered,
        isConfigAccepted(props.finalStates, props.config) && styles.configFinal
      ]}
    >
      <Text>{props.config.state.data.label}</Text>
      <Text>
        <Text style={styles.processed}>{getProcessedStr(props.config)}</Text>
        <Text style={styles.unprocessed}>{props.config.unprocessed}</Text>
      </Text>
    </View>
  )
}

// TODO: put this in a helper
const getProcessedStr = config =>
  config.input.substr(0, config.input.length - config.unprocessed.length)

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column'
  },
  config: {
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 4,
    borderWidth: 1,
    marginBottom: 8,
    padding: 8,
    cursor: 'pointer',
    height: 50
  },
  configHovered: {
    borderColor: 'rgba(0, 0, 0, 0.15)',
    boxShadow: '0 3px 9px 0 rgba(46, 50, 60, .09)'
  },
  configFinal: {
    backgroundColor: '#ccff90'
  },
  processed: {
    color: 'green'
  },
  unprocessed: {
    color: 'red'
  }
})
