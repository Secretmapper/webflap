const q0 = { data: { id: 'q0', label: 'q0' }, position: { x: 50, y: 50 } }
const q1 = { data: { id: 'q1', label: 'q1' }, position: { x: 100, y: 150 } }
const q2 = { data: { id: 'q2', label: 'q2' }, position: { x: 150, y: 50 } }
const q3 = { data: { id: 'q3', label: 'q3' }, position: { x: 200, y: 150 } }
const q4 = { data: { id: 'q4', label: 'q4' }, position: { x: 250, y: 50 } }

export const states = new Map([
  ['q0', q0],
  ['q1', q1],
  ['q2', q2],
  ['q3', q3],
  ['q4', q4]
])

export const transitions = new Map([
  [
    'q0-q1',
    { id: 'q0-q1', source: q0, target: q1, left: 'a', label: 'a', right: 'R' }
  ],
  [
    'q0-q2',
    { id: 'q0-q2', source: q0, target: q2, left: 'b', label: 'b', right: 'R' }
  ],
  [
    'q0-q3',
    { id: 'q0-q3', source: q0, target: q3, left: '', label: '', right: 'R' }
  ],
  [
    'q3-q4',
    { id: 'q3-q4', source: q3, target: q4, left: 'c', label: 'c', right: 'R' }
  ],
  [
    'q0-q0',
    { id: 'q0-q0', source: q0, target: q0, left: 's', label: 's', right: 'R' }
  ]
])

export const initialState = 'q0'
export const finalStates = new Set(['q4'])
