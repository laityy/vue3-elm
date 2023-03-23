import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './style/common.scss'
import './style/scroll.scss'

const app = createApp(App)
console.log(app)

app.use(router).use(store).mount('#app')
