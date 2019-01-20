import { step } from './index'

const position = { x: 0, y: 0 }
const q0 = { data: { id: 'q0', label: 'q0' }, position }
const q1 = { data: { id: 'q1', label: 'q1' }, position }
const q2 = { data: { id: 'q2', label: 'q2' }, position }
const q3 = { data: { id: 'q3', label: 'q3' }, position }
const q4 = { data: { id: 'q4', label: 'q4' }, position }

const states = new Map([
  ['q0', q0],
  ['q1', q1],
  ['q2', q2],
  ['q2', q3],
  ['q4', q4]
])

const transitions = new Map([
  ['q0-q1', { source: q0, target: q1, label: 'a' }],
  ['q0-q2', { source: q0, target: q2, label: 'b' }],
  ['q0-q3', { source: q0, target: q3, label: 'b' }],
  ['q3-q4', { source: q3, target: q4, label: 'c' }],
  ['q0-q0', { source: q0, target: q0, label: 's' }]
])

const initialState = 'q0'
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
  it('travels path', function() {
    const q3c = step(transitions, createConfig('bc'))
    const configs = step(transitions, q3c[0])
    expect(configs).toHaveLength(1)
    expect(configs[0].state.data.id).toBe('q4')
  })
})
