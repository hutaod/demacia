import React, { Component } from 'react'
import { connect } from 'react-redux'

class Counter extends Component {
  render() {
    return (
      <div>
        <h2>counter组件</h2>
        <div>counter: {this.props.counter}</div>
        <button
          onClick={() => {
            this.props.dispatch({ type: 'global/add' })
          }}
        >
          add counter
        </button>
      </div>
    )
  }
}
export default connect(state => state.global)(Counter)
