![亚瑟](docs/images/yase.jpeg)

# 打造一个 redux 数据流方案 --- 名为 demacia

目的：打造一个简单的 `redux` 数据流方案，实现功能类似与 `dva`，但仅仅只是对 redux 进行封装，简化 redux 使用流程和难度。最终目的肯定是为了提升开发效率和加深自己对 redux 源码的理解能力和运用能力

如果你对 redux 理解还不够深入，想要完全理解它，可以看一下这篇文章：[完全理解 redux（从零实现一个 redux）](https://mp.weixin.qq.com/s/idWmfUbPVVqK7Yi0_9NC4A)

## 名称介绍

仓库名称叫 `demacia`，有没有熟悉的既视感，对，就是德玛西亚，命名缘由：没啥缘由，英雄联盟只玩过德玛西亚，玩过几次，王者荣耀常玩英雄-亚瑟（2016 年刚毕业连续玩了两百把 😂）。

## 先讲使用

编写 redux 部分的方式和 dva 类似，主要是引入方式和使用方式有所区别

### 快速上手

进入自己的 react 项目，通过 npm 安装 demacia

```bash
npm install demacia -S
```

### 项目中使用

#### 1. 创建 store

在 src 下创建一个 store 文件用于创建仓库

```js
// src/store/index.js
import { demacia } from 'demacia'
// 这里引入了一个名为global的model
import global from './global'

// 需要初始化创建的model
const initialModels = {
  global
}

// 设置state初始值，用于全局初始化数据，比如当需要持久化存储时，会很方便
const initialState = {
  global: {
    counter: 2
  }
}

// 调用demacia并传入初始参数，返回了redux的store
const store = demacia({
  initialModels,
  initialState,
  middlewares: [], // 加入中间件
  effectsExtraArgument: {} // 额外参数
})

export default store
```

上面的代码中，我们引入了 `demacia` 函数，并调用它，然后返回了 `store`，这个 `store` 就是调用 `redux` 的 `createStore` 函数生成的，我们在调用 `demacia` 函数时传入了一个对象作为参数，并包含了两个初始化属性，`initialModels` 用于注入 `model` 数据，`initialState` 用于设置 `redux` 初始 `state`。

模块 global.js 代码如下

```js
// src/store/模块global.js
export default {
  namespace: 'global',
  state: {
    counter: 0
  },
  reducers: {
    increment(state, { payload }) {
      return {
        ...state,
        counter: state.counter + 1
      }
    },
    decrement(state, { payload }) {
      return {
        ...state,
        counter: state.counter - 1
      }
    }
  },
  effects: {
    async add({ dispatch }, { payload }) {
      const res = await new Promise(resolve => {
        setTimeout(() => {
          resolve({ code: 1, success: true })
        }, 1000)
      })
      dispatch({
        type: 'increment',
        payload: res
      })
    }
  }
}
```

#### 2. 页面引入

使用`react-redux`把 store 加入项目，这里跟 redux 一样

```js
// src/App.js
import React from 'react'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import store from './store'
import routes from './routes'

function App() {
  return (
    <Provider store={store}>
      <HashRouter>{routes}</HashRouter>
    </Provider>
  )
}
```

页面中使用`react-redux`的`connect`方法获取 state

```jsx
// src/pages/home/index.js
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
```

触发同步或者异步操作，都通过`dispatch`来分发对应模块对应的`action`或`effects action`

上面使用的都是全局的 state，如果某个页面或者某个组件想有直接的状态呢，或者说是动态的向 store 添加 state 和 reducer，这时候可以引入 `model` 来进行处理。

下面建一个页面 a，实现一个 `todo list`

`todo list` 需要一个用于存数据的 state，需要一个

```js
// src/pages/a/model.js
import { model } from 'demacia'
import { createStructuredSelector } from 'reselect'

export default model({
  namespace: 'A',
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

// src/pages/a/index.js
import React, { useEffect, useState } from 'react'
import Counter from './components/Counter'
import model from './model'

const A = props => {
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
      <Counter />
    </div>
  )
}

export default model(A)
```
