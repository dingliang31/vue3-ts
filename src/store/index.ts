import { Store, createStore } from 'vuex'
import { ComponentCustomProperties } from 'vue'

declare module '@vue/runtime-core' {
  interface state {

  }
  interface ComponentCustomProperties {
    $store: Store<state>
  }
}

export default createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
