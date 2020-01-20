import { demacia } from 'demacia'
import { createAxios } from '../utils/axios'
import global from './global'

const $axios = createAxios({})

const initialModels = {
  global
}

const initialState = {
  global: {
    counter: 2
  }
}

const store = demacia({
  initialModels,
  initialState,
  effectsExtraArgument: {
    $axios
  }
})

export default store
