import flatten from 'lodash.flatten'

export const LAMBDA_CODE = String.fromCharCode(0x03bb)

type AutomataState = {
  data: {
    id: string,
    label: string
  },
  position: {
    x: number,
    y: number
  }
}

type AutomataTransition = {
  source: AutomataState,
  target: AutomataState,
  label: string,
  left: string,
  right: string
}

type AutomataStates = Map<string, AutomataState>
type AutomataTransitions = Map<string, AutomataTransition>

/**
 * Configuration of the current state step in an automaton
 **/
type AutomataConfiguration = {
  hash: string,
  parent: AutomataConfiguration,
  state: AutomataState,
  input: string,
  unprocessed: string
}

export function step (
  transitions:AutomataTransitions,
  configuration: AutomataConfiguration
): Array<AutomataConfiguration> {
  const configs: Array<AutomataConfiguration> = []
  const unprocessedInput = configuration.unprocessed

  // XXX: map && compact this?
  transitions.forEach((transition) => {
    if (configuration.state.data.id !== transition.source.data.id) {
      return 
    }

    const transLabel = transition.label

    if (unprocessedInput.startsWith(transLabel)) {
      configs.push({
        // TODO: use a hash from the path?
        hash: '' + Math.random(),
        parent: configuration,
        state: transition.target,
        input: configuration.input,
        unprocessed: unprocessedInput.substr(transLabel.length)
      })
    }
  })

  return configs
}

export function isConfigAccepted(finalStates: Set<string>, config: AutomataConfiguration) {
  return (
    config.unprocessed.length === 0
    && finalStates.has(config.state.data.id)
  )
}

export function resolveConfig(
  transitions:AutomataTransitions,
  configuration: AutomataConfiguration,
  finalStates: Set<string>
) {
  const lIsConfigAccepted = (config: AutomataConfiguration) => isConfigAccepted(finalStates, config)
  let configs = [configuration]

  do {
    for (let i = 0; i < configs.length; i++) {
      if (lIsConfigAccepted(configs[i])) {
        return configs[i]
      }
    }

    configs = flatten(configs.map(c => step(transitions, c)))
  } while (configs.length !== 0)

  return null
}

export function makeTMTransitionLabel(
  transition: AutomataTransition
) {
  return `${transition.left || LAMBDA_CODE} ; ${transition.label || LAMBDA_CODE} ; ${transition.right}`
}
