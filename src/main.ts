import { createApp } from 'vue'

import App from '@/App.vue'
import '@jamescoyle/svg-icon'
import { createPinia } from 'pinia'

import '@/assets/main.css'

import i18n from '@/i18n'

import router from '@/router'

const app = createApp(App)

app.use(i18n)
app.use(createPinia())
app.use(router)

app.mount('#app')
