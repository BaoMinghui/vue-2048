import Vue from 'vue'
import Router from 'vue-router'
import Game from '@/components/game2048'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Game',
      component: Game
    }
  ]
})
