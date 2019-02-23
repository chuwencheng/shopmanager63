// 把axios变成vue的插件
// 在main.js中可以Vue.use(axios)
import axios from 'axios'
// import { Message } from 'element-ui'

const httpSever = {}

httpSever.install = function (Vue) {
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

  // 请求拦截器
  axios.interceptors.request.use(function (config) {
    // 发请求之前做些什么
    // console.log(config)
    if (config.url !== 'login') {
      const AUTH_TOKEN = localStorage.getItem('token')
      // config.headers.common['Authorization'] = AUTH_TOKEN
      config.headers['Authorization'] = AUTH_TOKEN
    }
    return config
  }, function (error) {
    // 请求错误时做些什么
    return Promise.reject(error)
  })

  // 添加响应拦截器
  // axios.interceptors.response.use(function (response) {
  //   // 对响应数据做点什么
  //   console.log("响应拦截器触发-----")
  //   // return response;
  //   const { meta: { msg, status }, data } = response.data
  //   if (status !== 200 && status !== 201) {
  //     Message.warning(msg)
  //   }
  // }, function (error) {
  //   // 对响应错误做点什么
  //   return Promise.reject(error)
  // });

  Vue.prototype.$http = axios
}
export default httpSever
