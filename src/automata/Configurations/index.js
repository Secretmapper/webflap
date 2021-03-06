import React, { useRef, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { isConfigAccepted } from '../helpers'
import useHover from '../../core/hooks/useHover'
import Tape from '../Tape'

export default function Configurations(props) {
  return (
    <View style={styles.container}>
      {props.rejected.map(config => (
        <Config
          rejected
          type={props.type}
          key={config.hash}
          config={config}
          onHover={props.onConfigHover}
          finalStates={props.finalStates}
        />
      ))}
      {props.configurations.map(config => (
        <Config
          type={props.type}
          key={config.hash}
          config={config}
          onHover={props.onConfigHover}
          finalStates={props.finalStates}
        />
      ))}
    </View>
  )
}

function Config(props) {
  const touchableRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  useHover(touchableRef, hovering => {
    setIsHovered(hovering)
    props.onHover(props.config, hovering)
  })

  return (
    <View
      ref={touchableRef}
      style={[
        styles.config,
        !!isHovered && styles.configHovered,
        props.rejected && styles.configRejected,
        isConfigAccepted(props.finalStates, props.config) && styles.configFinal
      ]}
    >
      <Text>{props.config.state.data.label}</Text>
      {props.type === 'dfa' && (
        <Text>
          <Text style={styles.processed}>{getProcessedStr(props.config)}</Text>
          <Text style={styles.unprocessed}>{props.config.unprocessed}</Text>
        </Text>
      )}
      {props.type === 'tm' && (
        <Tape tape={props.config.tape} head={props.config.head} />
      )}
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
    minHeight: 50
  },
  configHovered: {
    borderColor: 'rgba(0, 0, 0, 0.15)',
    boxShadow: '0 3px 9px 0 rgba(46, 50, 60, .09)'
  },
  configRejected: {
    backgroundColor: '#ffebee'
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
