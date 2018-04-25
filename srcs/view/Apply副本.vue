<template>
  <div class="main-box">
    <div class="header-subnav">
      <router-link to="myWork" class="header-subnav-item" v-if="menus['myWork']">我的工作台</router-link>
      <router-link to="applyList" class="header-subnav-item" v-if="menus['applyList']">申请列表</router-link>
      <router-link to="orderCust" class="header-subnav-item" v-if="menus['orderCust']">预约客户中</router-link>
      <router-link to="otherCust" class="header-subnav-item" v-if="menus['otherCust']">其他客户</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'apply',
  data () {
    return {
      menus: {
        myWork: false,
        applyList: false,
        orderCust: false,
        otherCust: false
      }
    }
  },
  created () {
    let applyStr = this.$sessionStorage('apply')
    if (applyStr) {
      let apply = JSON.parse(applyStr)
      let path = null
      apply.forEach(submenu => {
        let menuUrl = submenu['menuUrl']
        if (menuUrl) {
          if (!path) path = menuUrl
          this.menus[menuUrl] = true
        }
      })
      if (path && path !== 'myWork') this.$router.replace(path)
    }
  }
}
</script>
