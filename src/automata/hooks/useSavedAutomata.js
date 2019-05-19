import { useCallback, useMemo, useState } from 'react'
import { makeTMTransitionLabel } from '../helpers'
import {
  initialState as initialStateFixture,
  finalStates as finalStatesFixture,
  states,
  transitions
} from '../tm.fixtures'

export default function useSavedAutomata() {
  const [initialState, setInitialState] = useState(initialStateFixture)
  const [finalStates, setFinalStates] = useState(finalStatesFixture)

  /** inputs **/
  const [inputString, setInputString] = useState('bc')
  const [multipleInput, setMultipleInput] = useState([
    'b',
    'bc',
    'ssbc',
    'ss',
    'abc'
  ])
  // XXX: we're currently mutating transitions directly, but ideally that is immutable
  const setTransitions = useCallback(() => {})

  const elements = useMemo(
    () => [
      ...Array.from(states.values()).map(state => ({
        ...state,
        classes: [
          'dfa__state',
          initialStateFixture === state.data.id ? 'dfa__state--initial' : '',
          finalStates.has(state.data.id) ? 'dfa__state--final' : ''
        ]
      })),
      ...Array.from(transitions.values()).map(trans => ({
        data: {
          id: trans.id,
          source: trans.source.data.id,
          target: trans.target.data.id,
          label: makeTMTransitionLabel(trans)
        },
        classes: 'autorotate'
      }))
    ],
    []
  )

  return [
    elements,
    initialState,
    setInitialState,
    finalStates,
    setFinalStates,
    transitions,
    setTransitions,
    inputString,
    setInputString,
    multipleInput,
    setMultipleInput
  ]
}
