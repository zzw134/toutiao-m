import Vue from 'vue'
import VueRouter from 'vue-router'
import { Dialog } from 'vant'
import store from '@/store'

Vue.use(VueRouter)

// 路由表
const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: { requiresAuth: false } // 添加额外的自定义数据
  },
  {
    path: '/',
    // name: 'layout', // 如果父路由有默认子路由, 那么它的name没有意义
    component: () => import('@/views/layout/index.vue'),
    children: [
      {
        path: '', // 留空, 默认子路由, 只能有一个
        name: 'home',
        component: () => import('@/views/home'),
        meta: { requiresAuth: false }
      },
      {
        path: '/qa',
        name: 'qa',
        component: () => import('@/views/qa'),
        meta: { requiresAuth: false }
      },
      {
        path: '/video',
        name: 'video',
        component: () => import('@/views/video'),
        meta: { requiresAuth: false }
      },
      {
        path: '/my',
        name: 'my',
        component: () => import('@/views/my'),
        meta: { requiresAuth: false }
      }
    ]
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/search'),
    meta: { requiresAuth: false }
  },
  {
    path: '/article/:articleId',
    name: 'article',
    component: () => import('@/views/article'),
    props: true, // 开启Props传参, 说白了就是把路由参数映射到组件的props数据中
    meta: { requiresAuth: false }
  },
  {
    path: '/user/profile',
    name: 'user-profile',
    component: () => import('@/views/user-profile'),
    meta: { requiresAuth: false }
  },
  {
    path: '/user-chat',
    name: 'user-chat',
    component: () => import('@/views/user-chat'),
    meta: { requiresAuth: true }
  }
]

const router = new VueRouter({
  routes
})

// to: 要访问的页面路由信息
// from: 来自哪个页面的路由信息
// next: 放行的标记
router.beforeEach((to, from, next) => {
  // 校验登录状态, 提示用户
  if (to.meta.requiresAuth) {
    // 如果已登录, 则直接通过
    if (store.state.user) {
      return next()
    }
    // 没有登录, 提示是否登录
    Dialog.confirm({
      title: '访问提示',
      message: '该功能需要登录才能访问, 确认登录吗'
    })
      .then(() => {
        // on confirm
        router.replace({
          name: 'login',
          query: {
            redirect: router.currentRoute.fullPath
          }
        })
      })
      .catch(() => {
        // on cancel
        // 取消了, 停止路由导航
        next(false)
      })
  } else {
    // 不需要登录状态的页面, 直接过去
    next()
  }
})

export default router
