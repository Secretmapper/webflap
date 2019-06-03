import { useCallback, useMemo, useState } from 'react'
import { makeTMTransitionLabel } from '../helpers'
import { SECRET_KEY, COLLECTION_ID } from './creds'
import wwFixture from '../Samples/w#w.fixture'

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
  Function,
  // onShare
  Function,
  // isSharing
  boolean
]

export function serializeTransitionMap (map: Map<string, Transition>) {
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

export function serializeFinalStates (finalStates: Set<string>) {
  return JSON.stringify(Array.from(finalStates))
}

export default function useSavedAutomata(
  useStorage: (key: string, v: string) => any,
  defaults: { statesDefault: string, transitionsDefault: string, finalStatesDefault: string, initialStateDefault: string }
): UseSavedAutomataArray {
  const {
    statesDefault,
    transitionsDefault,
    finalStatesDefault,
    initialStateDefault
  } = defaults

  const [statesString, setStatesString] = useStorage(
    'editor__states',
    statesDefault
  )
  const [transitionsString, setTransitionsString] = useStorage(
    'editor__transitions',
    transitionsDefault
  )
  const [finalStatesString, setFinalStatesString] = useStorage(
    'editor__finalStates',
    finalStatesDefault
  )

  const states = useMemo(() => JSON.parse(statesString), [statesString])

  const setStates = useCallback(
    nodes => {
      setStatesString(JSON.stringify(nodes))
    },
    [states]
  )

  const [initialState, setInitialState] = useStorage('editor__initialState', initialStateDefault)

  /** inputs **/
  const [inputString, setInputString] = useState('')
  const [multipleInputString, setMultipleInputString] = useStorage('editor__multipleInput', '[]')
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

  const [isSharing, setIsSharing] = useState(false)
  const onShare = useCallback(() => {
    setIsSharing(true)
    // XXX: we're using a setTimeout to ensure the debounce is finished
    setTimeout(
      () => {
        const data = JSON.stringify({
          'type': 'tm',
          'initial': initialState,
          'final': serializeFinalStates(finalStates),
          states: statesString,
          transitions: serializeTransitionMap(transitions),
          multipleInput: multipleInputString
        })

        return fetch('https://api.jsonbin.io/b', {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'secret-key': SECRET_KEY,
            'collection-id':	COLLECTION_ID,
            'private': false
          } as any,
          body: data
        })
        .then((res) => {
          setIsSharing(false)
          return res.json()
        })
      },
      1000
    )
  }, [initialState, finalStates, statesString, transitions, multipleInputString, setIsSharing])

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
    setMultipleInput,
    onShare,
    isSharing
  ]
}
