import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

let route = require('@/router/route').default
let routes = []
let ctrlRoute = ['satellite', 'monitor1', 'aTrack', 'aTrail', 'bTrack', 'bTrail', 'gTrack', 'gTrail', 'addVehicle', 'editVehicle', 'importVehicle', 'addUser', 'editUser', 'importUser', 'setRole', 'addOrg', 'editOrg', 'addRole', 'editRole', 'setAuth', 'tempMonitorDetail']
// 获取缓存菜单信息
let menus = window.sessionStorage.getItem('menus')
if (menus) {
  menus = JSON.parse(menus)
  let childrens = []
  // 第一个跳转的路由地址
  let first = ''
  for (let key in menus) {
    let subMenu = menus[key]['subMenu']
    // 如果没有子菜单就设置为一级菜单
    if (!subMenu) {
      if (!first) first = key
      childrens.push({path: key, name: route[key]['name'], component: route[key]['component']})
    } else {
      // 如果有子菜单就循环输出二级子菜单
      for (let subKey in subMenu) {
        if (!first) first = subKey
        let childMenu = subMenu[subKey]['childMenu']
        if (!childMenu) {
          childrens.push({path: subKey, name: route[subKey]['name'], component: route[subKey]['component']})
        } else {
          // 输出三级子菜单
          for (let childKey in childMenu) {
            childrens.push({path: childKey, name: route[childKey]['name'], component: route[childKey]['component']})
          }
        }
      }
    }
  }
  ctrlRoute.forEach(key => {
    childrens.push({path: key, name: route[key]['name'], component: route[key]['component']})
  })
  // 首页跳转到第一个菜单
  childrens.unshift({path: '/', name: 'Home', redirect: first})
  routes = [
    {path: '/', name: 'Default', redirect: 'home'},
    {
      path: '/home',
      component: route['home']['component'],
      children: childrens
    },
    {path: '/login', name: route['login']['name'], component: route['login']['component']},
    {path: '*', name: route['error']['name'], component: route['error']['component']}
  ]
} else {
  routes = [
    {path: '/', name: route['home']['name'], component: route['home']['component']},
    {path: '/login', name: route['login']['name'], component: route['login']['component']},
    {path: '*', name: 'Default', redirect: 'login'}
  ]
}

const router = new Router({
  base: '/',
  mode: 'hash',
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  },
  routes: routes
})

export default router
