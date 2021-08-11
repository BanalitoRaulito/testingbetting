import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: () => ({
      counter: 0,
      info: {}
    }),
    mutations: {
      increment(state, int) {
        state.counter+= int
      }
    }
  })
}

export default createStore
