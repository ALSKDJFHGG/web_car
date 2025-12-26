import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Layout from '@/layout/index.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { title: '首页' }
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('@/views/users/UserList.vue'),
        meta: { title: '用户管理' }
      },
      {
        path: 'questions',
        name: 'Questions',
        component: () => import('@/views/questions/QuestionList.vue'),
        meta: { title: '试题管理' }
      },
      {
        path: 'exams',
        name: 'Exams',
        component: () => import('@/views/exams/ExamConfig.vue'),
        meta: { title: '考试配置' }
      },
      {
        path: 'logs',
        name: 'Logs',
        component: () => import('@/views/logs/LogList.vue'),
        meta: { title: '日志管理' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path === '/login') {
    // 如果已登录，跳转到首页
    if (token) {
      next('/')
    } else {
      next()
    }
  } else {
    // 需要登录的页面
    if (token) {
      next()
    } else {
      next('/login')
    }
  }
})

export default router

