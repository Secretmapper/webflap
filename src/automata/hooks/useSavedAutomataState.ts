import { useState } from 'react'
import useSavedAutomata, { serializeTransitionMap, serializeFinalStates } from './useSavedAutomata'
import {
  initialState as initialStateFixture,
  finalStates as finalStatesFixture,
  states as statesFixture,
  transitions as transitionsFixture
} from '../tm.fixtures'

function useSavedAutomataState () {
  return useSavedAutomata(
    (k, v) => useState(v),
    {
      statesDefault: JSON.stringify(Array.from(statesFixture.values())),
      transitionsDefault: serializeTransitionMap(transitionsFixture),
      finalStatesDefault: serializeFinalStates(finalStatesFixture),
      initialStateDefault: initialStateFixture
    }
  )
}

export default useSavedAutomataState
