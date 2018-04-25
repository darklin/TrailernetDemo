<template>
  <div class="main-box">
    <div class="header-subnav">
      <router-link to="newCust" class="header-subnav-item" :class="routeName === 'WriteData' && 'router-link-active'" v-if="menus['newCust']">新客户</router-link>
      <router-link to="doCust" class="header-subnav-item" v-if="menus['doCust']">采集中</router-link>
      <router-link to="backCust" class="header-subnav-item" v-if="menus['backCust']">退回处理</router-link>
      <router-link to="allCust" class="header-subnav-item" v-if="menus['allCust']">所有客户</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'visit',
  data () {
    return {
      menus: {
        newCust: false,
        doCust: false,
        backCust: false,
        allCust: false
      },
      routeName: ''
    }
  },
  watch: {
    '$route' (to, from, next) {
      this.routeName = to['name']
    }
  },
  created () {
    let visitStr = this.$sessionStorage('visit')
    if (visitStr) {
      let visit = JSON.parse(visitStr)
      let path = null
      visit.forEach(submenu => {
        let menuUrl = submenu['menuUrl']
        if (menuUrl) {
          if (!path) path = menuUrl
          this.menus[menuUrl] = true
        }
      })
      if (path && path !== 'newCust') this.$router.replace(path)
    }
  }
}
</script>
