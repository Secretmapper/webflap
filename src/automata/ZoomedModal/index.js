import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Spring } from 'react-spring'

export function ZoomedModal(props) {
  return (
    <View style={styles.container}>
      <Spring from={{ scale: 1.0 }} to={{ scale: props.showModal ? 0.9 : 1 }}>
        {tStyles => (
          <View
            style={[{ transform: [{ scale: tStyles.scale }] }, styles.main]}
          >
            {props.main}
          </View>
        )}
      </Spring>
      {props.showModal && (
        <React.Fragment>
          <View style={styles.overlay} />
          <View style={styles.modal}>{props.modal}</View>
        </React.Fragment>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: '100%',
    width: '100%'
  },
  main: {
    height: '100%',
    width: '100%'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    position: 'absolute',
    height: '100%',
    width: '100%'
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 4,
    padding: 18,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
    maxWidth: 800,
    maxHeight: '90%',
    overflow: 'scroll',
    width: '90%'
  }
})

export default ZoomedModal
