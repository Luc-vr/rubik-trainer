import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'

// Hash-routing: werkt op elke statische host (GitHub Pages, Netlify) zonder rewrites.
// `titleKey` verwijst naar een tekst in lib/i18n.ts; App.vue zet daarmee de paginatitel.
export const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior: (_to, _from, saved) => saved ?? { top: 0 },
  routes: [
    { path: '/', name: 'home', component: HomeView, meta: { titleKey: 'navOverview' } },
    { path: '/set/:set(F2L|OLL|PLL)', name: 'set', component: () => import('./views/SetView.vue'), props: true },
    { path: '/case/:id', name: 'case', component: () => import('./views/CaseDetailView.vue'), props: true },
    { path: '/quiz', name: 'quiz', component: () => import('./views/QuizView.vue'), meta: { titleKey: 'navQuiz' } },
    { path: '/timer', name: 'timer', component: () => import('./views/TimerView.vue'), meta: { titleKey: 'navTimer' } },
    { path: '/notatie', name: 'notation', component: () => import('./views/NotationView.vue'), meta: { titleKey: 'navNotation' } },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})
