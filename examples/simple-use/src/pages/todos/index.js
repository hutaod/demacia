import React, { useEffect, useState } from 'react'
import model from './model'

const Todos = props => {
  const { todos = [], total, getTodos, loading } = props
  const [input, setInput] = useState('')
  useEffect(() => {
    getTodos()
  }, [getTodos])

  return (
    <div>
      <h2>水果蔬菜(total: {total})</h2>
      <div>
        <input value={input} onChange={e => setInput(e.target.value)} />
        <button
          onClick={async () => {
            await props.add({
              name: input,
              id: Math.random()
                .toString(16)
                .slice(2),
              count: parseInt(Math.random() * 10)
            })
            setInput('')
          }}
        >
          添加
        </button>
      </div>
      {loading.includes('getTodos') ? (
        'loading...'
      ) : (
        <ul>
          {todos.map(fruit => (
            <li key={fruit.id}>{fruit.name}</li>
          ))}
        </ul>
      )}
      <div>
        <button
          onClick={() => {
            props.resetStore()
          }}
        >
          resetStore
        </button>
        <button
          onClick={() => {
            props.setStore('haha')
          }}
        >
          setStore
        </button>
      </div>
    </div>
  )
}

export default model(Todos)
