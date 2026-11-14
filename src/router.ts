import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'

// Hash-routing: werkt op elke statische host (GitHub Pages, Netlify) zonder rewrites.
export const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior: (_to, _from, saved) => saved ?? { top: 0 },
  routes: [
    { path: '/', name: 'home', component: HomeView, meta: { title: 'Overzicht' } },
    { path: '/set/:set(F2L|OLL|PLL)', name: 'set', component: () => import('./views/SetView.vue'), props: true },
    { path: '/case/:id', name: 'case', component: () => import('./views/CaseDetailView.vue'), props: true },
    { path: '/quiz', name: 'quiz', component: () => import('./views/QuizView.vue'), meta: { title: 'Quiz' } },
    { path: '/timer', name: 'timer', component: () => import('./views/TimerView.vue'), meta: { title: 'Timer' } },
    { path: '/notatie', name: 'notation', component: () => import('./views/NotationView.vue'), meta: { title: 'Notatie' } },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.afterEach((to) => {
  const t = to.meta.title as string | undefined
  document.title = t ? `${t} · CFOP-trainer` : 'CFOP-trainer'
})
