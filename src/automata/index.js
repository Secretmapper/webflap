import React, { useRef, useState } from 'react'
import flatten from 'lodash.flatten'
import Layout from './Layout'
import Editor from './Editor'
import ZoomedModal from './ZoomedModal'
import Instructions from './Instructions'
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
      finalStates.has(state.data.id) ? 'dfa__state--final' : ''
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
  const cyRef = useRef(null)

  const [showModal, setShowModal] = useState(false)
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

  const setCy = cy => {
    cyRef.current = cy
    setShowModal(true)
  }
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
    setRejectedConfigs([])
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
  const saveAsImage = type => {
    let image

    if (type === 'image/jpeg') {
      image = cyRef.current.jpeg()
    } else if (type === 'image/png') {
      image = cyRef.current.png()
    }

    if (image) {
      const url = image.replace(
        /^data:image\/[^;]+/,
        'data:application/octet-stream'
      )
      window.open(url)
    }
  }

  return (
    <Layout
      main={
        <ZoomedModal
          main={
            <Editor
              cy={setCy}
              layout={layout}
              elements={elements}
              finalStates={finalStates}
              initialState={initialState}
              transitions={transitions}
              stepping={configs}
              configHovered={configBeingHovered}
            />
          }
          modal={<Instructions onClose={() => setShowModal(false)} />}
          showModal={showModal}
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
          saveAsImage={saveAsImage}
          multipleInput={multipleInput}
          setMultipleInput={onSetMultipleInput}
          multipleInputConfigs={multipleInputConfigs}
          openModal={() => setShowModal(true)}
        />
      }
    />
  )
}
