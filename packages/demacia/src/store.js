import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import isNode from 'detect-node'
import isPlainObject from './utils/isPlainObject'
import checkModel from './utils/checkModel'
import createReducers from './createReducers'

let store = null
const allReducer = {}
const allEffects = {}
export const allModels = {}

/**
 * 动态注入reducer
 * @param {String} namespace
 * @param {Function} reducer
 */
export function injectReducer(namespace, reducer) {
  if (!namespace || typeof namespace !== 'string') {
    if (process.env.NODE_ENV !== 'production') {
      throw Error('error')
    }
    return
  }
  if (!reducer || typeof reducer !== 'function') {
    if (process.env.NODE_ENV !== 'production') {
      throw Error('reducer must be a function')
    }
    return
  }
  allReducer[namespace] = reducer
  if (store) {
    store.replaceReducer(combineReducers(allReducer))
  }
}

/**
 * 动态注入effects
 * @param {String} namespace
 * @param {Function} effects
 */
export function injectEffects(namespace, effects) {
  if (!namespace || typeof namespace !== 'string') {
    if (process.env.NODE_ENV !== 'production') {
      throw Error('error')
    }
    return
  }
  if (!effects || typeof effects !== 'object' || Array.isArray(effects)) {
    if (process.env.NODE_ENV !== 'production') {
      throw Error('effects must be a object')
    }
    return
  }
  allEffects[namespace] = effects
}

function createEffectsMiddle(effectsExtraArgument) {
  return store => dispatch => action => {
    if (isPlainObject(action) && typeof action.type === 'string') {
      const { type, ...args } = action
      const actionType = action.type.split('/')
      const namespace = actionType[0]
      const actualtype = actionType[1]

      if (allEffects[namespace] && allEffects[namespace][actualtype]) {
        dispatch({ type: `${namespace}/@@setLoading`, payload: actualtype })
        return new Promise((resolve, reject) => {
          const state = store.getState()
          allEffects[namespace][actualtype](
            {
              ...effectsExtraArgument,
              dispatch: ({ type, ...rest }) => {
                return dispatch({
                  type: `${namespace}/${type}`,
                  ...rest
                })
              },
              state: state[namespace]
            },
            { ...args }
          )
            .then(res => {
              resolve(res)
              dispatch({
                type: `${namespace}/@@deleteLoading`,
                payload: actualtype
              })
            })
            .catch(err => {
              reject(err)
              dispatch({
                type: `${namespace}/@@deleteLoading`,
                payload: actualtype
              })
            })
        })
      }
      return dispatch(action)
    }
    return dispatch(action)
  }
}

function demacia({
  initialState,
  initialModels,
  middlewares = [],
  effectsExtraArgument = {}
}) {
  // 初始model
  if (isPlainObject(initialModels)) {
    for (const key in initialModels) {
      const initialModel = initialModels[key]
      if (isPlainObject(initialModel)) {
        if (!isNode) {
          checkModel(initialModel, allModels)
        }
        if (initialModel.reducers) {
          const reducer = createReducers(initialModel)
          injectReducer(initialModel.namespace, reducer)
        }
        if (initialModel.effects) {
          injectEffects(initialModel.namespace, initialModel.effects)
        }
      }
    }
  }

  // effects处理的中间件
  const effectsMiddle = createEffectsMiddle(effectsExtraArgument)

  let composeEnhancers = compose
  if (!isNode) {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
  }
  // 可能初始化的时候allReducer还为空对象
  const reducer =
    Object.keys(allReducer).length > 0
      ? combineReducers(allReducer)
      : function reducer(state) {
          return state
        }
  // 创建store
  store = createStore(
    reducer,
    initialState,
    composeEnhancers(applyMiddleware(effectsMiddle, ...middlewares))
  )

  return store
}

export default demacia
