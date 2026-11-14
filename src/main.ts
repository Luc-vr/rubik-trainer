import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './router'
import { initCube } from './lib/cube'
import './style.css'

async function start() {
  try {
    await initCube()
  } catch (e) {
    console.error('Kubusmodel kon niet geladen worden', e)
  }
  createApp(App).use(createPinia()).use(router).mount('#app')
}

start()
