import { hot } from 'react-hot-loader/root'
import React from 'react'
import ReactDom from 'react-dom'
import Routes from './routes'

const App = hot(Routes)

const app = <App />
const container = document.getElementById('root')
ReactDom.render(app, container)
