import Vue from 'vue'
import Vuex from 'vuex'
import action from './action.js'
import mutations from './mutations.js'

Vue.use(Vuex)

const state = {
	"gameData":[],
	"timer":'',
	"score":0,
	"start":false,
}

export default new Vuex.Store({
	state,
	action,
	mutations
})