import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import '@/assets/styles/variables.css'
import '@/assets/styles/base.css'
import '@/assets/styles/components.css'
import '@/assets/styles/layout.css'

createApp(App)
  .use(createPinia())
  .use(router)
  .mount('#app')
