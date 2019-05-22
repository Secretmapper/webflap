import React, { useState } from 'react'
import { StyleSheet, Button, Picker, View } from 'react-native'
import Modal from 'modal-enhanced-react-native-web'
import Heading from '../../core/Heading'
import Configurations from '../Configurations'
import MultipleInput from '../MultipleInput'
import MultipleInputEditor from '../MultipleInputEditor'
import StepByStepControls from '../StepByStepControls'
import Links from './Links'

export default function Controls(props) {
  const [tab, setTab] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const {
    inputString,
    onInputStringChange,
    onPlay,
    onNext,

    finalStates,
    rejectedConfigs,
    configs,
    onConfigHover,

    layout,
    setLayout,

    saveAsImage,

    multipleInput,
    multipleInputConfigs
  } = props

  const onSaveMultilineInput = value => {
    setShowModal(false)
    props.setMultipleInput(value)
  }

  const onInputPress = value => {
    // XXX: don't simulate an event here
    onInputStringChange({ target: { value } })
    setTab('stepByStep')
  }

  return (
    <View style={styles.side}>
      <Heading style={styles.heading}>WebFLAP</Heading>
      <Heading style={styles.subheading}>
        Modern Finite Automaton Maker and Visualizer
      </Heading>
      <View style={styles.main}>
        <Modal
          style={styles.modal}
          transparent={true}
          isVisible={showModal}
          onBackdropPress={() => setShowModal(false)}
        >
          {showModal && (
            <MultipleInputEditor
              currMultipleInput={props.multipleInput}
              onSaveMultilineInput={onSaveMultilineInput}
            />
          )}
        </Modal>
        {tab === null && (
          <React.Fragment>
            <NavButton
              title="Step by Step"
              onPress={() => setTab('stepByStep')}
            />
            <NavButton
              title="Run Multiple"
              onPress={() => setTab('multipleRun')}
            />
            <NavButton
              title="Save as Image"
              onPress={() => setTab('saveAsImage')}
            />
            <Picker selectedValue={layout} onValueChange={setLayout}>
              <Picker.Item label="Random" value="random" />
              <Picker.Item label="Grid" value="grid" />
              <Picker.Item label="Circle" value="circle" />
              <Picker.Item label="Concentric" value="concentric" />
              <Picker.Item label="Breadthfirst" value="breadthfirst" />
              <Picker.Item label="Cose" value="cose" />
            </Picker>
          </React.Fragment>
        )}
        {tab === 'multipleRun' && (
          <React.Fragment>
            <NavButton title="Load Inputs" onPress={() => setShowModal(true)} />
            <NavButton title="Run Inputs" onPress={props.runMultipleInput} />
            <MultipleInput
              strings={multipleInput}
              configs={multipleInputConfigs}
              continueConfig={props.continueConfig}
              onConfigHover={onConfigHover}
              onInputPress={onInputPress}
            />
          </React.Fragment>
        )}
        {tab === 'saveAsImage' && (
          <React.Fragment>
            <NavButton
              title="Save as PNG"
              onPress={() => saveAsImage('image/png')}
            />
            <NavButton
              title="Save as JPEG"
              onPress={() => saveAsImage('image/jpeg')}
            />
          </React.Fragment>
        )}
        {tab === 'stepByStep' && (
          <React.Fragment>
            <StepByStepControls
              inputString={inputString}
              onInputStringChange={onInputStringChange}
              onPlay={onPlay}
              onNext={onNext}
            />
            <Configurations
              type="tm"
              finalStates={finalStates}
              rejected={rejectedConfigs}
              configurations={configs}
              onConfigHover={onConfigHover}
            />
          </React.Fragment>
        )}
      </View>
      {tab !== null && (
        <NavButton color="#9e9e9e" title="Back" onPress={() => setTab(null)} />
      )}
      <Links openModal={props.openModal} />
    </View>
  )
}

function NavButton(props) {
  return (
    <View style={styles.navLink}>
      <Button {...props} />
    </View>
  )
}

const styles = StyleSheet.create({
  side: {
    borderRightWidth: 1,
    borderColor: '#e1e4e8',
    padding: 20,
    height: '100%'
  },
  main: {
    overflow: 'scroll',
    marginBottom: 8,
    flex: 1
  },
  modal: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 4,
    justifyContent: 'center',
    overflow: 'hidden'
  },
  heading: {
    textAlign: 'center'
  },
  subheading: {
    textAlign: 'center',
    fontSize: 13,
    paddingTop: 4,
    paddingBottom: 8
  },
  linkContainer: {
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
    borderTopWidth: 1
  },
  linkBottom: {
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    borderBottomWidth: 1
  },
  link: {
    display: 'block',
    paddingBottom: 8,
    paddingTop: 8,
    paddingLeft: 15,
    paddingRight: 15,
    marginLeft: '-15px',
    marginRight: '-15px',
    color: '#818387',
    borderRadius: 3
  },
  authorLinkContainer: {
    paddingBottom: 10,
    paddingTop: 10
  },
  authorLink: {
    color: '#71BCF7'
  },
  navLink: {
    paddingBottom: 4,
    marginBottom: 4
  }
})
