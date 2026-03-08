import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LearnView from '../views/LearnView.vue'
import DiscussView from '../views/DiscussView.vue'
import GameView from '../views/GameView.vue'
import AdminView from '../views/AdminView.vue'
import ScreenView from '../views/ScreenView.vue'
import RealityView from '../views/RealityView.vue'
import RealityAdminView from '../views/RealityAdminView.vue'
import RealityScreenView from '../views/RealityScreenView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/learn', component: LearnView },
  { path: '/discuss', component: DiscussView },
  { path: '/game', component: GameView },
  { path: '/admin', component: AdminView },
  { path: '/screen', component: ScreenView },
  { path: '/reality', component: RealityView, name: 'reality' },
  { path: '/reality/join/:sessionId', component: RealityView, name: 'reality-join' },
  { path: '/reality/admin', component: RealityAdminView, name: 'reality-admin' },
  { path: '/reality/screen/:sessionId?', component: RealityScreenView, name: 'reality-screen' },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
