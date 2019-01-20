import React, { useRef, useState } from 'react'
import { StyleSheet, TextInput, View } from 'react-native'
import Cytoscape from 'react-cytoscapejs'
import cyStylesheet from './stylesheet'

export function AutomataEditor(props) {
  const cyRef = useRef(null)
  const inputEl = useRef(null)
  const [prevStepping, setPrevStepping] = useState(props.stepping)
  const [editing, setEditing] = useState(null)

  const setCy = internal => {
    cyRef.current = internal

    const cy = cyRef.current
    cy.edgehandles({
      preview: false,
      edgeType: function(sourceNode, targetNode) {
        return sourceNode.edgesTo(targetNode).empty() ? 'flat' : null
      },
      complete: onEdgeCreate
    })

    const onSurfaceClick = evt => {
      const target = evt.target || evt.cyTarget
      if (target === cy) {
        cy.add({
          data: {
            // TODO: Add actual uuid generation
            id: 'new' + Math.round(Math.random() * 100),
            label: ''
          },
          position: {
            x: evt.position.x,
            y: evt.position.y
          },
          classes: ['dfa__state']
        })
      }
    }
    const onNodeEdit = e => {
      const node = e.target
      const { x, y } = node.position()

      node.data('label', '')
      setEditing({ x, y, id: node.id(), type: 'node' })
      inputEl.current.focus()
    }
    function onEdgeCreate(sourceNode, targetNode, addedEles) {
      // TODO: Have all these data handled in one place
      props.transitions.set(addedEles.id(), {
        id: addedEles.id,
        label: addedEles.label,
        source: { data: sourceNode.data() },
        target: { data: targetNode.data() }
      })
      addedEles.addClass('autorotate')
    }
    const onEdgeEdit = e => {
      const edge = e.target
      const { x, y } = edge.midpoint()

      edge.data('label', '')
      setEditing({ x, y, id: edge.id(), type: 'edge' })
      inputEl.current.focus()
    }

    cy.on('tap', onSurfaceClick)
    cy.on('taphold', 'node.dfa__state', onNodeEdit)
    cy.on('taphold', 'edge', onEdgeEdit)
    updateSteppingClasses()
  }

  updateSteppingClasses()

  const onNodeLabelInputBlur = e => {
    const cy = cyRef.current

    cy.$(`#${editing.id}`).data('label', e.target.value)
    // update root transitions object as well
    // unfortunately we have to do this dirty
    // hack since there are two sources of truth
    const trans = props.transitions.get(editing.id)
    if (trans && editing.type === 'edge') {
      trans.label = e.target.value
    }

    setEditing(null)
  }

  return (
    <View style={styles.container}>
      <UncontrolledCytoscape
        cy={setCy}
        elements={props.elements}
        stylesheet={cyStylesheet}
        style={{ height: '400px', width: '600px' }}
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

  function updateSteppingClasses() {
    if (!cyRef.current) return
    if (props.stepping !== prevStepping) {
      for (let i = 0; i < prevStepping.length; i++) {
        cyRef.current
          .getElementById(prevStepping[i])
          .removeClass('dfa__state--stepping')
      }
      setPrevStepping(props.stepping)
    }
    for (let i = 0; i < props.stepping.length; i++) {
      cyRef.current
        .getElementById(props.stepping[i])
        .addClass('dfa__state--stepping')
    }
  }
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
