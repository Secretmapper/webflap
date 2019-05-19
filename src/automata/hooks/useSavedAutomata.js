import { useCallback, useMemo, useState } from 'react'
import useLocalStorage from 'react-use-localstorage'
import { makeTMTransitionLabel } from '../helpers'
import {
  initialState as initialStateFixture,
  finalStates as finalStatesFixture,
  states as statesFixture,
  transitions as transitionsFixture
} from '../tm.fixtures'

const statesFixtureString = JSON.stringify(Array.from(statesFixture.values()))
const transitionsFixtureString = JSON.stringify(
  Array.from(transitionsFixture.values())
)

export default function useSavedAutomata() {
  const [statesString, setStatesString] = useLocalStorage(
    'editor__states',
    statesFixtureString
  )
  const [transitionsString, setTransitionsString] = useLocalStorage(
    'editor__transitions',
    transitionsFixtureString
  )

  const states = useMemo(() => JSON.parse(statesString), [statesString])
  const transitions = useMemo(() => JSON.parse(transitionsString), [
    transitionsString
  ])

  const setStates = useCallback(
    nodes => {
      setStatesString(JSON.stringify(nodes))
    },
    [states]
  )

  const [initialState, setInitialState] = useState(initialStateFixture)
  const [item, setItem] = useLocalStorage('name', 'Initial Value')
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
      ...states.map(state => ({
        ...state,
        classes: [
          'dfa__state',
          initialStateFixture === state.data.id ? 'dfa__state--initial' : '',
          finalStates.has(state.data.id) ? 'dfa__state--final' : ''
        ]
      })),
      ...transitions.map(trans => ({
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
    setStates,
    transitions,
    setTransitions,
    inputString,
    setInputString,
    multipleInput,
    setMultipleInput
  ]
}
