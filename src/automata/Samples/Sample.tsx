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
        <Image
          style={styles.sampleImg}
          source={{ uri: props.sample.uri }}
        />
        <View style={styles.title}>
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
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  sample: {
    cursor: 'pointer',
    shadowOffset: { width: 0, height: 1 },
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    marginRight: 16,
    width: 200
  },
  sampleSelected: {
    borderColor: '#5895F0',
    borderWidth: 3,
    boxSizing: 'border-box',
    overflow: 'hidden'
  },
  sampleImg: {
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    height: 200,
    width: 200
  },
  title: {
    textAlign: 'center',
    padding: 8
  },
  text: {
    marginBottom: 8
  },
})

export default Sample
