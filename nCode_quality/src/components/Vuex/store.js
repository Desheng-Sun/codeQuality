import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  // 定义状态
  state: {
    commit_id: "easyexcel_3"
  },
  mutations: {
    setcommit_id(state, param) {
      console.log(param.newid)
      state.commit_id = param.newid
    }
  }
})

export default store