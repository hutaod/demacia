import { model } from '../../demacia'
import {
  createStructuredSelector
  // createSelector
} from 'reselect'

// const totalSelector = createSelector(
//   state => state.testRedux.todos,
//   todos => {
//     return todos.reduce((acc, item) => acc + (item.count || 0), 0)
//   }
// )

export default model({
  namespace: 'testRedux',
  // selectors: state => {
  //   return {
  //     todos: state.testRedux.todos,
  //     total: totalSelector(state)
  //   }
  // },
  selectors: createStructuredSelector({
    todos: state => {
      // console.log(state)
      return state.testRedux.todos
    },
    loading: state => state.testRedux.loading,
    total: state => {
      // console.log(state)
      return state.testRedux.todos.reduce(
        (acc, item) => acc + (item.count || 0),
        0
      )
    }
  }),
  state: {
    todos: [{ name: '菠萝', id: 0, count: 2 }]
  },
  reducers: {
    putTodos(state, { payload }) {
      return {
        ...state,
        todos: [...state.todos, ...payload]
      }
    },
    putAdd(state, { payload }) {
      return {
        ...state,
        todos: [...state.todos, payload]
      }
    },
    setStore(state, { payload }) {
      // console.log(payload)

      return state
    }
  },
  effects: {
    async getTodos({ dispatch }) {
      const { datas } = await new Promise(resolve => {
        setTimeout(() => {
          resolve({
            code: 0,
            datas: [
              { name: '🍎', id: 1, count: 11 },
              { name: '🍆', id: 2, count: 22 }
            ]
          })
        }, 1000)
      })

      dispatch({ type: 'putTodos', payload: datas })
    },

    async add({ dispatch }, { payload }) {
      console.log('add', payload)

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
