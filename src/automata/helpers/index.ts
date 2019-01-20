import flatten from 'lodash.flatten'

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
  label: string
}

type AutomataStates = Map<string, AutomataState>
type AutomataTransitions = Map<string, AutomataTransition>

/**
 * Configuration of the current state step in an automaton
 **/
type AutomataConfiguration = {
  hash: string,
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
        state: transition.target,
        input: configuration.input,
        unprocessed: unprocessedInput.substr(transLabel.length)
      })
    }
  })

  return configs
}

export function isConfigAccepted(finalStates: Array<string>, config: AutomataConfiguration) {
  return (
    config.unprocessed.length === 0
    && finalStates.indexOf(config.state.data.id) !== -1
  )
}

export function resolveConfig(
  transitions:AutomataTransitions,
  configuration: AutomataConfiguration,
  finalStates: Array<string>
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
