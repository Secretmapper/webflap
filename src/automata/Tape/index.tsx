import React, { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'

type Props = {
  tape: string,
  head: number
}

type CellProps = {
  current?: boolean,
  value: string
}

function TapeCell (props: CellProps) {
  return (
    <View style={[
      styles.cell,
      props.current && styles.cellHighlighted
    ]}>
      <Text style={styles.cellText}>{props.value}</Text>
    </View>
  )
}

function Tape (props: Props) {
  const tape = useMemo(() => props.tape.split(''), [props.tape])

  return (
    <View style={styles.container}>
      {tape.map((cell, i) => (
        <TapeCell key={i} value={cell} current={i === props.head} />
      ))}
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
    marginTop: 4,
    overflow: 'scroll'
  },
  cell: {
    borderColor: 'gray',
    borderRightWidth: 1,
    borderStyle: 'dotted',
    minHeight: 19,
    minWidth: 19,
    paddingBottom: 2
  },
  cellText: {
    textAlign: 'center'
  },
  cellHighlighted: {
    backgroundColor: 'rgba(255,255,200,1)'
  }
})

export default Tape
