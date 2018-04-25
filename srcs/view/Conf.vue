<template>
  <div class="conf-box">
    <div class="sidebar-box">
      <div class="conf-menu-box">
        <div class="menu-item" v-if="baseConf">
          <div class="menu-item-text">基础资料</div>
          <div class="menu-subitem-box">
            <router-link to="financialConf" class="menu-subitem" v-if="menus['financialConf']">金融机构配置</router-link>
            <router-link to="universityConf" class="menu-subitem" v-if="menus['universityConf']">重点大学配置</router-link>
            <router-link to="companyConf" class="menu-subitem" v-if="menus['companyConf']">特殊企业配置</router-link>
            <router-link to="jobConf" class="menu-subitem" v-if="menus['jobConf']">职业配置</router-link>
            <router-link to="dataConf" class="menu-subitem" v-if="menus['dataConf']">资料配置</router-link>
            <router-link to="ruleConf" class="menu-subitem" v-if="menus['ruleConf']">规则配置</router-link>
          </div>
        </div>
        <div class="menu-item" v-if="loanConf">
          <div class="menu-item-text">贷款产品配置</div>
          <div class="menu-subitem-box">
            <router-link to="baseConf" class="menu-subitem" v-if="menus['baseConf']">基本配置</router-link>
            <router-link to="allowConf" class="menu-subitem" v-if="menus['allowConf']">准贷条件</router-link>
          </div>
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'conf',
  data () {
    return {
      menus: {
        financialConf: false,
        universityConf: false,
        companyConf: false,
        jobConf: false,
        dataConf: false,
        ruleConf: false,
        baseConf: false,
        allowConf: false
      },
      baseConf: false,
      loanConf: false
    }
  },
  created () {
    let confStr = this.$sessionStorage('conf')
    if (confStr) {
      let conf = JSON.parse(confStr)
      let path = null
      conf.forEach(submenu => {
        let menuUrl = submenu['menuUrl']
        let menuCode = submenu['menuCode']
        if (!this[menuCode]) this[menuCode] = true
        if (menuUrl) {
          if (!path) path = menuUrl
          this.menus[menuUrl] = true
        }
      })
      if (path && path !== 'financialConf') this.$router.replace(path)
    }
  }
}
</script>
