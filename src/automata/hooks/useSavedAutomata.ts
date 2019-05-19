import { useCallback, useMemo, useState } from 'react'
import useLocalStorage from 'react-use-localstorage'
import { makeTMTransitionLabel } from '../helpers'
import {
  initialState as initialStateFixture,
  finalStates as finalStatesFixture,
  states as statesFixture,
  transitions as transitionsFixture
} from '../tm.fixtures'

type Transition = { id: string, source: any, target: any, left: string, label: string, right: string }
type UseSavedAutomataArray = [
  // elements
  any,
  // initialState
  string,
  // setInitialState
  Function,
  // finalStates
  Set<string>,
  // setFinalStates
  Function,
  // setStates
  Function,
  // transitions
  Map<string, Transition>,
  // setTransitions
  Function,
  // inputString
  string,
  // setInputString
  Function,
  // multipleInput
  Array<string>,
  // setMultipleInput
  Function
]

function serializeTransitionMap (map: Map<string, Transition>) {
  // TODO: currently, transitions is NOT normalized, and state data is saved along with transitions

  return JSON.stringify(
    Array
      .from(map)
      // .map(([k, v]) => [k, { ...v, source: v.source.data.id, target: v.target.data.id }])
  )
}
function serializeFinalStates (finalStates: Set<string>) {
  return JSON.stringify(Array.from(finalStates))
}

const statesFixtureString = JSON.stringify(Array.from(statesFixture.values()))
const transitionsFixtureString = serializeTransitionMap(transitionsFixture)
const finalStatesFixtureString = serializeFinalStates(finalStatesFixture)

export default function useSavedAutomata(): UseSavedAutomataArray {
  const [statesString, setStatesString] = useLocalStorage(
    'editor__states',
    statesFixtureString
  )
  const [transitionsString, setTransitionsString] = useLocalStorage(
    'editor__transitions',
    transitionsFixtureString
  )
  const [finalStatesString, setFinalStatesString] = useLocalStorage(
    'editor__finalStates',
    finalStatesFixtureString
  )

  const states = useMemo(() => JSON.parse(statesString), [statesString])
  const transitions = useMemo(() => new Map(JSON.parse(transitionsString)) as Map<string, Transition>, [
    transitionsString
  ])
  const finalStates = useMemo(() => new Set(JSON.parse(finalStatesString)) as Set<string>, [
    finalStatesString
  ])
  // XXX: we're currently mutating these things directly, but ideally that is immutable
  const setTransitions = useCallback(() => {
    setTransitionsString(serializeTransitionMap(transitions))
  }, [])
  const setFinalStates = useCallback(() => {
    setFinalStatesString(serializeFinalStates(finalStates))
  }, [])

  const setStates = useCallback(
    nodes => {
      setStatesString(JSON.stringify(nodes))
    },
    [states]
  )

  const [initialState, setInitialState] = useLocalStorage('editor__initialState', initialStateFixture)

  /** inputs **/
  const [inputString, setInputString] = useState('bc')
  const [multipleInput, setMultipleInput] = useState([
    'b',
    'bc',
    'ssbc',
    'ss',
    'abc'
  ])

  const elements = useMemo(
    () => {
      const statesMap = new Map(states)
      states.map((o: any) => statesMap.set(o.data.id, o))

      const filteredTransitions = Array
        .from(transitions.values())
        .filter(transition => statesMap.has(transition.source.data.id) && statesMap.has(transition.target.data.id))

      return [
        ...states.map((state: any) => ({
          ...state,
          classes: [
            'dfa__state',
            initialState === state.data.id ? 'dfa__state--initial' : '',
            finalStates.has(state.data.id) ? 'dfa__state--final' : ''
          ]
        })),
        ...filteredTransitions.map((trans: any) => ({
          data: {
            id: trans.id,
            source: trans.source.data.id,
            target: trans.target.data.id,
            label: makeTMTransitionLabel(trans)
          },
          classes: 'autorotate'
        }))
      ]
    },
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
