import isNode from 'detect-node'
import checkModel from './utils/checkModel'
import createReducers from './createReducers'
import { injectReducer, injectEffects, allModels } from './store'

/**
 * 处理model
 * @param {Object} model
 */
export default function createModel(model) {
  if (!isNode) {
    checkModel(model, allModels)
  }

  let selectors = null
  if (model.selectors) {
    selectors = (state) => model.selectors(state)
  }
  if (model.reducers) {
    const reducer = createReducers(model)
    injectReducer(model.namespace, reducer)
  }
  if (model.effects) {
    injectEffects(model.namespace, model.effects)
  }
  return { selectors }
}
