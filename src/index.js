import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { AppRegistry } from 'react-native'
import 'typeface-montserrat'

import Cytoscape from 'cytoscape'
import edgehandles from 'cytoscape-edgehandles'
import cxtmenu from 'cytoscape-cxtmenu'
import undoRedo from 'cytoscape-undo-redo'

Cytoscape.use(edgehandles)
Cytoscape.use(cxtmenu)
undoRedo(Cytoscape)

// register the app
AppRegistry.registerComponent('App', () => App)

AppRegistry.runApplication('App', {
  initialProps: {},
  rootTag: document.getElementById('root')
})

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
