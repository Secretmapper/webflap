import React, { useCallback, useState } from 'react'
import nanoid from 'nanoid'
import { Route } from 'react-router'
import useReactRouter from 'use-react-router'
import Automata from './automata'
import APILoadableAutomata from './automata/APILoadableAutomata'

// TODO: Refactor (handle this in one place)
function Resolver() {
  const [key, setKey] = useState('')
  const [showModal, setShowModal] = useState(true)
  const { history } = useReactRouter()

  const onLoadFile = useCallback(
    data => {
      history.push('/')

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
    <React.Fragment>
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
          <APILoadableAutomata
            {...props}
            onLoadFile={onLoadFile}
            showModal={showModal}
            setShowModal={setShowModal}
          />
        )}
      />
    </React.Fragment>
  )
}

export default Resolver
