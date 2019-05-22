import React, { useCallback, useState } from 'react'
import { StyleSheet, Button, Text, View } from 'react-native'
import Sample from './Sample'

type Props = {
}


const sample = {
  id: '0n2',
  uri: `${process.env.PUBLIC_URL}/assets/img/0n2.png`,
  text: '$${0^{2^{n}}|n\\geq 0}$$ i.e. 0s whose length is a power of 2'
}

const sample2 = {
  id: 'w#w',
  uri: `${process.env.PUBLIC_URL}/assets/img/w#w.png`,
  text: '$${w\#w| w \in {0,1}^{\ast}}$$ i.e. two identical strings separated by #'
}

export function Samples (props: Props) {
  const [selected, setSelected] = useState(null) as [string | null, any]
  const onLoadSample = useCallback((e) => {
  }, [selected])

  return (
    <View style={styles.container}>
      <View style={styles.samplesWindow}>
        <Text style={styles.heading}>
          My Files
        </Text>
        <View style={styles.samples}>
        </View>
        <Text style={styles.heading}>
          Turing Machine Examples
        </Text>
        <View style={styles.samples}>
          <Sample selected={selected === sample.id} sample={sample} onSelectSample={setSelected} />
          <Sample selected={selected === sample2.id} sample={sample2} onSelectSample={setSelected} />
        </View>
      </View>
      <View style={styles.actions}>
        <View style={styles.cancelBtn}>
          <Button title='Cancel' onPress={() => {}} color='#9D9D9D' />
        </View>
        <Button disabled={!selected} title='Load' onPress={onLoadSample} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {},
  heading: {
    fontSize: 18,
    paddingTop: 4,
    paddingBottom: 16
  },
  samplesWindow: {
  },
  samples: {
    // flexDirection: 'row'
  },
  text: {
    marginBottom: 8
  },
  textBottom: {
    marginBottom: 16
  },
  actions: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    marginTop: 8
  },
  cancelBtn: {
    marginRight: 8
  }
})

export default Samples
