import React, { useCallback, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { StyleSheet, TextInput, Picker, View } from 'react-native'
import Cytoscape from 'react-cytoscapejs'
import cyStylesheet from './stylesheet'

export function AutomataEditor(props) {
  const cyRef = useRef(null)
  const inputElLeft = useRef(null)
  const inputElRight = useRef(null)
  const inputEl = useRef(null)
  const [prevLayout, setPrevLayout] = useState(undefined)
  const [prevStepping, setPrevStepping] = useState(props.stepping)
  const [prevConfigHovered, setPrevConfigHovered] = useState(
    props.configHovered
  )
  const [editing, setEditing] = useState(null)

  const setNodeAsStart = useCallback(e => {})
  const setNodeAsFinal = useCallback(
    e => {
      const cy = cyRef.current
      const ur = cy.undoRedo({ stackSizeLimit: 15 })

      if (props.finalStates.has(e.target.data().id)) {
        ur.do('unsetAsFinal', e.target)
      } else {
        ur.do('setAsFinal', e.target)
      }
    },
    [cyRef]
  )

  useEffect(
    () => {
      const cy = cyRef.current
      const ur = cy.undoRedo({ stackSizeLimit: 15 })
      ur.action(
        'setAsFinal',
        eles => {
          props.finalStates.add(eles.data().id)
          return eles.addClass('dfa__state--final')
        },
        eles => {
          props.finalStates.delete(eles.data().id)
          return eles.removeClass('dfa__state--final')
        }
      )
      ur.action(
        'unsetAsFinal',
        eles => {
          props.finalStates.delete(eles.data().id)
          return eles.removeClass('dfa__state--final')
        },
        eles => {
          props.finalStates.add(eles.data().id)
          return eles.addClass('dfa__state--final')
        }
      )

      const onNodeEdit = e => {
        const node = e.target
        const { x, y } = node.renderedPosition()

        setEditing({
          x,
          y,
          id: node.id(),
          value: node.data('label'),
          valueLeft: '',
          valueRight: '',
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
        if (editing) {
          return
        }

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
        menuRadius: 100,
        selector: 'node',
        commands: [
          {
            fillColor: 'rgba(200, 200, 200, 0.75)',
            content: 'Set/Unset as Initial',
            contentStyle: {},
            select: function(ele) {
              setNodeAsStart({ target: ele })
            },
            enabled: true
          },
          {
            fillColor: 'rgba(200, 200, 200, 0.75)',
            content: 'Set/Unset as Final',
            contentStyle: {},
            select: function(ele) {
              setNodeAsFinal({ target: ele })
            },
            enabled: true
          },
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
        indicatorSize: 24,
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
        valueLeft: '',
        valueRight: '',
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
  const onEditingLeftValueChange = e => {
    setEditing({ ...editing, valueLeft: e.target.value })
  }
  const onTMDirectionChange = valueRight => {
    setEditing({ ...editing, valueRight })
  }
  const onNodeLabelInputBlur = e => {
    // TODO: use onFocusOut (see: https://github.com/facebook/react/issues/6410)
    const cy = cyRef.current
    setTimeout(function() {
      const input = ReactDOM.findDOMNode(inputEl.current)
      const inputLeft = ReactDOM.findDOMNode(inputElLeft.current)
      const inputRight = ReactDOM.findDOMNode(inputElRight.current)

      const isFocusOut =
        document.activeElement !== input &&
        document.activeElement !== inputLeft &&
        document.activeElement !== inputRight

      if (isFocusOut) {
        cy.$(`#${editing.id}`).data('label', input.value)
        // update root transitions object as well
        // unfortunately we have to do this dirty
        // hack since there are two sources of truth
        const trans = props.transitions.get(editing.id)
        if (trans && editing.type === 'edge') {
          trans.label = input.value
        }

        setEditing(null)
      }
    }, 0)
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
        <View
          style={[
            styles.labelInputContainer,
            { left: editing.x, top: editing.y }
          ]}
        >
          <TextInput
            selectTextOnFocus
            ref={inputElLeft}
            style={[styles.labelInput, { left: editing.x, top: editing.y }]}
            value={editing.valueLeft}
            placeholder="&#955;"
            onChange={onEditingLeftValueChange}
            onBlur={onNodeLabelInputBlur}
          />
          <TextInput
            selectTextOnFocus
            ref={inputEl}
            style={[styles.labelInput, { left: editing.x, top: editing.y }]}
            value={editing.value}
            onChange={onEditingValueChange}
            onBlur={onNodeLabelInputBlur}
          />
          <Picker
            ref={inputElRight}
            selectedValue={editing.valueRight}
            onValueChange={onTMDirectionChange}
            style={[{ left: editing.x, top: editing.y }]}
          >
            <Picker.Item label="L" value="L" />
            <Picker.Item label="R" value="R" />
          </Picker>
        </View>
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
  labelInputContainer: {
    position: 'absolute',
    transform: [{ translateX: '-50%' }, { translateY: '-50%' }]
  },
  labelInput: {
    fontSize: 16,
    textAlign: 'center'
  }
})

export default AutomataEditor
