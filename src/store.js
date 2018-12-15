import Vue from 'vue'
import Vuex from 'vuex'
import io from 'socket.io-client'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    socket: io(),
    hello: "first"
  },
  getters: {
    getSocket: state => state.socket,
    getHello: state => state.hello
  },
  mutations: { //manipulating data in the store
    changeHello(state, msg) {
      state.hello = msg;
    }
  },
  actions: {
    changeHello({commit}, msg) {
      commit('changeHello',msg)
    }
  }
})
