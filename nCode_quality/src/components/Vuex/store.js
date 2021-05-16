import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  // 定义状态
  state: {
    commitId: "easyexcel_3",
    Issues:[],
    commitInfoNow:[]
  },
  mutations: {
    setcommitId(state, param) {
      state.commitId = param.newid
    },
    setIssues(state, param) {
      state.Issues = param.newIssues
    },
    setcommitInfoNow(state, param) {
      state.commitInfoNow = param.newcommitInfoNow
    }
  }
})

export default store