import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, TextInput, View } from 'react-native'
import Cytoscape from 'react-cytoscapejs'
import cyStylesheet from './stylesheet'

export function AutomataEditor(props) {
  const cyRef = useRef(null)
  const inputEl = useRef(null)
  const [prevLayout, setPrevLayout] = useState(undefined)
  const [prevStepping, setPrevStepping] = useState(props.stepping)
  const [prevConfigHovered, setPrevConfigHovered] = useState(
    props.configHovered
  )
  const [editing, setEditing] = useState(null)

  useEffect(
    () => {
      const cy = cyRef.current
      const ur = cy.undoRedo({ stackSizeLimit: 15 })

      const onNodeEdit = e => {
        const node = e.target
        const { x, y } = node.renderedPosition()

        setEditing({
          x,
          y,
          id: node.id(),
          value: node.data('label'),
          type: 'node'
        })
        inputEl.current.focus()
        node.data('label', '')
      }

      const onNodeDelete = e => {
        const node = e.target
        ur.do('remove', node)
      }

      const onSurfaceClick = evt => {
        const target = evt.target || evt.cyTarget
        if (target === cy) {
          const node = ur.do('add', {
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
          onNodeEdit({ target: node })
        }
      }

      const cxtMenuOpts = {
        menuRadius: 80,
        selector: 'node',
        commands: [
          {
            fillColor: 'rgba(200, 200, 200, 0.75)',
            content: 'edit',
            contentStyle: {},
            select: function(ele) {
              onNodeEdit({ target: ele })
            },
            enabled: true
          },
          {
            fillColor: 'rgba(200, 200, 200, 0.75)',
            content: 'delete',
            contentStyle: {},
            select: function(ele) {
              onNodeDelete({ target: ele })
            },
            enabled: true
          }
        ],
        fillColor: 'rgba(0, 0, 0, 0.75)',
        activeFillColor: 'rgba(1, 105, 217, 0.75)',
        activePadding: 10,
        indicatorSize: 12,
        separatorWidth: 3,
        spotlightPadding: 4,
        minSpotlightRadius: 24,
        maxSpotlightRadius: 38,
        openMenuEvents: 'cxttapstart taphold',
        itemColor: 'white',
        itemTextShadowColor: 'transparent',
        zIndex: 9999,
        atMouse: false
      }

      cy.on('tap', onSurfaceClick)
      cy.cxtmenu(cxtMenuOpts)

      function onKeydown(e) {
        if ((e.ctrlKey || e.metaKey) && e.target.nodeName === 'BODY') {
          e.preventDefault()
          if (e.which === 90) {
            ur.undo()
          } else if (e.which === 89) {
            ur.redo()
          }
        }
      }
      document.addEventListener('keydown', onKeydown)

      let raf
      let animOffset = 0

      function animate() {
        animOffset++
        cy.edges().animate({
          style: { 'line-dash-offset': -animOffset }
        })
        raf = requestAnimationFrame(animate)
      }

      animate()

      return () => {
        if (raf) {
          cancelAnimationFrame(raf)
        }
        document.removeEventListener('keydown', onKeydown)
      }
    },
    ['once']
  )

  const setCy = internal => {
    cyRef.current = internal
    props.cy(internal)

    const cy = cyRef.current
    cy.edgehandles({
      preview: false,
      edgeType: function(sourceNode, targetNode) {
        return sourceNode.edgesTo(targetNode).empty() ? 'flat' : null
      },
      loopAllowed: function() {
        return true
      },
      complete: onEdgeCreate
    })

    function onEdgeCreate(sourceNode, targetNode, addedEles) {
      // TODO: Have all these data handled in one place
      props.transitions.set(addedEles.id(), {
        id: addedEles.id,
        label: addedEles.label,
        source: { data: sourceNode.data() },
        target: { data: targetNode.data() }
      })

      onEdgeEdit({ target: addedEles.first() })
    }
    const onEdgeEdit = e => {
      const edge = e.target
      const { x, y } = edge.renderedMidpoint()

      setEditing({
        x,
        y,
        id: edge.id(),
        value: edge.data('label'),
        type: 'edge'
      })
      inputEl.current.focus()
      edge.data('label', '')
    }

    // cy.on('taphold', 'node.dfa__state', onNodeEdit)
    cy.on('taphold', 'edge', onEdgeEdit)
    updateSteppingClasses()
    updateConfigHoveredClasses()
  }

  updateSteppingClasses()
  updateConfigHoveredClasses()

  if (props.layout !== prevLayout) {
    setPrevLayout(props.layout)
    if (cyRef.current) {
      cyRef.current.layout({ name: props.layout }).run()
    }
  }

  const onEditingValueChange = e => {
    setEditing({ ...editing, value: e.target.value })
  }
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
        layout={props.layout ? { name: props.layout } : null}
        elements={props.elements}
        stylesheet={cyStylesheet}
        style={{ height: '100%', width: '100%' }}
      />
      {editing && (
        <TextInput
          selectTextOnFocus
          ref={inputEl}
          style={[styles.labelInput, { left: editing.x, top: editing.y }]}
          value={editing.value}
          onChange={onEditingValueChange}
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
          .getElementById(prevStepping[i].state.data.id)
          .removeClass('dfa__state--stepping')
      }
      setPrevStepping(props.stepping)

      for (let i = 0; i < props.stepping.length; i++) {
        cyRef.current
          .getElementById(props.stepping[i].state.data.id)
          .addClass('dfa__state--stepping')
      }
    }
  }

  function updateConfigHoveredClasses() {
    if (!cyRef.current) return

    // TODO: Refactor this
    if (props.configHovered !== prevConfigHovered) {
      setPrevConfigHovered(props.configHovered)
      if (props.configHovered) {
        let config = props.configHovered
        do {
          const node = cyRef.current.getElementById(config.state.data.id)
          node.addClass('dfa__state--config-hover')

          if (config.parent) {
            const parent = cyRef.current.getElementById(
              config.parent.state.data.id
            )
            parent.edgesTo(node).addClass('dfa__state--config-hover')
          }

          config = config.parent
        } while (config)
      } else if (prevConfigHovered) {
        let config = prevConfigHovered
        do {
          const node = cyRef.current.getElementById(config.state.data.id)
          node.removeClass('dfa__state--config-hover')

          if (config.parent) {
            const parent = cyRef.current.getElementById(
              config.parent.state.data.id
            )
            parent.edgesTo(node).removeClass('dfa__state--config-hover')
          }

          config = config.parent
        } while (config)
      }
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
    backgroundColor: '#fefefe',
    width: '100%'
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
