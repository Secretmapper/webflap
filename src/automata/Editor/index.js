import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Group, Text, Path, Surface, Shape } from 'react-art'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefefe'
  }
})

function circlePath(radius) {
  return Path()
    .move(radius, 0)
    .arc(0, radius * 2, radius)
    .arc(0, radius * -2, radius)
}

export function Circle(props) {
  const path = circlePath(props.radius)

  return <Shape {...props} x={props.x} y={props.y} d={path} />
}

export function AutomataState(props) {
  const radius = 30
  const strokeColor = props.selected
    ? 'rgba(0, 0, 180, 1)'
    : 'rgba(100,100,100,1)'
  const textColor = props.selected ? 'rgba(0, 0, 180, 1)' : '#000000'

  const onMouseDown = e => {
    e.preventDefault()
    props.onSelect(props.state)
  }

  return (
    <Group
      onMouseDown={onMouseDown}
      x={props.state.x - radius}
      y={props.state.y - radius}
    >
      <Circle
        radius={radius}
        stroke={strokeColor}
        fill="rgba(255, 255, 255, 0.9)"
      />
      <Text
        font={`13px 'Helvetica Neue', Helvetica, Arial`}
        x={radius}
        y={radius - 6}
        fill={textColor}
        alignment="center"
      >
        {props.state.name}
      </Text>
    </Group>
  )
}

export function AutomataEditor() {
  const [states, setStates] = useState({})
  const [selectedState, setSelectedState] = useState(null)
  const [nextStateKey, setNextStateKey] = useState(0)

  const onSurfaceClick = e => {
    // TODO: generate a correct id here
    const key = Math.random()

    setStates({
      ...states,
      [key]: {
        key,
        x: e.clientX,
        y: e.clientY,
        name: `q${nextStateKey}`
      }
    })
    setSelectedState(key)
    setNextStateKey(nextStateKey + 1)
  }

  const onStateSelect = state => {
    setSelectedState(state.key)
  }

  return (
    <View style={styles.container} onMouseUp={onSurfaceClick}>
      <Surface width={500} height={500}>
        {Object.values(states).map(state => (
          <AutomataState
            onSelect={onStateSelect}
            selected={selectedState === state.key}
            key={state.key}
            state={state}
          />
        ))}
      </Surface>
    </View>
  )
}

export default AutomataEditor
