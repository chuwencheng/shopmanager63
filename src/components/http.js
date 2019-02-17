// 把axios变成vue的插件
// 在main.js中可以Vue.use(axios)
import axios from 'axios'

const httpSever = {}

httpSever.install = function (Vue) {
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
  const AUTH_TOKEN = localStorage.getItem('token')
  axios.defaults.headers.common['Authorization'] = AUTH_TOKEN

  Vue.prototype.$http = axios
}
export default httpSever
