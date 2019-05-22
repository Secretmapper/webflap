import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { RouteComponentProps } from 'react-router-dom'
import { SECRET_KEY, COLLECTION_ID } from '../hooks/creds'
import Automata from '../index'
import { PulseLoader } from 'react-spinners'

interface MatchParams {
  id: string;
}

interface Props extends RouteComponentProps<MatchParams> {

}

function APILoadableAutomata (props: Props) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<null | any>(null)

  useEffect(
    () => {
      fetch(`https://api.jsonbin.io/b/${props.match.params.id}/latest`, {
        headers: {
          'Content-Type': 'application/json',
          'secret-key': SECRET_KEY,
          'collection-id': COLLECTION_ID,
          private: false
        } as any
      })
      .then(res => res.json())
      .then(data => {
        setData(() => ({
          statesDefault: data.states,
          transitionsDefault: data.transitions,
          finalStatesDefault: data.final,
          initialStateDefault: data.initial
        }))
        setLoading(false)
      })
    },
    [props.match.params.id]
  )

  return loading ? <Loading /> : (
    <Automata
      initialStateData={data}
      {...props}
    />
  )
}

function Loading () {
  return (
    <View style={styles.loading}>
      <Text style={styles.loadingText}>
        Fetching Diagram Data...
      </Text>
      <PulseLoader
        color='rgba(0, 0, 0, 1)'
        loading
        size={8}
        sizeUnit={'px'}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  },
  loadingText: {
    fontSize: 16,
    marginBottom: 16
  }
})

export default APILoadableAutomata
