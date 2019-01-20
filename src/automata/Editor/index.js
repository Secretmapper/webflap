import React, { useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import Cytoscape from 'react-cytoscapejs'
import cyStylesheet from './stylesheet'

export function AutomataEditor() {
  const cyRef = useRef(null)

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

    cy.on('tap', onSurfaceClick)
  }

  const elements = [
    {
      data: { id: 'q0', label: 'q0' },
      position: { x: 50, y: 50 },
      classes: 'dfa__initial-state'
    },
    {
      data: { id: 'q1', label: 'q1' },
      position: { x: 150, y: 50 },
      classes: 'dfa__final-state'
    },
    { data: { source: 'q0', target: 'q1', label: 'a' }, classes: 'autorotate' }
  ]

  return (
    <View style={styles.container}>
      <Cytoscape
        cy={setCy}
        elements={elements}
        stylesheet={cyStylesheet}
        style={{
          height: '600px',
          width: '600px'
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefefe'
  }
})

export default AutomataEditor
