import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

type Props = {
  config: {
    done: boolean,
    value: string | object
  },
  onSimulateStepByStep: (event: MouseEvent) => void,
  onContinue: (event: MouseEvent) => void,
}

function Panel (props: Props) {
  const paused = props.config && !props.config.done

  return (
    <View style={styles.panel}>
      {paused && (
        <View>
          <Text style={webStyles.text}>
            ! Paused - simulation is taking too many steps
          </Text>
          <View style={styles.accent}>
            <Text style={webStyles.text}>{props.config.value} configurations generated</Text>
            <a style={webStyles.textLink} onClick={props.onContinue as any}>Continue?</a>
          </View>
        </View>
      )}
      <a style={webStyles.textLink} onClick={props.onSimulateStepByStep as any}>Simulate Step by Step</a>
    </View>
  )
}

Panel.defaultProps = {
  config: {}
}

const webStyles = {
  text: {
    fontSize: 14,
    marginTop: 4
  },
  textLink: {
    cursor: 'pointer',
    fontSize: 14,
    marginTop: 4
  }
}

const styles = StyleSheet.create({
  panel: {
    borderColor: 'rgba(0, 0, 0, 0.3)',
    borderLeftWidth: 1,
    paddingLeft: 8,
    marginBottom: 8,
    marginLeft: 4
  },
  accent: {
    marginLeft: 12
  }
})

export default Panel
