import { createRouter, createWebHistory } from 'vue-router'
import SearchView from '@/views/SearchView.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/search' },
    { path: '/search', name: 'search', component: SearchView },
    { path: '/library', name: 'library', component: () => import('@/views/LibraryView.vue') },
    { path: '/movie/:id(\\d+)', name: 'movie', component: () => import('@/views/MovieView.vue'), props: true },
    { path: '/discover', name: 'discover', component: () => import('@/views/DiscoverView.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/search' },
  ],
  scrollBehavior: (_to, _from, saved) => saved ?? { top: 0 },
})
