import useLocalStorage from 'react-use-localstorage'
import useSavedAutomata, { serializeTransitionMap, serializeFinalStates } from './useSavedAutomata'
import {
  initialState as initialStateFixture,
  finalStates as finalStatesFixture,
  states as statesFixture,
  transitions as transitionsFixture
} from '../tm.fixtures'

function useSavedAutomataLocalStorage () {
  return useSavedAutomata(
    useLocalStorage,
    {
      statesDefault: JSON.stringify(Array.from(statesFixture.values())),
      transitionsDefault: serializeTransitionMap(transitionsFixture),
      finalStatesDefault: serializeFinalStates(finalStatesFixture),
      initialStateDefault: initialStateFixture
    }
  )
}

export default useSavedAutomataLocalStorage
