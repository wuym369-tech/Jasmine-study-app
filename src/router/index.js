import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LearnView from '../views/LearnView.vue'
import DiscussView from '../views/DiscussView.vue'
import GameView from '../views/GameView.vue'
import AdminView from '../views/AdminView.vue'
import ScreenView from '../views/ScreenView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/learn', component: LearnView },
  { path: '/discuss', component: DiscussView },
  { path: '/game', component: GameView },
  { path: '/admin', component: AdminView },
  { path: '/screen', component: ScreenView },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
