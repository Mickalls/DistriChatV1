import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import AuthService from '../services/auth'

// 路由配置
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: {
      title: '登录',
      requiresAuth: false
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: {
      title: '注册',
      requiresAuth: false
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: {
      title: '首页',
      requiresAuth: true
    }
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 全局前置守卫
router.beforeEach((to, _from, next) => {
  // 设置页面标题
  if (to.meta?.title) {
    document.title = `${to.meta.title} - DistriChat`
  }

  // 检查路由是否需要认证
  if (to.meta?.requiresAuth) {
    if (AuthService.isLoggedIn()) {
      next()
    } else {
      // 未登录，跳转到登录页
      next({
        path: '/login',
        query: { redirect: to.fullPath } // 保存原来要访问的路径
      })
    }
  } else {
    // 如果已登录用户访问登录或注册页，重定向到首页
    if ((to.path === '/login' || to.path === '/register') && AuthService.isLoggedIn()) {
      next('/dashboard')
    } else {
      next()
    }
  }
})

export default router
