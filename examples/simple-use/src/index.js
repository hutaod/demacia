import { hot } from 'react-hot-loader/root'
import React from 'react'
import ReactDom from 'react-dom'
import { Provider } from 'react-redux'
import store from './store'
import Routes from './routes'

const App = hot(
  <Provider store={store}>
    <Routes />
  </Provider>
)

const app = <App />
const container = document.getElementById('root')
ReactDom.render(app, container)
