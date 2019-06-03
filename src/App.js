import React from 'react'
import Resolver from './Resolver'
import { BrowserRouter } from 'react-router-dom'
import AlertProvider from './core/AlertProvider'

// TODO: Refactor (handle this in one place)
function App() {
  return (
    <BrowserRouter>
      <AlertProvider>
        <Resolver />
      </AlertProvider>
    </BrowserRouter>
  )
}

export default App
