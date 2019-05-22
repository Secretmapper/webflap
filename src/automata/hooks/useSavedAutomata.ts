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
  return JSON.stringify(
    Array
      .from(map)
      .map(([k, v]) => [k, { ...v, source: v.source.data.id, target: v.target.data.id }])
  )
}

function deserializeTransitionMap (transitionsString: string, statesMap: Map<string, any>): Map<string, Transition> {
  const transitionsArray = JSON.parse(transitionsString)

  // link transitions with states
  const transitions = new Map(
    transitionsArray.map(([k, v]: [string, any]) => {
      return [
        k,
        {
          ...v,
          source: statesMap.get(v.source),
          target: statesMap.get(v.target)
        }
      ]
    })
  )

  return transitions as Map<string, Transition>
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

  const setStates = useCallback(
    nodes => {
      setStatesString(JSON.stringify(nodes))
    },
    [states]
  )

  const [initialState, setInitialState] = useLocalStorage('editor__initialState', initialStateFixture)

  /** inputs **/
  const [inputString, setInputString] = useState('')
  const [multipleInputString, setMultipleInputString] = useLocalStorage('editor__multipleInput', '[]')
  const multipleInput = useMemo(() => JSON.parse(multipleInputString), [multipleInputString])
  const setMultipleInput = useCallback((input) => (
    setMultipleInputString(JSON.stringify(input))
  ), [setMultipleInputString])

  const {
    elements,
    transitions,
    finalStates
  } = useMemo(
    () => {
      const statesMap: Map<string, any> = new Map(states)
      states.map((o: any) => statesMap.set(o.data.id, o))

      const transitions = deserializeTransitionMap(transitionsString, statesMap) as Map<string, Transition>
      const finalStates = new Set(JSON.parse(finalStatesString)) as Set<string>

      for (let [k, v] of transitions) {
        if (!v.source || !v.target) {
          transitions.delete(k)
        }
      }

      return {
        transitions,
        finalStates,
        elements: [
          ...states.map((state: any) => ({
            ...state,
            classes: [
              'dfa__state',
              initialState === state.data.id ? 'dfa__state--initial' : '',
              finalStates.has(state.data.id) ? 'dfa__state--final' : ''
            ]
          })),
          ...Array.from(transitions.values()).map((trans: any) => ({
            data: {
              ...trans,
              id: trans.id,
              source: trans.source.data.id,
              target: trans.target.data.id,
              label: makeTMTransitionLabel(trans)
            },
            classes: 'autorotate'
          }))
        ]
      }
    },
    []
  )

  // XXX: we're currently mutating these things directly, but ideally that is immutable
  const setTransitions = useCallback(() => {
    setTransitionsString(serializeTransitionMap(transitions))
  }, [])
  const setFinalStates = useCallback(() => {
    setFinalStatesString(serializeFinalStates(finalStates))
  }, [])

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
