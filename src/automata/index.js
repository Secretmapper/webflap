import React, { useState } from 'react'
import flatten from 'lodash.flatten'
import Layout from './Layout'
import Editor from './Editor'
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
  const [layout, setLayout] = useState(undefined)
  const [configBeingHovered, setConfigBeingHovered] = useState(null)
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

  const onSetMultipleInput = value => {
    setMultipleInput(value)
    setMultipleInputConfigs(
      value.map(input =>
        resolveConfig(transitions, initialConfig(input), finalStates)
      )
    )
  }
  const onConfigHover = (config, hoveringIn) => {
    if (hoveringIn) {
      setConfigBeingHovered(config)
    } else {
      setConfigBeingHovered(null)
    }
  }
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
          layout={layout}
          elements={elements}
          transitions={transitions}
          stepping={configs}
          configHovered={configBeingHovered}
        />
      }
      side={
        <Controls
          inputString={inputString}
          onInputStringChange={onInputStringChange}
          onPlay={onPlay}
          onNext={onNext}
          finalStates={finalStates}
          rejectedConfigs={rejectedConfigs}
          configs={configs}
          onConfigHover={onConfigHover}
          layout={layout}
          setLayout={setLayout}
          multipleInput={multipleInput}
          setMultipleInput={onSetMultipleInput}
          multipleInputConfigs={multipleInputConfigs}
        />
      }
    />
  )
}
