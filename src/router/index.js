import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue'),
    meta: { title: '在线充值', keepAlive: false }
  },
  {
    path: '/bind',
    name: 'Bind',
    component: () => import('../views/Bind.vue'),
    meta: { title: '绑定手机号', keepAlive: false }
  }
]

const router = new VueRouter({
  routes,
  scrollBehavior: () => ({ y: 0 })
})

export default router
