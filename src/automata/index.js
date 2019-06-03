import React, { useCallback, useRef, useState } from 'react'
import flatten from 'lodash.flatten'
import { useAlert } from 'react-alert'
import Layout from './Layout'
import Editor from './Editor'
import ZoomedModal from './ZoomedModal'
import Instructions from './Instructions'
import Samples from './Samples'
import Controls from './Controls'
import ShareLink from './ShareLink'
import { lazyResolveConfig, initialConfig, step } from './helpers/tm'
import {
  useMultipleInputAutomata,
  useSavedAutomataState,
  useSavedAutomataLocalStorage,
  useSaveAsImage
} from './hooks'

export default function Automata(props) {
  const [viewOtherFiles, setViewOtherFiles] = useState(false)
  const { showModal, setShowModal } = props
  const shareAlert = useAlert()

  const onViewInstructions = useCallback(
    () => {
      setShowModal(true)
      setViewOtherFiles(false)
    },
    [setShowModal, setViewOtherFiles]
  )
  const onViewOtherFiles = useCallback(
    () => {
      setShowModal(true)
      setViewOtherFiles(true)
    },
    [setViewOtherFiles]
  )

  const saveHook = props.initialStateData
    ? useSavedAutomataState(props.initialStateData)
    : useSavedAutomataLocalStorage()

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
    setMultipleInput,
    onShareRaw,
    isSharing
  ] = saveHook
  const onShare = useCallback(() => {
    onShareRaw().then(data => {
      shareAlert.show(
        <ShareLink url={`${window.location.hostname}/diagram/${data.id}`} />
      )
    })
  }, onShareRaw)

  const cyRef = useRef(null)

  const [layout, setLayout] = useState(undefined)

  // TODO: un-state-ify this and memoize instead
  const [configs, setConfigs] = useState([initialConfig(initialState)])
  const [
    multipleInputConfigs,
    onRunMultipleInput,
    continueConfig
  ] = useMultipleInputAutomata({
    finalStates,
    initialConfig,
    initialState,
    multipleInput,
    lazyResolveConfig,
    transitions
  })

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

  const onLoadFile = props.onLoadFile
  const setCy = cy => {
    cyRef.current = cy
  }
  const onSetMultipleInput = value => {
    setMultipleInput(value)
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
          modal={
            viewOtherFiles ? (
              <Samples
                onCancel={() => setShowModal(false)}
                onLoadFile={onLoadFile}
              />
            ) : (
              <Instructions onClose={() => setShowModal(false)} />
            )
          }
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
          continueConfig={continueConfig}
          onConfigHover={onConfigHover}
          layout={layout}
          setLayout={setLayout}
          saveAsImage={saveAsImage}
          multipleInput={multipleInput}
          setMultipleInput={onSetMultipleInput}
          runMultipleInput={onRunMultipleInput}
          multipleInputConfigs={multipleInputConfigs}
          isSharing={isSharing}
          onShare={onShare}
          onViewInstructions={onViewInstructions}
          onViewOtherFiles={onViewOtherFiles}
        />
      }
    />
  )
}
