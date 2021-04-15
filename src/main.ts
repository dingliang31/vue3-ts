import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/main.styl'
import '@/assets/main.css'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css';
import draggable from 'vuedraggable'
import axios from 'axios'
import _ from 'lodash'

const app = createApp(App).use(store).use(router)
app.config.globalProperties.$axios = axios
app.provide('_', _)

app.component('draggable', draggable)
app.use(ElementPlus)
app.mount('#app')
