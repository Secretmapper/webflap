import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

type Props = {
}

type CellProps = {
  current?: boolean
}

function TapeCell (props: CellProps) {
  return (
    <View style={[
      styles.cell,
      props.current && styles.cellHighlighted
    ]}>
      <Text></Text>
    </View>
  )
}

function Tape (props: Props) {
  return (
    <View style={styles.container}>
      <TapeCell current />
      <TapeCell />
      <TapeCell />
      <TapeCell />
      <TapeCell />
      <TapeCell />
      <TapeCell />
      <TapeCell />
      <TapeCell />
      <TapeCell />
      <TapeCell />
      <TapeCell />
      <TapeCell />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,200,0.4)',
    borderColor: 'gray',
    borderLeftWidth: 1,
    borderStyle: 'dotted',
    boxShadow: '0px 1px 3px rgba(0,0,0,0.2)',
    boxSizing: 'border-box',
    flexDirection: 'row',
    marginBottom: 4,
    marginTop: 4
  },
  cell: {
    borderColor: 'gray',
    borderRightWidth: 1,
    borderStyle: 'dotted',
    paddingBottom: 2,
    minHeight: 19,
    minWidth: 19
  },
  cellHighlighted: {
    backgroundColor: 'rgba(255,255,200,1)'
  }
})

export default Tape
