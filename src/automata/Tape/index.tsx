import React, { useEffect, useMemo, useRef, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

type Props = {
  tape: string,
  head: number
}

type CellProps = {
  current?: boolean,
  value: string,
  ref?: any
}

const TapeCell = React.forwardRef(function (props: CellProps, ref) {
  return (
    <div
      ref={ref as any}
      style={{
        ...webstyles.cell,
        ...(props.current ? webstyles.cellHighlighted : {})
      }}
    >
      <Text style={[
        styles.cellText,
        props.current && styles.cellTextHighlighted
      ]}>
        {props.value}
      </Text>
    </div>
  )
})

// TODO: make this scrolling more efficient, this scrolling is very dirty
const scrollToRef = (containerRef: any, ref: any) => {
  if (ref.current && containerRef.current) {
    containerRef.current.scrollTo(ref.current.offsetLeft - 191 / 2, 0)   
  }
}

function Tape (props: Props) {
  const tape = useMemo(() => props.tape.split(''), [props.tape])
  const [isScrolled, setIsScrolled] = useState(false)
  const cellRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    setIsScrolled(true)
    scrollToRef(containerRef, cellRef)
  }, [props.head, tape])

  return (
    <div
      ref={containerRef}
      className='hide-scrollbar'
      style={{
        ...webstyles.container,
        opacity: isScrolled ? 100 : 0
      }}
    >
      {tape.map((cell, i) => (
        <TapeCell
          key={i}
          value={cell}
          current={i === props.head}
          ref={i === props.head ? cellRef : undefined}
        />
      ))}
    </div>
  )
}

const webstyles = {
  container: {
    backgroundColor: 'rgba(255,255,200,0.4)',
    border: 0,
    borderColor: 'gray',
    borderStyle: 'dotted',
    boxShadow: '0px 1px 3px rgba(0,0,0,0.2)',
    boxSizing: 'border-box' as 'border-box',
    display: 'flex' as 'flex',
    flexDirection: 'row' as 'row',
    marginBottom: 4,
    marginTop: 4
  },
  cell: {
    borderColor: 'gray',
    borderWidth: 0,
    borderRightWidth: 1,
    borderStyle: 'dotted',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 19,
    minWidth: 19,
    paddingBottom: 2
  },
  cellHighlighted: {
    backgroundColor: 'black'
  }
}

const styles = StyleSheet.create({
  cellText: {
    textAlign: 'center'
  },
  cellTextHighlighted: {
    color: 'white',
    textAlign: 'center'
  }
})

export default Tape
