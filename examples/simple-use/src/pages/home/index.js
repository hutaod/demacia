import React from 'react'
import { Button } from 'antd'
import { connect } from 'react-redux'

const HomePage = props => {
  return (
    <div>
      <div>globalCounter: {props.global.counter}</div>
      <Button
        onClick={() => {
          props.dispatch({ type: 'global/increment' })
        }}
      >
        同步increment
      </Button>
      <Button
        onClick={() => {
          props.dispatch({ type: 'global/add' })
        }}
      >
        异步increment
      </Button>
    </div>
  )
}

export default connect(state => state)(HomePage)
