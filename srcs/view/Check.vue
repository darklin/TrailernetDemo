<template>
  <div class="main-box">
    <div class="header-subnav">
      <router-link to="pendCheck" class="header-subnav-item" :class="routeName === 'PendCheckDesc' && 'router-link-active'" v-if="menus['pendCheck']">待复核</router-link>
      <router-link to="notPass" class="header-subnav-item" :class="routeName === 'NotPassDesc' && 'router-link-active'" v-if="menus['notPass']">复核不通过</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'check',
  data () {
    return {
      menus: {
        pendCheck: false,
        notPass: false
      },
      routeName: ''
    }
  },
  created () {
    let checkStr = this.$sessionStorage('check')
    if (checkStr) {
      let check = JSON.parse(checkStr)
      let path = null
      check.forEach(submenu => {
        let menuUrl = submenu['menuUrl']
        if (menuUrl) {
          if (!path) path = menuUrl
          this.menus[menuUrl] = true
        }
      })
      if (path && path !== 'pendCheck') this.$router.replace(path)
    }
  },
  watch: {
    '$route' (to, from, next) {
      this.routeName = to['name']
    }
  }
}
</script>
