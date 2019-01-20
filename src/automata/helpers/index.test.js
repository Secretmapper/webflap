import { step, resolveConfig, isConfigAccepted } from './index'
import {
  initialState,
  finalStates,
  states,
  transitions
} from '../automata.fixtures'

const createConfig = (input = 'a') => ({
  state: states.get(initialState),
  input,
  unprocessed: input
})

describe('automata', function() {
  it('shifts unprocessed input', function() {
    const configs = step(transitions, createConfig())
    expect(configs[0].unprocessed).toHaveLength(0)
  })
  it('moves to state transition', function() {
    const configs = step(transitions, createConfig())
    expect(configs[0].state.data.id).toBe('q1')
  })
  it('moves to both equally valid transitions', function() {
    const configs = step(transitions, createConfig('b'))
    expect(configs).toHaveLength(2)
  })
  it('moves to self reference', function() {
    const configs = step(transitions, createConfig('s'))
    expect(configs[0].state.data.id).toBe('q0')
    expect(configs).toHaveLength(1)
  })
  it("don't travel when there is no transition", function() {
    const q3c = step(transitions, createConfig('bc'))
    const configs = step(transitions, q3c[0])
    expect(configs).toHaveLength(0)
  })
  it('travels path', function() {
    const q3c = step(transitions, createConfig('bc'))
    const configs = step(transitions, q3c[1])
    expect(configs).toHaveLength(1)
    expect(configs[0].state.data.id).toBe('q4')
  })
  it('recognizes accepted state config', function() {
    const q3c = step(transitions, createConfig('bc'))
    const configs = step(transitions, q3c[1])
    expect(isConfigAccepted(finalStates, configs[0])).toBe(true)
  })
  it('resolveConfig returns accepted config when input is accepted', function() {
    const config = resolveConfig(transitions, createConfig('bc'), finalStates)
    expect(isConfigAccepted(finalStates, config)).toBe(true)
  })
  it('resolveConfig returns null when input is rejected', function() {
    const config = resolveConfig(transitions, createConfig('bcd'), finalStates)
    expect(config).toBeNull()
  })
})
