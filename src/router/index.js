import { createRouter, createWebHistory } from 'vue-router'
import WeatherHomeView from '@/views/WeatherHomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: WeatherHomeView,
    },
    {
      path: '/weather/:cityId',
      name: 'detail',
      component: () => import('../views/WeatherDetailView.vue'),
      props: true,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

export default router
