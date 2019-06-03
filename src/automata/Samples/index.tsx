import React, { useCallback, useState } from 'react'
import { StyleSheet, Button, Text, View } from 'react-native'
import Sample from './Sample'
import zeroN2Fixture from './0n2.fixture'
import wwFixture from './w#w.fixture'

type Props = {
  onLoadFile: (data: any) => void
}

const sample = {
  id: '0n2',
  uri: `${process.env.PUBLIC_URL}/assets/img/0n2.png`,
  text: '$${0^{2^{n}}|n\\geq 0}$$ i.e. 0s whose length is a power of 2',
  data: zeroN2Fixture
}

const sample2 = {
  id: 'w#w',
  uri: `${process.env.PUBLIC_URL}/assets/img/w#w.png`,
  text: '$${w\#w| w \in {0,1}^{\ast}}$$ i.e. two identical strings separated by #',
  data: wwFixture
}

export function Samples (props: Props) {
  const [selected, setSelected] = useState(null) as [string | null, any]
  const onLoadSample = useCallback((e) => {
    if (selected === sample.id) {
      props.onLoadFile(sample.data)
    } else {
      props.onLoadFile(sample2.data)
    }
  }, [selected])

  return (
    <View style={styles.container}>
      <View style={styles.samplesWindow}>
        <Text style={styles.heading}>
          My Files
        </Text>
        <View style={styles.myFiles}>
          <Text style={styles.myFilesText}>Coming Soon...</Text>
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
  myFiles: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    marginBottom: 8
  },
  myFilesText: {
    fontSize: 16
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
