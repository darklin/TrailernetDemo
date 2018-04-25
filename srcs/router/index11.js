import Vue from 'vue'
import Router from 'vue-router'

// import Home from '@/view/Home'
// import Login from '@/view/Login'
// import Error from '@/view/Error'

// import Index from '@/view/Index'
// import Monitor from '@/view/Monitor'
// import RemindDetail from '@/view/remind/RemindDetail'
let route = require('@/router/route').default
let routes = []
if (window.sessionStorage.getItem('routes')) {
  routes = [
    {path: '/', name: 'Default', redirect: 'home'},
    {
      path: '/home',
      component: route['home']['component'],
      meta: { requiresAuth: true },
      children: [
        { path: '/', name: 'Home', redirect: 'index' },
        { path: 'index', name: 'Index', component: require('@/view/Index') },
        { path: 'monitor', name: 'Monitor', component: require('@/view/Monitor') },
        { path: 'remindDetail', name: 'RemindDetail', component: require('@/view/remind/RemindDetail') }
      ]
    },
    {path: '/login', name: route['login']['name'], component: route['login']['component']},
    {path: '*', name: route['error']['name'], component: route['error']['component']}
  ]
} else {
  routes = [
    {path: '/', name: route['home']['name'], component: route['home']['component']},
    {path: '/login', name: route['login']['name'], component: route['login']['component']},
    {path: '*', name: route['error']['name'], component: route['error']['component']}
  ]
}

Vue.use(Router)

const router = new Router({
  base: '/',
  mode: 'history',
  routes: routes
  // routes: [
  //   { path: '/', name: 'Home', component: Home },
  //   { path: '/', name: 'Default', redirect: 'home' },
  //   {
  //     path: '/home',
  //     component: Home,
  //     meta: { requiresAuth: true },
  //     children: [
  //       { path: '/', name: 'Home', redirect: 'index' },
  //       { path: 'index', name: 'Index', component: Index },
  //       { path: 'monitor', name: 'Monitor', component: Monitor },
  //       { path: 'remindDetail', name: 'RemindDetail', component: RemindDetail }
  //     ]
  //   },
  //   { path: '/login', name: 'Login', component: Login },
  //   { path: '*', name: 'Error', component: Error }
  // ]
})

// 权限拦截
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (window.sessionStorage.getItem('token')) {
      next({
        path: '/login'
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
