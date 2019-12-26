import React from 'react'

import { Switch, Route } from 'react-router-dom'
import TestRedux from '../pages/test-redux'

export default (
  <Switch>
    <Route path="/test-redux" component={TestRedux} />
  </Switch>
)
