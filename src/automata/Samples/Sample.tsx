import React, { useCallback } from 'react'
import { StyleSheet, TouchableOpacity, Image, View, Text } from 'react-native'
import MathJax from 'react-mathjax2'

type SampleProps = {
  sample: { id: string, uri: string, text: string },
  selected: boolean,
  onSelectSample: (id: string) => any
}

function Sample (props: SampleProps) {
  const onSelectSample = useCallback(() => (
    props.onSelectSample(props.sample.id)
  ), [])
  return (
    <TouchableOpacity onPress={onSelectSample}>
      <View
        style={[
          styles.sample,
          props.selected && styles.sampleSelected
        ]}
      >
        <div style={webstyles.title}>
          <MathJax.Context
            input='ascii'
            script='https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=AM_HTMLorMML'
            options={{
              asciimath2jax: {
                useMathMLspacing: true,
                delimiters: [["$$","$$"]],
                preview: 'none',
              }
            }}
          >
            <MathJax.Text text={props.sample.text}/>
          </MathJax.Context>
        </div>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  sample: {
    cursor: 'pointer',
    borderColor: 'rgba(0,0,0,0)',
    borderWidth: 0,
    borderLeftWidth: 3,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowRadius: 1,
    marginRight: 16,
  },
  sampleSelected: {
    borderColor: '#5895F0',
    borderWidth: 0,
    borderLeftWidth: 3,
    boxSizing: 'border-box',
    overflow: 'hidden'
  },
  sampleImg: {
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    height: 200,
    width: 200
  },
  text: {
    marginBottom: 8
  },
})

const webstyles = {
  title: {
    fontSize: 12,
    padding: 4
  }
}

export default Sample
