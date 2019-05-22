import { useCallback, useState } from 'react'

function useMultipleInputAutomata({
  finalStates,
  initialConfig,
  initialState,
  multipleInput,
  lazyResolveConfig,
  transitions
}) {
  const [multipleInputConfigs, setMultipleInputConfigs] = useState([])

  const onRunMultipleInput = useCallback(
    e => {
      setMultipleInputConfigs(
        multipleInput.map(input => {
          const resolver = lazyResolveConfig(
            transitions,
            initialConfig(initialState, input),
            finalStates
          )
          const { value, done } = resolver.next()

          return {
            resolver,
            value,
            done
          }
        })
      )
    },
    [multipleInput, setMultipleInputConfigs]
  )
  const continueConfig = useCallback(index => {
    setMultipleInputConfigs(
      multipleInputConfigs.map((input, i) => {
        if (index === i) {
          const { resolver } = input
          const { value, done } = resolver.next()

          return {
            resolver,
            value,
            done
          }
        } else {
          return input
        }
      })
    )
  })

  return [multipleInputConfigs, onRunMultipleInput, continueConfig]
}

export default useMultipleInputAutomata
