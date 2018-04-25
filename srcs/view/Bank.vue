<template>
  <div class="main-box">
    <div class="header-subnav">
      <router-link to="pendCheck" class="header-subnav-item" :class="routeName === 'PendBankDesc' && 'router-link-active'" v-if="menus['pendCheck']">待复核</router-link>
      <router-link to="pendLoan" class="header-subnav-item" :class="routeName === 'PendLoanDesc' && 'router-link-active'" v-if="menus['pendLoan']">待放款</router-link>
      <router-link to="loanSuccess" class="header-subnav-item" :class="routeName === 'LoanSuccessDesc' && 'router-link-active'" v-if="menus['loanSuccess']">放款成功</router-link>
      <router-link to="notPass" class="header-subnav-item" :class="routeName === 'NotBankDesc' && 'router-link-active'" v-if="menus['notPass']">复核不通过</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'bank',
  data () {
    return {
      menus: {
        pendCheck: false,
        pendLoan: false,
        loanSuccess: false,
        notPass: false
      },
      routeName: ''
    }
  },
  created () {
    let bankStr = this.$sessionStorage('bank')
    if (bankStr) {
      let bank = JSON.parse(bankStr)
      let path = null
      bank.forEach(submenu => {
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
