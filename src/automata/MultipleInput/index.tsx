import React, { useCallback, useEffect, useRef, useState } from 'react'
import { PulseLoader } from 'react-spinners'
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native'
import useHover from '../../core/hooks/useHover'

type Config = {
  done: boolean,
  value: any
}

type Props = {
  strings: Array<string>,
  configs: Array<Config>,
  onConfigHover: Function
  onInputPress: Function
}

type RowProps = {
  string: string,
  config: Config,
  onHover: Function,
  onInputPress: Function
}

function MultipleInput(props: Props) {
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

MultipleInput.defaultProps = {
  onHover: () => {},
  onInputPress: () => {}
}

function Row(props: RowProps) {
  const touchableRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  useHover(touchableRef, (hovering: any) => {
    setIsHovered(hovering)
    if (props.config && props.config.done) {
      props.onHover(props.config.value, hovering)
    }
  })
  useEffect(
    () => {
      return () => {
        props.onHover(null, false)
      }
    },
    ['once']
  )
  const onPress = useCallback(() => {
    props.onInputPress(props.string)
  }, [props.onInputPress])

  const accepted = props.config && props.config.done
  const loading = false

  return (
    <TouchableOpacity onPress={onPress}>
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
        <View>
          <RowStatusIcon
            config={props.config}
          />
          {loading && (
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
      </View>
    </TouchableOpacity>
  )
}

type RowStatusIconProps = {
  config: any
}

function RowStatusIcon (props: RowStatusIconProps) {
  if (props.config && !props.config.done) {
    return (
      <Text>!</Text>
    )
  }

  return (<React.Fragment />)
}

export default MultipleInput

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
