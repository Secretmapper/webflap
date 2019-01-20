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
    const transLabel = transition.label

    if (unprocessedInput.startsWith(transLabel)) {
      configs.push({
        state: transition.target,
        input: configuration.input,
        unprocessed: unprocessedInput.substr(transLabel.length)
      })
    }
  })

  return configs
}
