import React, { useState } from 'react'
import { StyleSheet, Button, Text, TextInput, View } from 'react-native'
import Dropzone from 'react-dropzone'
import Heading from '../../core/Heading'

export default function MultipleInputEditor(props) {
  const [multilineInput, setMultipleInput] = useState(
    props.currMultipleInput.join('\n')
  )
  const onMultilineInputChange = e => {
    setMultipleInput(e.target.value)
  }
  const onSaveMultilineInput = e => {
    props.onSaveMultilineInput(multilineInput.split('\n'))
  }
  const onDrop = (files, rejectedFiles) => {
    if (rejectedFiles.length !== 0) {
      // TODO: Make this look better
      alert('Please use plain/text (.txt) formats!')
    }

    const reader = new FileReader()
    reader.onload = function(e) {
      props.onSaveMultilineInput(e.target.result.split('\n'))
    }
    reader.readAsText(files[0], 'UTF-8')
  }

  return (
    <View style={styles.container}>
      <View style={styles.column}>
        <Heading style={styles.heading}>
          Edit Test Input
          <Text style={styles.headingSmall}>
            (separate test input by newline)
          </Text>
        </Heading>
        <TextInput
          style={styles.editorText}
          value={multilineInput}
          onChange={onMultilineInputChange}
          multiline
          placeholer="Input cases"
        />
        <Button title="Save" onPress={onSaveMultilineInput} />
      </View>
      <View style={[styles.column, styles.columnEditor]}>
        <Dropzone accept="text/plain" onDrop={onDrop}>
          {({ getRootProps, getInputProps, isDragActive }) => (
            <div
              {...getRootProps()}
              style={{
                ...styles.upload,
                ...(isDragActive ? styles.uploadDragActive : {})
              }}
            >
              {isDragActive ? (
                'Drop files here...'
              ) : (
                <div>
                  <div style={styles.uploadLabel}>Drag Input File</div>
                  <small style={styles.uploadLabel}>or</small>
                  <div>Click to Browse Input File</div>
                </div>
              )}
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      </View>
      <View style={styles.or}>
        <Text style={styles.orText}>OR</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    flexDirection: 'row',
    height: '100%',
    width: '100%'
  },
  or: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 50,
    boxShadow: '0 0 16px rgba(0, 0, 0, 0.3)',
    height: 60,
    width: 60
  },
  orText: {
    fontSize: 24
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
    outlineStyle: 'none'
  }
})

styles.upload = {
  borderWidth: 2,
  borderStyle: 'dashed',
  borderColor: '#e0e0e0',
  cursor: 'pointer',
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  alignContent: 'center',
  justifyContent: 'center',
  height: '100%',

  color: '#909090',
  fontSize: 24,
  textAlign: 'center'
}
styles.uploadDragActive = {
  color: '#2096F3',
  borderColor: '#2096F3'
}
styles.uploadLabel = {
  display: 'block',
  paddingBottom: 8
}
