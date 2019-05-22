import { useState } from 'react'
import useSavedAutomata, { serializeTransitionMap, serializeFinalStates } from './useSavedAutomata'
import {
  initialState as initialStateFixture,
  finalStates as finalStatesFixture,
  states as statesFixture,
  transitions as transitionsFixture
} from '../tm.fixtures'

const defaultData = {
  statesDefault: JSON.stringify(Array.from(statesFixture.values())),
  transitionsDefault: serializeTransitionMap(transitionsFixture),
  finalStatesDefault: serializeFinalStates(finalStatesFixture),
  initialStateDefault: initialStateFixture
}

function useSavedAutomataState (initialData: any) {
  return useSavedAutomata(
    (k, v) => useState(v),
    initialData || defaultData
  )
}

export default useSavedAutomataState
