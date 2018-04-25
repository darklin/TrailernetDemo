<template>
  <div class="wrap-box">
    <div class="header-box clearfix">
      <div class="header-brand fl"></div>
      <div class="header-menu">
        <router-link to="/home/apply" class="header-menu-item" v-if="menus['apply']">申请客户</router-link>
        <router-link to="/home/visit" class="header-menu-item" v-if="menus['visit']">上门客户</router-link>
        <router-link to="/home/check" class="header-menu-item" v-if="menus['check']">复核处理</router-link>
        <router-link to="/home/bank" class="header-menu-item" v-if="menus['bank']">银行复核</router-link>
        <router-link to="/home/conf" class="header-menu-item" v-if="menus['conf']">系统配置</router-link>
      </div>
      <div class="header-user fr">
        <div class="header-user-bell fl"><span class="el-icon-time"></span><i class="header-user-tips">5</i></div>
        <div class="header-user-set fl"><span class="el-icon-setting"></span></div>
        <div class="header-user-name fl">{{userName}}</div>
        <div class="header-user-logout fl"><a @click="logoutHandle">退出</a></div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'home',
  data () {
    // 设置用户名
    let userName = this.$localStorage('userName')
    return {
      userName: userName,
      menus: {
        apply: false,
        visit: false,
        check: false,
        bank: false,
        conf: false
      }
    }
  },
  // beforeRouteEnter (to, from, next) {
  //   // 未登录跳转登录页
  //   let userName = window.localStorage.getItem('userName')
  //   if (!userName) {
  //     next({path: '/login'})
  //   } else {
  //     next()
  //   }
  // },
  created () {
    // 获取菜单权限
    this.$ajax({
      url: '/account/user/info/queryMenus',
      success: data => {
        let menus = data.attr.menus || []
        let path = null
        menus.forEach(submenu => {
          let menuUrl = submenu['menuUrl']
          if (menuUrl) {
            if (!path) path = menuUrl
            this.menus[menuUrl] = true
            let subMenus = submenu['subMenus']
            if (subMenus) this.$sessionStorage(menuUrl, JSON.stringify(subMenus))
          }
        })
        // 如果不是第一个路由，跳转到其他路由中
        if (path && path !== 'apply') this.$router.replace('/home/' + path)
      }
    })
  },
  methods: {
    // 注销
    logoutHandle () {
      this.$ajax({
        url: '/cust/loginOut',
        success: data => {
          this.$router.replace('/login')
        }
      })
    }
  }
}
</script>
