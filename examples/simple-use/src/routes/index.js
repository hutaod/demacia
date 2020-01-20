import React from 'react'

import { Switch, Route } from 'react-router-dom'
import TestRedux from '../pages/test-redux'
import Home from '../pages/home'

export default (
  <Switch>
    <Route path="/test-redux" exact component={TestRedux} />
    <Route path="/" exact component={Home} />
  </Switch>
)
