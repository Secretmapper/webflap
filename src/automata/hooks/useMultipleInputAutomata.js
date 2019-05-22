import { useCallback, useState } from 'react'

function useMultipleInputAutomata({
  finalStates,
  initialConfig,
  initialState,
  multipleInput,
  resolveConfig,
  transitions
}) {
  const [multipleInputConfigs, setMultipleInputConfigs] = useState([])

  const onRunMultipleInput = useCallback(
    e => {
      setMultipleInputConfigs(
        multipleInput.map(input =>
          resolveConfig(
            transitions,
            initialConfig(initialState, input),
            finalStates
          )
        )
      )
    },
    [multipleInput, setMultipleInputConfigs]
  )

  return [multipleInputConfigs, onRunMultipleInput]
}

export default useMultipleInputAutomata
