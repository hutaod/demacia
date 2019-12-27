import { demacia } from '../demacia'
import global from './global'

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
  initialState
})

export default store
