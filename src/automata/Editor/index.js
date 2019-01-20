import React, { useRef, useState } from 'react'
import { StyleSheet, TextInput, View } from 'react-native'
import Cytoscape from 'react-cytoscapejs'
import cyStylesheet from './stylesheet'

export function AutomataEditor() {
  const cyRef = useRef(null)
  const inputEl = useRef(null)
  const [editing, setEditing] = useState(null)

  const setCy = internal => {
    cyRef.current = internal

    const cy = cyRef.current
    cy.edgehandles({
      preview: false,
      edgeType: function(sourceNode, targetNode) {
        return sourceNode.edgesTo(targetNode).empty() ? 'flat' : null
      }
    })

    const onSurfaceClick = evt => {
      const target = evt.target || evt.cyTarget
      if (target === cy) {
        cy.add({
          classes: 'automove-viewport',
          data: {
            // TODO: Add actual uuid generation
            id: 'new' + Math.round(Math.random() * 100),
            label: ''
          },
          position: {
            x: evt.position.x,
            y: evt.position.y
          }
        })
      }
    }
    const onNodeEdit = e => {
      const node = e.target
      const { x, y } = node.position()

      node.data('label', '')
      setEditing({ x, y, id: node.id() })
      inputEl.current.focus()
    }

    cy.on('tap', onSurfaceClick)
    cy.on('taphold', 'node.dfa__state', onNodeEdit)
  }

  const onNodeLabelInputBlur = e => {
    const cy = cyRef.current
    cy.$(`#${editing.id}`).data('label', e.target.value)
    setEditing(null)
  }

  const elements = [
    {
      data: { id: 'q0', label: 'q0' },
      position: { x: 50, y: 50 },
      classes: ['dfa__state', 'dfa__state--initial']
    },
    {
      data: { id: 'q1', label: 'q1' },
      position: { x: 150, y: 50 },
      classes: ['dfa__state', 'dfa__state--final']
    },
    { data: { source: 'q0', target: 'q1', label: 'a' }, classes: 'autorotate' }
  ]

  return (
    <View style={styles.container}>
      <UncontrolledCytoscape
        cy={setCy}
        elements={elements}
        stylesheet={cyStylesheet}
        style={{ height: '600px', width: '600px' }}
      />
      {editing && (
        <TextInput
          ref={inputEl}
          style={[styles.labelInput, { left: editing.x, top: editing.y }]}
          onBlur={onNodeLabelInputBlur}
        />
      )}
    </View>
  )
}

// Cytoscape that only uses elements as initial data
class UncontrolledCytoscape extends React.Component {
  shouldComponentUpdate() {
    return false
  }

  render() {
    return <Cytoscape {...this.props} />
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefefe'
  },
  labelInput: {
    fontSize: 14,
    outline: 'none',
    position: 'absolute',
    textAlign: 'center',
    transform: [{ translateX: '-50%' }, { translateY: '-50%' }]
  }
})

export default AutomataEditor
