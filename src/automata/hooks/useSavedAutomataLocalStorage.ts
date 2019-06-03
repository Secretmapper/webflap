import useLocalStorage from 'react-use-localstorage'
import useSavedAutomata, { serializeTransitionMap, serializeFinalStates } from './useSavedAutomata'
import sample from '../Samples/0n2.fixture'

function useSavedAutomataLocalStorage () {
  return useSavedAutomata(
    useLocalStorage,
    {
      statesDefault: sample.states,
      transitionsDefault: sample.transitions,
      finalStatesDefault: sample.final,
      initialStateDefault: sample.initial
    }
  )
}

export default useSavedAutomataLocalStorage
