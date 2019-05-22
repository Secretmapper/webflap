import React, { useCallback, useState } from 'react'
import nanoid from 'nanoid'
import { Route } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import Automata from './automata'

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
    <BrowserRouter>
      <Route
        exact
        path="/"
        render={props => (
          <Automata
            {...props}
            key={key}
            onLoadFile={onLoadFile}
            showModal={showModal}
            setShowModal={setShowModal}
          />
        )}
      />
      <Route
        path="/diagram/:id"
        render={props => (
          <Automata
            {...props}
            key={key}
            onLoadFile={onLoadFile}
            showModal={showModal}
            setShowModal={setShowModal}
          />
        )}
      />
    </BrowserRouter>
  )
}

export default App
