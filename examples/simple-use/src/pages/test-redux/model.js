import { model } from 'demacia'

export default model({
  namespace: 'testRedux',
  selectors: state => {
    return { ...state }
  },
  state: {
    todos: []
  },
  reducers: {
    putTodos(state, { payload }) {
      return {
        ...state,
        todos: payload || []
      }
    },
    putAdd(state, { payload }) {
      return {
        ...state,
        todos: [...state.todos, payload]
      }
    }
  },
  effects: {
    async getTodos({ dispatch }) {
      const { datas } = await new Promise(resolve => {
        setTimeout(() => {
          resolve({
            code: 0,
            datas: [
              { name: '🍎', id: 1 },
              { name: '🍆', id: 2 }
            ]
          })
        }, 1000)
      })

      dispatch({ type: 'putTodos', payload: datas })
    },

    async add({ dispatch }, { payload }) {
      const { code } = await new Promise(resolve => {
        setTimeout(() => {
          resolve({
            code: 0
          })
        }, 200)
      })
      if (code === 0) {
        dispatch({ type: 'putAdd', payload: payload })
      }
    }
  }
})
