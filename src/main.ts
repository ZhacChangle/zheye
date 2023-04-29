import { createApp, h } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import 'easymde/dist/easymde.min.css'
axios.defaults.baseURL = 'https://mock.apifox.cn/m1/2128399-0-default/api/'
axios.interceptors.request.use((config) => {
  if (config.url !== '/upload') store.commit('setLoading', true)
  // 请求成功后将 status 置为 false 不然 watch 无法监听到 status 的变化 二次验证失败的时候不会弹出 alter
  store.commit('setError', { status: false, message: '' })

  return config
})

axios.interceptors.response.use(
  (config) => {
    store.commit('setLoading', false)
    return config
  },
  (e) => {
    const { error } = e.response.data
    store.commit('setError', { status: true, message: error })
    store.commit('setLoading', false)
    return Promise.reject(error)
  }
)
// 添加默认 query 参数 当有其他 query 参数时 这个参数被放在最后
// axios.interceptors.request.use((config) => {
//   config.params = { ...config.params, icode: '123' }
//   return config
// })

const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')
