import React from 'react'
import Resolver from './Resolver'
import { BrowserRouter } from 'react-router-dom'

// TODO: Refactor (handle this in one place)
function App() {
  return (
    <BrowserRouter>
      <Resolver />
    </BrowserRouter>
  )
}

export default App
