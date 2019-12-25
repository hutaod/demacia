import React, { Component, useState } from 'react'

const Counter = function() {
  const [counter, setCounter] = useState(0)
  return (
    <div>
      <h2>{counter}</h2>
      <button
        onClick={() => {
          setCounter(counter + 1)
        }}
      >
        测试
      </button>
    </div>
  )
}

export default class Index extends Component {
  state = {
    counter: 0
  }
  render() {
    return (
      <div>
        <Counter />
      </div>
    )
  }
}
