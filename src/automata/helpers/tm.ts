import nanoid from 'nanoid'
import {
  AutomataConfiguration,
  AutomataTransitions,
  initialConfig as automataInitialConfig,
  resolveConfig as resolveConfigRaw,
  BLANK_CODE
} from './index'

/**
 * Configuration of the current state step in an tm
 **/
// TODO: properly split automata and tm type
export type TuringMachineConfiguration = AutomataConfiguration & {
  head: number,
  // XXX: Use a string buffer?
  tape: string
}

export function initialConfig (initialState: number, input = 'bc') {
  return {
    ...automataInitialConfig(initialState, input),
    tape: input + BLANK_CODE.repeat(Math.max(0, 20 - input.length)),
    head: 0
  }
}

function moveHead(
  head: number,
  direction: 'L' | 'R'
) {
  if (direction === 'L') {
    return head - 1
  } else if (direction === 'R') {
    return head + 1
  }

  throw new Error('Tape direction is invalid')

  return head
}

function writeHead(
  tape: string,
  head: number,
  toWrite: string
) {
  return tape.substr(0, head) + toWrite + tape.substr(head + 1)
}

export function step (
  transitions:AutomataTransitions,
  configuration: TuringMachineConfiguration
): Array<TuringMachineConfiguration> {
  const configs: Array<TuringMachineConfiguration> = []

  // XXX: map && compact this?
  transitions.forEach((transition) => {
    if (configuration.state.data.id !== transition.source.data.id) {
      return 
    }

    const toRead = transition.left
    const toWrite = transition.label
    const toMove = transition.right

    const headSymbol = configuration.tape[configuration.head]
    const isValidRead = headSymbol === toRead || toRead === BLANK_CODE && headSymbol === ' '

    if (isValidRead) {
      let tape = writeHead(configuration.tape, configuration.head, toWrite)
      let head = moveHead(configuration.head, toMove)

      if (head >= configuration.tape.length) {
        tape += BLANK_CODE.repeat(Math.min(100, configuration.tape.length))
      } else if (head < 0) {
        tape = BLANK_CODE.repeat(Math.abs(head)) + tape
        head = 0
      }

      configs.push({
        // TODO: use a hash from the path?
        hash: nanoid(),
        parent: configuration,
        state: transition.target,
        input: configuration.input,
        tape,
        head,
        unprocessed: ''
      })
    }
  })

  return configs
}

export function isConfigAccepted(finalStates: Set<string>, config: AutomataConfiguration) {
  return (finalStates.has(config.state.data.id))
}

export function resolveConfig(
  transitions: AutomataTransitions,
  configuration: AutomataConfiguration,
  finalStates: Set<string>,
) {
  return resolveConfigRaw(transitions, configuration, finalStates, step, isConfigAccepted)
}

/**
 * Lazily resolves configuration
 *
 * @remarks
 * TODO: Needs to have a dfa version
 */
export function* lazyResolveConfig(
  transitions:AutomataTransitions,
  configuration: AutomataConfiguration,
  finalStates: Set<string>,
  // count of configurations each iteration to 'pause' at
  configSteps: number = 100,
  // TODO: this should be a generic
  stepFn: (transitions: AutomataTransitions, configuration: any) => Array<any> = step,
  isConfigAcceptedFn: (finalStates: Set<string>, config: any) => boolean = isConfigAccepted
) {
  const lIsConfigAccepted = (config: AutomataConfiguration) => isConfigAcceptedFn(finalStates, config)
  let configs: Array<any> = [configuration]

  let stepIterations = 1
  let configCount = configSteps

  do {
    let newConfigs: Array<any> = []

    for (let i = 0; i < configs.length; i++) {
      if (lIsConfigAccepted(configs[i])) {
        return configs[i]
      }
    }

    for (let i = 0; i < configs.length; i++) {
      newConfigs = newConfigs.concat(stepFn(transitions, configs[i]))

      configCount--

      if (configCount === 0) {
        yield stepIterations * configSteps
        configCount = configSteps
        stepIterations++
      }
    }

    configs = newConfigs.slice()
  } while (configs.length !== 0)

  return null
}
