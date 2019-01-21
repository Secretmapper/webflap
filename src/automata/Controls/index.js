import React, { useState } from 'react'
import { StyleSheet, Button, View } from 'react-native'
import Heading from '../../core/Heading'
import Configurations from '../Configurations'
import MultipleInput from '../MultipleInput'
import StepByStepControls from '../StepByStepControls'

export default function Controls(props) {
  const [tab, setTab] = useState(null)

  const {
    inputString,
    onInputStringChange,
    onPlay,
    onNext,

    finalStates,
    rejectedConfigs,
    configs,

    multipleInput,
    multipleInputConfigs
  } = props

  return (
    <View style={styles.side}>
      <Heading style={styles.heading}>WebFLAP</Heading>
      <Heading style={styles.subheading}>
        Modern Finite Automaton Maker and Visualizer
      </Heading>
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
        </React.Fragment>
      )}
      {tab === 'multipleRun' && (
        <React.Fragment>
          <NavButton title="Load Inputs" onPress={() => ''} />
          <MultipleInput
            strings={multipleInput}
            configs={multipleInputConfigs}
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
            finalStates={finalStates}
            rejected={rejectedConfigs}
            configurations={configs}
          />
        </React.Fragment>
      )}
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
  heading: {
    textAlign: 'center'
  },
  subheading: {
    textAlign: 'center',
    fontSize: 13,
    paddingTop: 4,
    paddingBottom: 8
  },
  navLink: {
    paddingBottom: 4,
    marginBottom: 4
  }
})
