import React, { useState } from 'react'
import { StyleSheet, Button, Text, TextInput, View } from 'react-native'
import Heading from '../../core/Heading'

export default function MultipleInputEditor(props) {
  return (
    <View style={styles.container}>
      <View style={styles.column}>
        <Heading style={styles.heading}>
          Editor
          <Heading style={styles.headingSmall}>
            (separate test input by newline)
          </Heading>
        </Heading>
        <TextInput
          style={styles.editorText}
          multiline
          placeholer="Input cases"
        />
        <Button title="Save" onPress={props.onSaveMultilineInput} />
      </View>
      <View style={[styles.column, styles.columnEditor]}>
        <View style={styles.upload}>
          <Text style={styles.uploadLabel}>Upload</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    height: '100%',
    width: '100%'
  },
  column: {
    padding: 22,
    flex: 1
  },
  heading: {
    fontSize: 18,
    paddingBottom: 4
  },
  headingSmall: {
    fontSize: 13,
    marginLeft: 4,
    color: '#808080'
  },
  columnEditor: {
    backgroundColor: '#efefef'
  },
  editorText: {
    boxShadow: 'inset 0 0 4px #b0b0b0',
    height: '100%',
    padding: 8,
    marginTop: 4,
    marginBottom: 4,
    lineHeight: 18,
    outline: 'none'
  },
  upload: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#e0e0e0',
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    height: '100%'
  },
  uploadLabel: {
    textAlign: 'center'
  }
})
