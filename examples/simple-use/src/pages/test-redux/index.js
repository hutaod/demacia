import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import model from './model'

const TestRedux = ({ dispatch, todos = [] }) => {
  const [input, setInput] = useState('')
  useEffect(() => {
    dispatch({
      type: 'testRedux/getTodos'
    })
  }, [dispatch])

  return (
    <div>
      <h2>水果蔬菜</h2>
      <div>
        <input value={input} onChange={e => setInput(e.target.value)} />
        <button
          onClick={async () => {
            await dispatch({
              type: 'testRedux/add',
              payload: {
                name: input,
                id: Math.random()
                  .toString(16)
                  .slice(2)
              }
            })
            setInput('')
          }}
        >
          添加
        </button>
      </div>
      <ul>
        {todos.map(fruit => (
          <li key={fruit.id}>{fruit.name}</li>
        ))}
      </ul>
    </div>
  )
}

function mapStateToProps(state) {
  // console.log('state', state)

  return {
    ...state.testRedux
  }
}
console.log(TestRedux)
console.log(model(TestRedux))

export default model(TestRedux)
