import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BossList from '../components/BossList.vue'
import BossDetail from '../components/BossDetail.vue'
import EventCategoryDetail from '../components/EventCategoryDetail.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from) {
    if ((to.hash == null || to.hash === '') && from.path !== to.path) {
      return { top: 0 }
    } else if (to.hash != null && to.hash !== '') {
      return {
        el: to.hash,
        top: 50,
      }
    }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      children: [
        {
          path: '',
          name: 'boss-list',
          component: BossList,
        },
        {
          path: 'boss/:flagId',
          name: 'boss-detail',
          component: BossDetail,
        },
        {
          path: 'events/:category',
          name: 'event-detail',
          component: EventCategoryDetail,
        },
      ],
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/map',
      name: 'map',
      component: () => import('../views/MapView.vue'),
    },
  ],
})

export default router
