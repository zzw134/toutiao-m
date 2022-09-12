/*
    请求模块
*/
import axios from 'axios'
import store from '@/store'
import JSONBig from 'json-bigint'
import { Toast } from 'vant'
import router from '@/router'

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// const jsonStr = '{"art_id": 1245953273786007552}'

// console.log(JSON.parse(jsonStr)) // {art_id: 1245953273786007600}

// JSONBig 可以处理数据中超过JavaScript安全整数范围的问题
// console.log(JSONBig.parse(jsonStr)) // {art_id: BigNumber} 把JSON格式的字符串转为javascript对象

// 使用的时候需要把BigNumber类型的数据转为字符串来使用
// console.log(JSONBig.parse(jsonStr).art_id.toString()) // 1245953273786007552

// console.log(JSON.stringify(JSONBig.parse(jsonStr))) // {"art_id":"1245953273786007552"}

// console.log(JSONBig.stringify(JSONBig.parse(jsonStr))) // {"art_id":1245953273786007552}
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const refreshTokenReq = axios.create({
  baseURL: 'http://toutiao-app.itheima.net'
})
const request = axios.create({
  // baseURL: 'http://ttapi.research.itcast.cn/', // 接口的基准路径
  baseURL: 'http://toutiao-app.itheima.net', // 接口的基准路径

  // 自定义后端返回的原始数据
  // data: 后端返回的原始数据, 说白了就是JSON格式的字符串
  transformResponse: [function (data) {
    // axios 默认会在内部这样来处理后端返回的数据
    try {
      return JSONBig.parse(data)
    } catch (err) {
      return data
    }
  }]
})
// 请求拦截器
request.interceptors.request.use(config => {
  // 请求发起会经过这里
  // config: 本次请求的请求配置对象
  const { user } = store.state
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  // 注意: 这里务必要返回config配置对象, 否则请求就停在这里出不去了
  return config
}, error => {
  // 如果请求出错了(还没有发出去) 会进去这里
  return Promise.reject(error)
})

// 响应拦截器
request.interceptors.response.use(response => {
  return response
}, async error => {
  const status = error.response.status

  if (status === 400) {
    // 客户端参数错误
    Toast.fail('客户端请求参数异常')
  } else if (status === 401) {
    // token无效
    // 如果没有user或者user.token, 直接去登陆
    const { user } = store.state
    if (!user || !user.token) {
      // 直接跳转到登录页
      return redirectLogin()
    }
    // 使用refresh_token, 请求获取新的token
    try {
      const { data } = await refreshTokenReq({
        method: 'PUT',
        url: '/v1_0/authorizations',
        headers: {
          Authorization: `Bearer ${user.refresh_token}`
        }
      })
      // 拿到新的token之后把它更新到容器中
      user.token = data.data.token
      store.commit('setUser', user)
      // 把失败的请求重新发出去
      // error.config是本次请求的相关配置信息对象
      // 这里使用request发请求, 他会走自己的拦截器
      // 它的请求拦截器中通过store容器访问token数据
      return request(error.config)
    } catch (err) {
      // 刷新token都失败了, 直接跳转登录页面
      redirectLogin()
    }
  } else if (status === 403) {
    // 没有权限操作
    Toast.fail('没有权限操作')
  } else if (status >= 500) {
    // 服务端异常
    Toast.fail('服务端异常, 请稍后重试')
  }

  // 抛出异常
  return Promise.reject(error)
})

function redirectLogin () {
  router.replace({
    name: 'login',
    // 传递查询参数，查询参数会以?作为分隔符放到url后面
    query: {
      // 数据名是自己起的
      // router.currentRoute和我们在组件中获取的this.$route是一个东西
      redirect: router.currentRoute.fullPath
    }
  })
}

export default request
