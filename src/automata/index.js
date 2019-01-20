import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import flatten from 'lodash.flatten'
import Heading from '../core/Heading'
import Layout from './Layout'
import Editor from './Editor'
import Configurations from './Configurations'
import MultipleInput from './MultipleInput'
import Controls from './Controls'
import { step, resolveConfig } from './helpers'
import {
  initialState,
  finalStates,
  states,
  transitions
} from './automata.fixtures'

const elements = [
  ...Array.from(states.values()).map(state => ({
    ...state,
    classes: [
      'dfa__state',
      initialState === state.data.id ? 'dfa__state--initial' : '',
      finalStates.indexOf(state.data.id) !== -1 ? 'dfa__state--final' : ''
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
  const [multipleInput, setMultipleInput] = useState([
    'b',
    'bc',
    'ssbc',
    'ss',
    'abc'
  ])
  const [multipleInputConfigs, setMultipleInputConfigs] = useState(
    multipleInput.map(input =>
      resolveConfig(transitions, initialConfig(input), finalStates)
    )
  )
  const [rejectedConfigs, setRejectedConfigs] = useState([])
  const [inputString, setInputString] = useState('bc')

  const onInputStringChange = e => {
    setInputString(e.target.value)
  }
  const onPlay = () => {
    setConfigs([initialConfig(inputString)])
  }
  const onNext = () => {
    const newConfigs = []
    const newRejectedConfigs = []

    for (let i = 0; i < configs.length; i++) {
      const stepConfigs = step(transitions, configs[i])
      const isConfigRejected = stepConfigs.length === 0

      if (isConfigRejected) {
        newRejectedConfigs.push(configs[i])
      } else {
        newConfigs.push(stepConfigs)
      }
    }

    setConfigs(flatten(newConfigs))
    setRejectedConfigs(newRejectedConfigs)
  }

  return (
    <Layout
      main={
        <Editor
          elements={elements}
          transitions={transitions}
          stepping={configs.map(c => c.state.data.id)}
        />
      }
      side={
        <View style={styles.side}>
          <Heading style={styles.heading}>WebFLAP</Heading>
          <Heading style={styles.subheading}>
            Modern Finite Automaton Maker and Visualizer
          </Heading>
          <Controls
            inputString={inputString}
            onInputStringChange={onInputStringChange}
            onPlay={onPlay}
            onNext={onNext}
          />
          <Configurations
            finalStates={finalStates}
            rejected={rejectedConfigs}
            configurations={configs}
          />
          <MultipleInput
            strings={multipleInput}
            configs={multipleInputConfigs}
          />
        </View>
      }
    />
  )
}

const styles = StyleSheet.create({
  side: {
    borderRightWidth: 1,
    borderColor: '#e1e4e8',
    padding: 20,
    height: '100%'
  },
  heading: {
    textAlign: 'center'
  },
  subheading: {
    textAlign: 'center',
    fontSize: 13,
    paddingBottom: 8
  }
})
