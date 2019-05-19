import React, { useCallback, useRef, useState } from 'react'
import flatten from 'lodash.flatten'
import Layout from './Layout'
import Editor from './Editor'
import ZoomedModal from './ZoomedModal'
import Instructions from './Instructions'
import Controls from './Controls'
import { resolveConfig } from './helpers'
import { initialConfig, step } from './helpers/tm'
import { useSavedAutomata, useSaveAsImage } from './hooks'

export default function Automata() {
  const [showModal, setShowModal] = useState(false)

  const cyRef = useRef(null)
  const [
    initialElements,
    initialState,
    setInitialState,
    finalStates,
    setFinalStates,
    setStates,
    transitions,
    setTransitions,
    inputString,
    setInputString,
    multipleInput,
    setMultipleInput
  ] = useSavedAutomata()

  const [layout, setLayout] = useState(undefined)

  // TODO: un-state-ify this and memoize instead
  const [configs, setConfigs] = useState([initialConfig(initialState)])
  const [multipleInputConfigs, setMultipleInputConfigs] = useState(
    multipleInput.map(input =>
      resolveConfig(
        transitions,
        initialConfig(initialState, input),
        finalStates
      )
    )
  )

  const [rejectedConfigs, setRejectedConfigs] = useState([])
  const [configBeingHovered, setConfigBeingHovered] = useState(null)

  const onNodesChange = useCallback(nodes => {
    setStates(
      nodes
        .filter(node => node.classes !== 'eh-handle')
        .map(node => ({
          data: node.data,
          position: node.position,
          classes: node.classes
        }))
    )
  })

  const setCy = cy => {
    cyRef.current = cy
    setShowModal(true)
  }
  const onSetMultipleInput = value => {
    setMultipleInput(value)
    setMultipleInputConfigs(
      value.map(input =>
        resolveConfig(
          transitions,
          initialConfig(initialState, input),
          finalStates
        )
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
    setConfigs([initialConfig(initialState, inputString)])
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
  const saveAsImage = useSaveAsImage(cyRef.current)

  return (
    <Layout
      main={
        <ZoomedModal
          main={
            <Editor
              cy={setCy}
              layout={layout}
              onNodesChange={onNodesChange}
              elements={initialElements}
              finalStates={finalStates}
              setFinalStates={setFinalStates}
              initialState={initialState}
              setInitialState={setInitialState}
              transitions={transitions}
              setTransitions={setTransitions}
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
