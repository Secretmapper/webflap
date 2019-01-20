import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import Editor from './Editor'
import Configurations from './Configurations'
import Controls from './Controls'
import { step } from './helpers'
import { initialState, states, transitions } from './automata.fixtures'

const elements = [
  ...Array.from(states.values()).map(state => ({
    ...state,
    classes: [
      'dfa__state',
      initialState === state.data.id ? 'dfa__state--initial' : ''
    ]
  })),
  ...Array.from(transitions.values()).map(trans => ({
    data: {
      id: trans.id,
      source: trans.source.data.id,
      target: trans.target.data.id,
      label: trans.label
    },
    classes: 'autorotate'
  }))
]

const initialConfig = (input = 'bc') => ({
  hash: '' + Math.random(),
  state: states.get(initialState),
  input,
  unprocessed: input
})

export default function Automata() {
  const [configs, setConfigs] = useState([initialConfig()])

  const onNext = () => {
    setConfigs(configs.map(c => step(transitions, c)).flat())
  }

  return (
    <View style={styles.container}>
      <Editor
        elements={elements}
        transitions={transitions}
        stepping={configs.map(c => c.state.data.id)}
      />
      <Configurations configurations={configs} />
      <Controls onNext={onNext} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
