import React, { useCallback, useState } from 'react'
import Automata from './automata'
import nanoid from 'nanoid'

// TODO: Refactor (handle this in one place)
function App() {
  const [key, setKey] = useState('')
  const [showModal, setShowModal] = useState(true)

  const onLoadFile = useCallback(
    data => {
      window.localStorage.setItem('editor__states', data.states)
      window.localStorage.setItem('editor__transitions', data.transitions)
      window.localStorage.setItem('editor__finalStates', data['final'])
      window.localStorage.setItem('editor__initialState', data.initial)
      window.localStorage.setItem('editor__multipleInput', data.multipleInput)

      setKey(nanoid())
      setShowModal(false)
    },
    [setKey]
  )

  return (
    <Automata
      key={key}
      onLoadFile={onLoadFile}
      showModal={showModal}
      setShowModal={setShowModal}
    />
  )
}

export default App
