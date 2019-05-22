import React, { useEffect, useRef, useState } from 'react'
import { PulseLoader } from 'react-spinners'
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native'
import useHover from '../../core/hooks/useHover'

export default function MultipleInput(props) {
  return (
    <View>
      {props.strings.map((string, i) => (
        <Row
          key={string}
          string={string}
          config={props.configs[i]}
          onHover={props.onConfigHover}
          onInputPress={props.onInputPress}
        />
      ))}
    </View>
  )
}

function Row(props) {
  const touchableRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  useHover(touchableRef, hovering => {
    setIsHovered(hovering)
    props.onHover(props.config, hovering)
  })
  useEffect(
    () => {
      return () => {
        props.onHover(props.config, false)
      }
    },
    ['once']
  )

  const accepted = !!props.config

  return (
    <TouchableOpacity onPress={() => props.onInputPress(props.string)}>
      <View
        ref={touchableRef}
        style={[
          styles.row,
          accepted && styles.rowAccepted,
          !accepted && styles.rowRejected,
          accepted && isHovered && styles.rowHoveredAccepted,
          !accepted && isHovered && styles.rowHoveredRejected
        ]}
      >
        <Text>{props.string}</Text>
        {props.loading && (
          <View style={styles.loadingContainer}>
            <PulseLoader
              color="rgba(0, 0, 0, 1)"
              loading
              size={4}
              sizeUnit={'px'}
            />
          </View>
        )}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  row: {
    borderTopColor: 'rgba(0,0,0,0.02)',
    borderRadius: 2,
    borderTopWidth: 1,
    cursor: 'pointer',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 1,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 4,
    paddingBottom: 4
  },
  rowAccepted: {
    backgroundColor: '#ccff90'
  },
  rowRejected: {
    backgroundColor: '#ffebee'
  },
  rowHovered: {
    backgroundColor: 'rgba(0,0,0,0.03)'
  },
  rowHoveredAccepted: {
    backgroundColor: '#b2fe7c'
  },
  rowHoveredRejected: {
    backgroundColor: '#ffd1d8'
  },
  loadingContainer: {
    position: 'relative',
    bottom: 3
  }
})
